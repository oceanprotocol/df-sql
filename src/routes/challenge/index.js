const express = require("express")
const { getChallengeData, getChallengeRewards } = require("../../services/challenge")
const router = express.Router()

router.post("/data", async (req, res) => {
    let data = await getChallengeData(req.body)
    res.json(data)
})

router.post("/rewards", async (req, res) => {
    let data = await getChallengeRewards(req.body)
    res.json(data)
})

module.exports = router
