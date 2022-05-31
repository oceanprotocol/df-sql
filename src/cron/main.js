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

  let poolInfos = [];
  let poolVols = [];
  let poolStakes = [];
  let rewardsInfo = [];

  fs.readdir(dataDir, async (err, files) => {
    if (err) {
      throw err;
    }
    for (let file of files) {
      if (file.includes("poolinfo")) {
        poolInfos.push(...parseCsv(`${dataDir}${file}`));
      }
      if (file.includes("poolvols")) {
        poolVols.push(...parseCsv(`${dataDir}${file}`));
      }
      if (file.includes("stakes-chain")) {
        poolStakes.push(...parseCsv(`${dataDir}${file}`));
      }
      if (file.includes("rewardsinfo")) {
        rewardsInfo.push(...parseCsv(`${dataDir}${file}`));
      }
    }

    await cleanDb("pool_info");
    await updateDb(poolInfos, "pool_info");

    await cleanDb("pool_vols");
    await updateDb(poolVols, "pool_vols");

    await cleanDb("pool_stakes");
    await updateDb(poolStakes, "pool_stakes");

    await cleanDb("rewards_info");
    await updateDb(rewardsInfo, "rewards_info");
  });
}
