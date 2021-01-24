const LolApiWrapper = require('../lib/lol-stats/index')
const { Constants } = require('twisted')

require("dotenv").config({ path: '../.env' })

const api = new LolApiWrapper({
    key : process.env.API_KEY,
    rateLimitRetry: false,
    rateLimitRetryAttempts: 0
})

const NAME = "happyfridge24"
const REGION = Constants.Regions.OCEANIA
const MATCH_TYPE_ID = 450 // arams


exports.index = async (req, res) => {
    return res.json(await api.getMatchesStats(NAME, REGION, MATCH_TYPE_ID, 1));
}