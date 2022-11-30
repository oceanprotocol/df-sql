const { readDataDir } = require("../fs/dir")
const { calcApyPerAsset, calcGeneralApy } = require("../apy/calc")
const {
    calculateAllocations,
    calculateVolumes,
    parsePurgatory
} = require("../calc/data")
const { saveStorage } = require("../fs/storage")
const { batchUpdateRound } = require("../update/batch")

let round_hash_map = {}
async function sync(dataDir, roundNumber) {
    console.log("Starting sync", roundNumber)
    if (!roundNumber) return

    let {
        allocations,
        allocations_realtime,
        nftvols,
        vebals,
        vebals_realtime,
        rewardsInfo,
        nftinfo,
        rates,
        symbols,
        hashsum
    } = readDataDir(dataDir)

    if (round_hash_map[roundNumber] == hashsum) {
        return console.log("No changes detected, skipping")
    }
    round_hash_map[roundNumber] = hashsum

    try {
        nftinfo = parsePurgatory(nftinfo)
    } catch (err) {
        return console.log("Error parsing purgatory", err)
    }

    try {
        nftinfo = calculateAllocations({
            allocations,
            vebals_realtime,
            allocations_realtime,
            allocations,
            vebals,
            nftinfo
        })
    } catch (error) {
        return console.error("Error calculating nft allocations", error)
    }

    try {
        nftinfo = calculateVolumes({
            nftvols,
            rates,
            symbols,
            nftinfo
        })
        console.log("Calculated volumes", nftinfo[0])
    } catch (error) {
        return console.error("Error calculating nft volumes", error)
    }

    try {
        nftinfo = calcApyPerAsset({
            nftinfo,
            rewardsInfo
        })
        if (roundNumber == 0) {
            let generalApy = calcGeneralApy({
                nftinfo,
                rewardsInfo
            })
            saveStorage("generalApy", generalApy)
        }
    } catch (error) {
        return console.error("Error calculating APY", error)
    }

    await batchUpdateRound({
        allocations,
        nftvols,
        vebals,
        rewardsInfo,
        nftinfo,
        roundNumber: roundNumber
    })
}

module.exports = { sync }
