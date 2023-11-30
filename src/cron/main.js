const croner = require("croner")
const { sync } = require("../comps/update/sync")
const fs = require("fs")
const path = require('path');
const dataDir = "/csv/"
const histDataDir = "/csv/historical/"


let syncing_historical = false;
let syncing = false;

croner.Cron("0 */1 * * * *", async () => {
    if (!syncing) {
        syncing = true;
        try {
            await sync(dataDir, 0)
        } finally {
            syncing = false;
        }
    } else {
        console.log('Sync in progress. Skipping this run.');
    }
})

croner.Cron("0 */1 * * * *", async () => {
    if (!syncing_historical) {
        syncing_historical = true;
        try {
            await sync_historical();
        } finally {
            syncing_historical = false;
        }
    } else {
        console.log('Sync in progress. Skipping this run.');
    }
});


async function sync_historical() {
    if (!fs.existsSync(histDataDir)) {
        return console.log("No historical data directory.");
    }

    const folders = fs.readdirSync(histDataDir);

    const maxConcurrency = 30;

    async function runWithConcurrency(tasks) {
        const results = [];
        while (tasks.length > 0) {
            const batch = tasks.splice(0, maxConcurrency);
            try {
                const batchResults = await Promise.all(batch.map(task => task().catch(e => e)));
                results.push(...batchResults);
            } catch (error) {
                console.error('Error during batch processing:', error);
            }
        }
        return results;
    }

    const tasks = folders.map(folder => async () => {
        const roundNumber = parseInt(folder);
        if (isNaN(roundNumber)) {
            throw new Error(`Folder name is not a number: ${folder}`);
        }
        try {
            await sync(path.join(histDataDir, folder) + "/", roundNumber);
            return `Sync completed for folder: ${folder}`;
        } catch (error) {
            return `Error syncing folder ${folder}: ${error.message}`;
        }
    });

    try {
        const results = await runWithConcurrency(tasks);
        results.forEach(result => {
            if (result instanceof Error) {
                console.error(result.message);
            } else {
                console.log(result);
            }
        });
    } catch (error) {
        console.error('Error during synchronization:', error);
    }
}
