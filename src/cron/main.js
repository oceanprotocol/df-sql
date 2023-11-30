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

    const folders = fs.readdirSync(histDataDir);

    const maxConcurrency = 20;

    async function runWithConcurrency(tasks) {
        const results = [];
        while (tasks.length > 0) {
            const batch = tasks.splice(0, maxConcurrency);
            const batchResults = await Promise.all(batch.map(task => task()));
            results.push(...batchResults);
        }
        return results;
    }

    const tasks = folders.map(folder => async () => {
        const roundNumber = parseInt(folder);
        if (roundNumber) {
            await sync(histDataDir + folder + "/", roundNumber);
            return `Sync completed for folder: ${folder}`;
        }
    });

    const results = await runWithConcurrency(tasks);

    results.forEach(result => console.log(result));
}
