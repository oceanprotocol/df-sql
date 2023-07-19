const fs = require("fs")
const { parseCsv } = require("../csv/parse")
const crypto = require("crypto")

function readDataDir(dataDir) {
    let allocations = []
    let allocations_realtime = []
    let nftvols = []
    let vebals = []
    let vebals_realtime = []
    let rewardsInfo = []
    let passiveRewardsInfo = []
    let nftinfo = []

    let rates = []
    let symbols = []
    let predictoor_data = []
    let predictoor_summary = []
    let predictoor_rewards = []

    let challenge_data = []
    let challenge_rewards = []

    let files = fs.readdirSync(dataDir)
    let hashsum = ""
    for (let file of files) {
        if (file.includes("allocations")) {
            if (file.includes("realtime")) {
                allocations_realtime.push(...parseCsv(`${dataDir}${file}`))
            } else {
                allocations.push(...parseCsv(`${dataDir}${file}`))
            }
        } else if (file.includes("nftvols")) {
            nftvols.push(...parseCsv(`${dataDir}${file}`))
        } else if (file.includes("vebals")) {
            if (file.includes("realtime")) {
                vebals_realtime.push(...parseCsv(`${dataDir}${file}`))
            } else {
                vebals.push(...parseCsv(`${dataDir}${file}`))
            }
        } else if (file.includes("rewardsinfo")) {
            rewardsInfo.push(...parseCsv(`${dataDir}${file}`))
        } else if (file.includes("passive")) {
            passiveRewardsInfo.push(...parseCsv(`${dataDir}${file}`))
        } else if (file.includes("nftinfo")) {
            nftinfo.push(...parseCsv(`${dataDir}${file}`))
        } else if (file.includes("rate-")) {
            rates.push(...parseCsv(`${dataDir}${file}`))
        } else if (file.includes("symbols-")) {
            symbols.push(...parseCsv(`${dataDir}${file}`))
        } else if (file.includes("predictoor_data")) {
            predictoor_data.push(...parseCsv(`${dataDir}${file}`))
        } else if (file.includes("predictoor_summary")) {
            predictoor_summary.push(...parseCsv(`${dataDir}${file}`))
        } else if (file.includes("predictoor_rewards")) {
            predictoor_rewards.push(...parseCsv(`${dataDir}${file}`))
        } else if (file.includes("challenge_data")) {
            challenge_data.push(...parseCsv(`${dataDir}${file}`))
        } else if (file.includes("challenge_rewards")) {
            challenge_rewards.push(...parseCsv(`${dataDir}${file}`))
        } else continue

        let hash = crypto.createHash("sha256")
        let fileData = fs.readFileSync(dataDir + "/" + file)
        hash.update(fileData + dataDir)
        hashsum += hash.digest("hex")
    }

    return {
        allocations,
        allocations_realtime,
        nftvols,
        vebals,
        vebals_realtime,
        rewardsInfo,
        passiveRewardsInfo,
        nftinfo,
        rates,
        symbols,
        hashsum,
        predictoor_data,
        predictoor_summary,
        predictoor_rewards,
        challenge_data,
        challenge_rewards
    }
}

module.exports = { readDataDir }
