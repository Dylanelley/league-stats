const LolStats = require('../lib/lol-stats/index')

require("dotenv").config({ path: '../.env' })

const api = new LolStats({
    key : process.env.API_KEY,
    rateLimitRetry: false,
    rateLimitRetryAttempts: 0
})

exports.index = async (req, res) => {
    return res.json(await api.getMatchesStats(req.body))
}