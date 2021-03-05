const { Constants, LolApi } = require("twisted")

const MATCH_BATCH_SIZE = 100


function waiter(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}


module.exports = class LolStats {
    constructor(options) {
        this.api = new LolApi(options)
    }

    async getSummoner(name, region) {
        return (await this.api.Summoner.getByName(name, region)).response
    }

    async getMatch(id, region, summonerId) {
        let match = await this.api.Match.get(id, region)
        let player = {
            participantId: null,
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
            
            if (summoner.player.summonerId === summonerId) {
                player.participantId = summoner.participantId
            } else {
                player.opponents.push(summoner.player.summonerName)
            }
        });

        match.response.participants.forEach(summoner => {
            
            if (summoner.participantId === player.participantId) {
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

    async getMatches(summoner, region, type, amount= -1) {
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

            response  = (await this.api.Match.list(summoner.accountId, region, filter)).response
            matches = matches.concat(response.matches)
            filter.beginIndex = response.endIndex
        } while ((response.startIndex !== response.endIndex) && amount !== 0)

        return matches
    }

    async getMatchesStats({name, region, type, amount= -1}) {
        console.log("Finding Matches ...")

        let summoner = await this.getSummoner(name, region)
        
        let matches = await this.getMatches(summoner, region, type, amount)
        let length = matches.length

        let championInfo = {}
        let overallInfo = {
            gamesPlayed: length,
            wins: 0,
            averageKDA: [0, 0, 0],
            pentaKills: 0
        }
        
        // loop through all matches
        for (let i = 0; i < length; i++) {
            console.log(i+1 + "/" + length)
            await waiter(1000)
            matches[i].match = await this.getMatch(matches[i].gameId, region, summoner.id)
            matches[i].championName = Constants.Champions[matches[i].champion]
            
            // overall info
            
            overallInfo.wins += (matches[i].match.stats.win ? 1 : 0)
            overallInfo.averageKDA[0] += matches[i].match.stats.kills.total
            overallInfo.averageKDA[1] += matches[i].match.stats.deaths
            overallInfo.averageKDA[2] += matches[i].match.stats.assists
            overallInfo.pentaKills += matches[i].match.stats.kills.pentaKills
            
            // info by champion
            if (championInfo[matches[i].championName] === undefined) {
                championInfo[matches[i].championName] = {
                    gamesPlayed: 1,
                    wins: (matches[i].match.stats.win ? 1 : 0),
                    averageKDA: [matches[i].match.stats.kills.total, matches[i].match.stats.deaths, matches[i].match.stats.assists],
                    maxKills: matches[i].match.stats.kills.total,
                    totalPentaKills: matches[i].match.stats.kills.pentaKills
                }
            }
            else {
                championInfo[matches[i].championName].gamesPlayed += 1
                championInfo[matches[i].championName].wins += (matches[i].match.stats.win ? 1 : 0)
                championInfo[matches[i].championName].averageKDA[0] += matches[i].match.stats.kills.total
                championInfo[matches[i].championName].averageKDA[1] += matches[i].match.stats.deaths
                championInfo[matches[i].championName].averageKDA[2] += matches[i].match.stats.assists
                championInfo[matches[i].championName].maxKills = (matches[i].match.stats.kills.total > championInfo[matches[i].championName].maxKills ? matches[i].match.stats.kills.total : championInfo[matches[i].championName].maxKills)
                championInfo[matches[i].championName].totalPentaKills += matches[i].match.stats.kills.pentaKills
            }
        }
        console.log(matches[0])
        // averaging KDA's
        
        overallInfo.averageKDA = overallInfo.averageKDA.map(x => x/overallInfo.gamesPlayed)
        for (let champ in championInfo) {
            championInfo[champ].averageKDA = championInfo[champ].averageKDA.map(x => x/championInfo[champ].gamesPlayed)
        }
        

        // building return object
        let stats = {
            overall : overallInfo,
            champion : championInfo
        }
        return stats
    }
}
