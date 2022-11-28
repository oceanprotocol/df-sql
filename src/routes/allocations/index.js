const express = require("express")
const { getAllocations } = require("../../services/allocations")
const router = express.Router()

router.post("/allocations", async (req, res) => {
    let data = await getAllocations(req.body)
    res.json(data)
})

module.exports = router
