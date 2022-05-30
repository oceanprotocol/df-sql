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
    }

    poolInfos.forEach((info, y) => {
      poolInfos[y].reward_amt =
        Math.log10(info.stake_amt + 1) * Math.log10(info.vol_amt + 2);
      console.log(
        Math.log10(info.stake_amt + 1) * Math.log10(info.vol_amt + 2)
      );
    });
    console.log(poolInfos);

    await cleanDb("pool_info");
    await updateDb(poolInfos, "pool_info");

    await cleanDb("pool_vols");
    await updateDb(poolVols, "pool_vols");

    await cleanDb("pool_stakes");
    await updateDb(poolStakes, "pool_stakes");
  });
}
