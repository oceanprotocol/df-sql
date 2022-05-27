const express = require("express");
const { getStakes } = require("../../services/pool_stake/");
const router = express.Router();

router.post("/stakes", async (req, res) => {
    const query = req.body.query;
    const sort = req.body.sort;
    const limit = req.body.limit;
    const offset = req.body.offset;
    let data = await getStakes(query, sort, limit, offset);
    res.json(data);
});

module.exports = router;
