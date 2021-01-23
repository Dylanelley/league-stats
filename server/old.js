const { Constants } = require("twisted")

require("dotenv").config({ path: '../.env' })

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

async function getMatch(id, region, accountId) {
    let match = await api.Match.get(id, region)
    let myId
    let team
    let win
    let topFragger = false
    let mostKills = 0
    let myStats = {}
    let summoners = []

    match.response.participantIdentities.forEach(summoner => {
        if (summoner.player.accountId === accountId) {
            myId = summoner.participantId
        } else {
            summoners.push(summoner.player.summonerName)
        }
    });

    match.response.participants.forEach(summoner => {
        if (summoner.participantId === myId) {
            team = (summoner.teamId === 100) ? "BOT SIDE" : "TOP SIDE"
            win = summoner.stats.win
            myStats.kills = [summoner.stats.kills, summoner.stats.doubleKills, summoner.stats.tripleKills, summoner.stats.quadraKills, summoner.stats.pentaKills]
            myStats.deaths = summoner.stats.deaths
            myStats.assists = summoner.stats.assists
            myStats.damageToChamps = summoner.stats.totalDamageDealtToChampions
            myStats.cs = summoner.stats.totalMinionsKilled
            myStats.goldValue = summoner.stats.goldEarned
        }
        if (summoner.stats.kills > mostKills) {
            mostKills = summoner.stats.kills
        }
    })

    if (myStats.kills[0] === mostKills) topFragger = true

    return {win, team, topFragger, stats: myStats, summoners}
    
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
    let summoner = await getSummoner(name, region)
    
    let filter = {
        queue: type,
        beginIndex: 0
    }

    let matches = []
    let response

    do {
        if (0 < amount) {
            if (amount < MATCH_BATCH_SIZE) {
                filter.endIndex = filter.beginIndex + amount
                amount = 0
            } else {
                amount -= MATCH_BATCH_SIZE
            }
        }

        response  = (await api.Match.list(summoner.accountId, region, filter)).response
        matches = matches.concat(response.matches)
        filter.beginIndex = response.endIndex
    } while ((response.startIndex !== response.endIndex) && amount !== 0)
    
    return {summoner, matches}
}

async function collectAllData(name, region, type, amount=0) {
    console.log("Finding Matches ...")
    
    let collection = await getMatches(name, region, type, amount)
    let length = collection.matches.length

    for (let i = 0; i < length; i++) {
        console.log(i+1 + "/" + length)
        collection.matches[i].gameStats = await getMatch(collection.matches[i].gameId, region, collection.summoner.accountId)
    }

    collection.matches[0].championName = Constants.Champions[collection.matches[0].champion]
    console.log(collection.matches[0])
    return collection
}

collectAllData(sumName, sumRegion, matchType, 5)
