const croner = require("croner");
const fs = require("fs");
const { parseCsv } = require("../comps/csv/parse");
const { updateDb, cleanDb } = require("../comps/update");

croner.Cron("0 */5 * * * *", () => {
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

    try {
      // find how much has been allocated to each data nft
      let nft_allocations = {}; // nft addr : ve amount
      for (let allocation of allocations) {
        if (!nft_allocations[allocation.nft_addr]) {
          nft_allocations[allocation.nft_addr] = 0;
        }
        nft_allocations[allocation.nft_addr] +=
          parseFloat(allocation.percent) *
          parseFloat(
            vebals.find((x) => x.LP_addr === allocation.LP_addr).balance
          );
      }

      for (let n of nftinfo) {
        n.ve_allocated = nft_allocations[n.nft_addr] ?? 0; // consider 0 if no allocations

        n.vol_amt = nftvols.reduce((acc, x) => {
          if (x.nft_addr === n.nft_addr) {
            return acc + parseFloat(x.vol_amt);
          }
          return acc;
        }, 0);
      }
    } catch (error) {
      console.error("Error calculating nft allocations", error);
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
