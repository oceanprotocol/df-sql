const express = require("express");
const { getveBals } = require("../../services/vebals/");
const router = express.Router();

router.post("/vebals", async (req, res) => {
  let data = await getveBals(req.body);
  res.json(data);
});

module.exports = router;
