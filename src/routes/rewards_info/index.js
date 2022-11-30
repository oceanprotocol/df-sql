const express = require("express")
const { getRewards } = require("../../services/rewards_info")
const router = express.Router()

router.post("/rewards", async (req, res) => {
    let data = await getRewards(req.body)
    res.json(data)
})

module.exports = router
