const express = require("express")
const { getPredictoorData, getPredictoorRewards, getPredictoorSummary } = require("../../services/predictoor")
const router = express.Router()

router.post("/data", async (req, res) => {
    let data = await getPredictoorData(req.body)
    res.json(data)
})

router.post("/rewards", async (req, res) => {
    let data = await getPredictoorRewards(req.body)
    res.json(data)
})


router.post("/summary", async (req, res) => {
    let data = await getPredictoorSummary(req.body)
    res.json(data)
})

module.exports = router
