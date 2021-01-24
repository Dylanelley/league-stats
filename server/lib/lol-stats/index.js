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

    async getMatch(id, region, accountId) {
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
            if (summoner.player.accountId === accountId) {
                player.participantId = summoner.participantId
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
     * @param summoner
     * @param region
     * @param type
     * @param amount {number} number of matches to get, -1 or amount larger than number of matches grabs all matches
     * @returns {Promise<*[]>}
     */
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

    async getMatchesStats(name, region, type, amount= -1) {
        console.log("Finding Matches ...")

        let summoner = await this.getSummoner(name, region)
        let matches = await this.getMatches(summoner, region, type, amount)
        let length = matches.length

        for (let i = 0; i < length; i++) {
            console.log(i+1 + "/" + length)
            matches[i].match = await this.getMatch(matches[i].gameId, region, summoner.accountId)
            matches[i].championName = Constants.Champions[matches[i].champion]
        }

        console.log(matches[0])

        return matches
    }
}
