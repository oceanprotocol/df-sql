const croner = require("croner");
const { updateDb } = require("../comps/update");

croner.Cron("0 * * * * *", () => {
  sync();
});

async function sync() {
  console.log("Starting sync");

  await updateDb(
    "/app/data/poolinfo-0.csv",
    "pool_info"
  );
  await updateDb(
    "/app/data/poolvols-0.csv",
    "pool_vols"
  );
  await updateDb(
    "/app/data/stakes-chain0.csv",
    "pool_stakes"
  );
}
