const express = require("express");
const { getPools } = require("../../services/pool_info");
const router = express.Router();

router.post("/pools", async (req, res) => {
  const query = req.body.query;
  const sort = req.body.sort;
  const limit = req.body.limit;
  const offset = req.body.offset;
  let data = await getPools(query, sort, limit, offset);
  res.json(data);
});

module.exports = router;
