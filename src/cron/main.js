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

  let rates = [];
  let symbols = [];

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
      if (file.includes("rate-")) {
        rates.push(...parseCsv(`${dataDir}${file}`));
      }
      if (file.includes("symbols-")) {
        symbols.push(...parseCsv(`${dataDir}${file}`));
      }
    }

    try {
      // find how much has been allocated to each data nft
      let nft_allocations = {}; // nft addr : ve amount
      for (let allocation of allocations) {
        if (!nft_allocations[allocation.nft_addr]) {
          nft_allocations[allocation.nft_addr] = 0;
        }

        let lpbal = vebals.find((x) => x.LP_addr === allocation.LP_addr);
        if (!lpbal && !lpbal.balance) continue;
        nft_allocations[allocation.nft_addr] +=
          parseFloat(allocation.percent) * parseFloat(lpbal.balance);
      }
      for (let n of nftinfo) {
        n.ve_allocated = nft_allocations[n.nft_addr] ?? 0; // consider 0 if no allocations
      }
    } catch (error) {
      console.error("Error calculating nft allocations", error);
    }

    try {
      for (let n of nftinfo) {
        n.volume = nftvols.reduce((acc, x) => {
          if (x.nft_addr === n.nft_addr) {
            let baseTokenSymbol = symbols.find(
              (y) => y.token_addr === x.basetoken_addr
            );

            if (!baseTokenSymbol) {
              console.error(
                `No symbol found for ${x.basetoken_addr} in ${n.nft_addr}`
              );
              return acc;
            }

            let token_symbol = baseTokenSymbol.token_symbol;
            let rate = rates.find(
              //TODO make this look good later
              (x) =>
                x.token_symbol.replace("M", "") ===
                token_symbol.replace("M", "")
            );

            if (!rate) {
              console.error(
                `No rate found for ${token_symbol} in ${n.nft_addr}`
              );
              return acc;
            }

            return acc + parseFloat(x.vol_amt) * parseFloat(rate.rate);
          }
          return acc;
        }, 0);
      }
    } catch (error) {
      console.error("Error calculating nft volumes", error);
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
