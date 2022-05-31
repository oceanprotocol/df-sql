const express = require("express");
const { getStakes } = require("../../services/pool_stake/");
const router = express.Router();

router.post("/stakes", async (req, res) => {
  let data = await getStakes(req.body);
  res.json(data);
});

module.exports = router;
