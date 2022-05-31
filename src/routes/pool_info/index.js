const express = require("express");
const { getPools } = require("../../services/pool_info");
const router = express.Router();

router.post("/pools", async (req, res) => {
  let data = await getPools(req.body);
  res.json(data);
});

module.exports = router;
