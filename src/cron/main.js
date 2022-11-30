const croner = require("croner")
const { sync } = require("../comps/update/sync")
const fs = require("fs")
const dataDir = "/csv/"
const histDataDir = "/csv/historical/"

croner.Cron("0 */5 * * * *", async () => {
    await sync(dataDir, 0)
})

croner.Cron("0 */1 * * * *", async () => {
    await sync_historical()
})

async function sync_historical() {
    let folders = fs.readdirSync(histDataDir)
    folders.forEach(async (folder) => {
        let roundNumber = parseInt(folder)
        if (roundNumber) {
            await sync(histDataDir + folder + "/", roundNumber)
        }
    })
}
