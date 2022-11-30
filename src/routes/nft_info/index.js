const express = require("express")
const { getNftInfo } = require("../../services/nft_info")

const router = express.Router()

router.post("/nftinfo", async (req, res) => {
    let data = await getNftInfo(req.body)
    res.json(data)
})

module.exports = router
