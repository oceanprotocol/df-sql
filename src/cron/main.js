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

  fs.readdir(dataDir, async (err, files) => {
    if (err) {
      throw err;
    }
    for (let file of files) {
      if (file.includes("poolinfo")) {
        allocations.push(...parseCsv(`${dataDir}${file}`));
      }
      if (file.includes("poolvols")) {
        nftvols.push(...parseCsv(`${dataDir}${file}`));
      }
      if (file.includes("stakes-chain")) {
        vebals.push(...parseCsv(`${dataDir}${file}`));
      }
      if (file.includes("rewardsinfo")) {
        rewardsInfo.push(...parseCsv(`${dataDir}${file}`));
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
  });
}
