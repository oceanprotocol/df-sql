const fs = require("fs")
const { parseCsv } = require("../csv/parse")

function readDataDir(dataDir) {
    let allocations = []
    let allocations_realtime = []
    let nftvols = []
    let vebals = []
    let vebals_realtime = []
    let rewardsInfo = []
    let nftinfo = []

    let rates = []
    let symbols = []

    let files = fs.readdirSync(dataDir)
    for (let file of files) {
        if (file.includes("allocations")) {
            if (file.includes("realtime")) {
                allocations_realtime.push(...parseCsv(`${dataDir}${file}`))
            } else {
                allocations.push(...parseCsv(`${dataDir}${file}`))
            }
        }
        if (file.includes("nftvols")) {
            nftvols.push(...parseCsv(`${dataDir}${file}`))
        }
        if (file.includes("vebals")) {
            if (file.includes("realtime")) {
                vebals_realtime.push(...parseCsv(`${dataDir}${file}`))
            } else {
                vebals.push(...parseCsv(`${dataDir}${file}`))
            }
        }
        if (file.includes("rewardsinfo")) {
            rewardsInfo.push(...parseCsv(`${dataDir}${file}`))
        }
        if (file.includes("nftinfo")) {
            nftinfo.push(...parseCsv(`${dataDir}${file}`))
        }
        if (file.includes("rate-")) {
            rates.push(...parseCsv(`${dataDir}${file}`))
        }
        if (file.includes("symbols-")) {
            symbols.push(...parseCsv(`${dataDir}${file}`))
        }
    }

    return {
        allocations,
        allocations_realtime,
        nftvols,
        vebals,
        vebals_realtime,
        rewardsInfo,
        nftinfo,
        rates,
        symbols
    }
}

module.exports = { readDataDir }
