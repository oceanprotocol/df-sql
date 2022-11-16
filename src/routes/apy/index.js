const express = require("express");
const { readStorage } = require("../../comps/fs/storage");
const { getActiveApy, getApyByAddr } = require("../../services/apy");
const router = express.Router();

router.get("/active", (req, res) => {
    res.json({ apy: getActiveApy() ?? 0 });
});

router.get("/addr/:addr", async (req, res) => {
    let apy = await getApyByAddr(req.params.addr);
    res.json({ apy: apy ?? 0 });
})

module.exports = router;
