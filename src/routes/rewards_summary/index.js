const express = require("express")
const { getRewardsSummary } = require("../../services/rewards_summary")
const router = express.Router()

router.post("/rewardsSummary", async (req, res) => {
    let data = await getRewardsSummary(req.body)
    res.json(data)
})

module.exports = router
