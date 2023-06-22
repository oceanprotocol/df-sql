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
    if (roundNumber === undefined) return
    console.log("Starting sync", roundNumber)

    let {
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
        predictoor_rewards,
        challenge_data,
        challenge_rewards
    } = readDataDir(dataDir)

    if (round_hash_map[roundNumber] == hashsum) {
        return console.log("No changes detected, skipping round", roundNumber)
    }
    round_hash_map[roundNumber] = hashsum

    try {
        nftinfo = parsePurgatory(nftinfo)
    } catch (err) {
        return console.log("Error parsing purgatory", err)
    }

    try {
        let t = calculateAllocations({
            allocations,
            vebals_realtime,
            allocations_realtime,
            allocations,
            vebals,
            nftinfo
        })
        allocations = t.allocations
        nftinfo = t.nftinfo
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
        passiveRewardsInfo,
        nftinfo,
        predictoor_data,
        predictoor_rewards,
        challenge_data,
        challenge_rewards,
        roundNumber: roundNumber
    })
}

module.exports = { sync }
