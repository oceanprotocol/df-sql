const express = require("express");
const { getVols } = require("../../services/pool_vol");

const router = express.Router();

router.post("/volume", async (req, res) => {
    const query = req.body.query;
    const sort = req.body.sort;
    const limit = req.body.limit;
    const offset = req.body.offset;
    let data = await getVols(query, sort, limit, offset);
    res.json(data);
});

module.exports = router;
