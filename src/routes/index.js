const express = require("express");
const app = express();
const cors = require("cors");
const allocationsRouter = require("./allocations");
const vebalsRouter = require("./vebals");
const nftvolsRouter = require("./nft_vols");
const rewardsInfoRouter = require("./rewards_info");
const nftInfoRouter = require("./nft_info");
const apyRouter = require("./apy");

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: false, limit: "100mb" }));

app.use(allocationsRouter);
app.use(vebalsRouter);
app.use(nftvolsRouter);
app.use(rewardsInfoRouter);
app.use(nftInfoRouter);
app.use("/apy", apyRouter);

app.listen(6234);
