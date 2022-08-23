const express = require("express");
const { getVols } = require("../../services/nft_vols");

const router = express.Router();

router.post("/volume", async (req, res) => {
  let data = await getVols(req.body);
  res.json(data);
});

module.exports = router;
