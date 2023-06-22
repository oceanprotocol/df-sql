const express = require("express")
const { getPredictoorData, getPredictoorRewards } = require("../../services/rewards_info")
const router = express.Router()

router.post("/data", async (req, res) => {
    let data = await getPredictoorData(req.body)
    res.json(data)
})

router.post("/rewards", async (req, res) => {
    let data = await getPredictoorRewards(req.body)
    res.json(data)
})

module.exports = router
