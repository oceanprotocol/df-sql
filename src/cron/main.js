const croner = require("croner")
const { sync } = require("../comps/update/sync")
const fs = require("fs")
const dataDir = "/csv/"
const histDataDir = "/csv/historical/"

croner.Cron("0 */1 * * * *", async () => {
    await sync(dataDir, 0)
})

croner.Cron("0 */1 * * * *", async () => {
    await sync_historical()
})

async function sync_historical() {
    if (!fs.existsSync(histDataDir)) {
        return console.log("no historical data dir");
    }

    let folders = fs.readdirSync(histDataDir);

    for (const folder of folders) {
        let roundNumber = parseInt(folder);
        if (roundNumber) {
            await Promise.all([sync(histDataDir + folder + "/", roundNumber)]);
        }
    }
}
