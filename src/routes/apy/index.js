const express = require("express");
const { readStorage } = require("../../comps/fs/storage");
const router = express.Router();

router.get("/active", async (req, res) => {
    let data = readStorage("generalApy");
    res.json({ apy: data });
});

module.exports = router;
