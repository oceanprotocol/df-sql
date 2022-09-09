const croner = require("croner");
const fs = require("fs");
const { parseCsv } = require("../comps/csv/parse");
const { updateDb, cleanDb } = require("../comps/update");

croner.Cron("0 */10 * * * *", () => {
  sync();
});

const dataDir = "/csv/";

async function sync() {
  console.log("Starting sync");

  let allocations = [];
  let nftvols = [];
  let vebals = [];
  let rewardsInfo = [];
  let nftinfo = [];

  fs.readdir(dataDir, async (err, files) => {
    if (err) {
      throw err;
    }
    for (let file of files) {
      if (file.includes("allocations")) {
        allocations.push(...parseCsv(`${dataDir}${file}`));
      }
      if (file.includes("nftvols")) {
        nftvols.push(...parseCsv(`${dataDir}${file}`));
      }
      if (file.includes("vebals")) {
        vebals.push(...parseCsv(`${dataDir}${file}`));
      }
      if (file.includes("rewardsinfo")) {
        rewardsInfo.push(...parseCsv(`${dataDir}${file}`));
      }
      if (file.includes("nftinfo")) {
        nftinfo.push(...parseCsv(`${dataDir}${file}`));
      }
    }

    await cleanDb("allocations");
    await updateDb(allocations, "allocations");

    await cleanDb("nft_vols");
    await updateDb(nftvols, "nft_vols");

    await cleanDb("vebals");
    await updateDb(vebals, "vebals");

    await cleanDb("rewards_info");
    await updateDb(rewardsInfo, "rewards_info");

    await cleanDb("nft_info");
    await updateDb(nftinfo, "nft_info");
  });
}
