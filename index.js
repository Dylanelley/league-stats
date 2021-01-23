const { Constants } = require("twisted")
const {performance} = require('perf_hooks');
const sleep = require("system-sleep")


require("dotenv").config()
// API_KEY = process.env.API_KEY
let LolApiObject = require("twisted").LolApi

// rate Limit
const RATE_LIMIT = parseFloat(process.env.REQUEST_TIME)

// user variables
let sumName = "happyfridge24"
let sumRegion = Constants.Regions.OCEANIA
let matchType = 450 // arams


const api = new LolApiObject({
    key : process.env.API_KEY,
    rateLimitRetry: false,
    rateLimitRetryAttempts: 0
})

async function fetchSummonerDetails(name, region) {
    return (await api.Summoner.getByName(name, region)).response
}
async function fetchMatch(id, region, filter) {
    let rawMatches = await api.Match.list(id, region, filter)
    rawMatches.response.matches.forEach(m => {
        m.championName = Constants.Champions[m.champion]
        delete m.lane
        delete m.role
        delete m.season
        delete m.platformId
    });
    return rawMatches.response
}

async function fetchGame(id, region, accountId) {
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
        }
        else {
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
    if (myStats.kills[0] == mostKills) {
        topFragger = true
    }
    return {win: win, team: team, topFragger: topFragger, stats: myStats, otherGamers: otherGamers}
    
}

async function getMatchesShort(name, region, type, amount) {
    let user = await fetchSummonerDetails(name, region)
    
    let filter = {
        queue: type,
        beginIndex: 0,
        endIndex: amount
    }

    let rawMatches = await fetchMatch(user.accountId, region, filter)
    let userOb = {summoner: user, matches: rawMatches.matches}
    return userOb
}

async function getAllMatches(name, region, type) {
    let user = await fetchSummonerDetails(name, region)
    
    let filter = {
        queue: type,
        beginIndex: 0
    }
    let totalMatches = []
    let matchBatch
    
    

    do {
        matchBatch = await fetchMatch(user.accountId, region, filter)
        totalMatches = totalMatches.concat(matchBatch.matches)
        
        console.log(filter.beginIndex + " : " + matchBatch.endIndex)

        filter.beginIndex = matchBatch.endIndex

    } while (matchBatch.endIndex != matchBatch.startIndex)

    let userOb = {summoner: user, matches: totalMatches}
    
    return userOb
}

async function collectAllData(name, region, type, amount=0) {
    console.log("Finding Matches ...")
    let t0 = performance.now()
    let collection
    if (amount < 100 && amount > 0) {
        collection = await getMatchesShort(name, region, type, amount)
    }
    else {
        collection = await getAllMatches(name, region, type)
    }
    let t1 = performance.now()
    let length = collection.matches.length

    let minTime = Math.ceil(length/100) * RATE_LIMIT
    let actualTime = t1 - t0
    let sleepTime = (actualTime >= minTime) ? 0 : Math.floor(minTime - actualTime)
    console.log("Initial sleep : " + sleepTime + "ms")
    //sleep(10)
    
    let actualTimePassed
    for (let i = 0; i < length; i++) {
        console.log(i+1 + "/" + length)
        t0 = performance.now()
        collection.matches[i].gameStats = await fetchGame(collection.matches[i].gameId, region, collection.summoner.accountId)   
        t1 = performance.now()
        actualTimePassed =  t1 - t0
        sleepTime = (actualTImePassed > RATE_LIMIT) ? 0 : (RATE_LIMIT - actualTimePassed)
        console.log("Waiting : " + sleepTime + "ms")
        
    }
    console.log(collection.matches[0])
    return collection
}



collectAllData(sumName, sumRegion, matchType)