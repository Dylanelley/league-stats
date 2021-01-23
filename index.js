const { Constants } = require("twisted")

require("dotenv").config()

let LolApiObject = require("twisted").LolApi

// rate Limit
const RATE_LIMIT = parseFloat(process.env.REQUEST_TIME)
const MATCH_BATCH_SIZE = 100

// user variables
let sumName = "happyfridge24"
let sumRegion = Constants.Regions.OCEANIA
let matchType = 450 // arams


const api = new LolApiObject({
    key : process.env.API_KEY,
    rateLimitRetry: false,
    rateLimitRetryAttempts: 0
})

async function getSummoner(name, region) {
    return (await api.Summoner.getByName(name, region)).response
}

async function getMatch(id, region, filter) {
    let response  = (await api.Match.list(id, region, filter)).response
    response.matches.forEach(match => {
        match.championName = Constants.Champions[match.champion]
        delete match.lane
        delete match.role
        delete match.season
        delete match.platformId
    });
    return response
}

async function getGame(id, region, accountId) {
    let gameData = await api.Match.get(id, region)
    let myId
    let team
    let win
    let topFragger = false
    let mostKills = 0
    let myStats = {}
    let otherGamers = []

    gameData.response.participantIdentities.forEach(gamer => {
        if (gamer.player.accountId == accountId) {
            myId = gamer.participantId
        } else {
            otherGamers.push(gamer.player.summonerName)
        }
    });

    gameData.response.participants.forEach(gamer => {
        if (gamer.participantId == myId) {
            team = (gamer.teamId == 100) ? "BOT SIDE" : "TOP SIDE" 
            win = gamer.stats.win
            myStats.kills = [gamer.stats.kills, gamer.stats.doubleKills, gamer.stats.tripleKills, gamer.stats.quadraKills, gamer.stats.pentaKills]
            myStats.deaths = gamer.stats.deaths
            myStats.assists = gamer.stats.assists
            myStats.damageToChamps = gamer.stats.totalDamageDealtToChampions
            myStats.cs = gamer.stats.totalMinionsKilled
            myStats.goldValue = gamer.stats.goldEarned
        }
        if (gamer.stats.kills > mostKills) {
            mostKills = gamer.stats.kills
        }
    })

    if (myStats.kills[0] === mostKills) topFragger = true

    return {win: win, team: team, topFragger: topFragger, stats: myStats, otherGamers: otherGamers}
    
}

/**
 *
 * @param name
 * @param region
 * @param type
 * @param amount {number} number of matches to get, -1 or amount larger than number of matches grabs all matches
 * @returns {Promise<{summoner: {}, matches: *[]}>}
 */
async function getMatches(name, region, type, amount= -1) {
    let user = await getSummoner(name, region)
    
    let filter = {
        queue: type,
        beginIndex: 0
    }

    let totalMatches = []
    let matchBatch

    do {
        if (0 < amount) {
            if (amount < MATCH_BATCH_SIZE) {
                filter.endIndex = filter.beginIndex + amount
                amount = 0
            } else {
                amount -= MATCH_BATCH_SIZE
            }
        }

        matchBatch = await getMatch(user.accountId, region, filter)
        totalMatches = totalMatches.concat(matchBatch.matches)

        console.log(filter.beginIndex + " : " + matchBatch.endIndex)

        filter.beginIndex = matchBatch.endIndex
    } while ((matchBatch.startIndex !== matchBatch.endIndex) && amount !== 0)
    
    return {summoner: user, matches: totalMatches}
}

async function collectAllData(name, region, type, amount=0) {
    console.log("Finding Matches ...")
    
    let collection = await getMatches(name, region, type, amount)
    let length = collection.matches.length
    
    let actualTimePassed
    for (let i = 0; i < length; i++) {
        console.log(i+1 + "/" + length)
        collection.matches[i].gameStats = await getGame(collection.matches[i].gameId, region, collection.summoner.accountId)
    }

    console.log(collection.matches[0])
    return collection
}

collectAllData(sumName, sumRegion, matchType, 5)
