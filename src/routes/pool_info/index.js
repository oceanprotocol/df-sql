const express = require("express");
const { getPool, getPools } = require("../../services/pool_info/index.js");
const router = express.Router();

router.post("/pools/:id", async (req, res) => {
  const id = req.params.id;
  let data = await getPool(id);
  res.json(data);
});
router.post("/pools", async (req, res) => {
  // better if you get sort and filter data using a post req
  const query = req.body.query;
  let data = await getPools(query);
  res.json(data);
});

module.exports = router;
