const express = require("express");
const { getVols } = require("../../services/pool_vol");

const router = express.Router();

router.post("/volume", async (req, res) => {
  let data = await getVols(req.body);
  res.json(data);
});

module.exports = router;
