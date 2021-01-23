const { Constants, LolApi } = require("twisted")
require("dotenv").config({ path: '../../../.env' })

const NAME = "happyfridge24"
const REGION = Constants.Regions.OCEANIA
const MATCH_TYPE_ID = 450 // arams
const MATCH_BATCH_SIZE = 100

const api = new LolApi({
    key : process.env.API_KEY,
    rateLimitRetry: false,
    rateLimitRetryAttempts: 0
})


async function getSummoner(name, region) {
    return (await api.Summoner.getByName(name, region)).response
}

async function getMatch(id, region, accountId) {
    let match = await api.Match.get(id, region)
    let player = {
        id,
        team: "",
        stats: {
            win: false,
            topFragger: false,
            kills: {},
            deaths: 0,
            assists: 0,
            damageDealtToChampions: 0,
            totalMinionsKilled: 0,
            goldEarned: 0,
        },
        opponents: []
    }
    let mostKills = 0;

    match.response.participantIdentities.forEach(summoner => {
        if (summoner.player.accountId === accountId) {
            player.id = summoner.participantId
        } else {
            player.opponents.push(summoner.player.summonerName)
        }
    });

    match.response.participants.forEach(summoner => {
        if (summoner.participantId === player.id) {
            player.team = (summoner.teamId === 100) ? "BOT SIDE" : "TOP SIDE"
            player.stats.win = summoner.stats.win
            player.stats.kills = {
                total: summoner.stats.kills,
                doubleKills: summoner.stats.doubleKills,
                tripleKills: summoner.stats.tripleKills,
                quadraKills: summoner.stats.quadraKills,
                pentaKills: summoner.stats.pentaKills
            }
            player.stats.deaths = summoner.stats.deaths
            player.stats.assists = summoner.stats.assists
            player.stats.damageDealtToChampions = summoner.stats.totalDamageDealtToChampions
            player.stats.totalMinionsKilled = summoner.stats.totalMinionsKilled
            player.stats.goldEarned = summoner.stats.goldEarned
        }

        if (summoner.stats.kills > mostKills) mostKills = summoner.stats.kills
    })

    player.topFragger = player.stats.kills.total === mostKills

    return player
    
}

/**
 *
 * @param name {string}
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

async function collectAllData(name, region, type, amount= -1) {
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

collectAllData(NAME, REGION, MATCH_TYPE_ID, 5)
