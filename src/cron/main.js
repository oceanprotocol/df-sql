const croner = require("croner")
const { calcApyPerAsset, calcGeneralApy } = require("../comps/apy/calc")
const { calculateAllocations, calculateVolumes } = require("../comps/calc/data")
const { readDataDir } = require("../comps/fs/dir")
const { saveStorage } = require("../comps/fs/storage")
const { updateDb, cleanDb } = require("../comps/update")

croner.Cron("0 */5 * * * *", () => {
    sync()
})

const dataDir = "/csv/"

async function sync() {
    console.log("Starting sync")

    let {
        allocations,
        allocations_realtime,
        nftvols,
        vebals,
        vebals_realtime,
        rewardsInfo,
        nftinfo,
        rates,
        symbols
    } = readDataDir(dataDir)

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
        console.error("Error calculating nft allocations", error)
    }

    try {
        nftvols = calculateVolumes({
            nftvols,
            rates,
            symbols
        })
    } catch (error) {
        console.error("Error calculating nft volumes", error)
    }

    try {
        nftinfo = calcApyPerAsset({
            nftinfo,
            rewardsInfo
        })
        let generalApy = calcGeneralApy({
            nftinfo,
            rewardsInfo
        })
        saveStorage("generalApy", generalApy)
    } catch (error) {
        console.error("Error calculating APY", error)
    }

    await batchUpdateRound({
        allocations,
        nftvols,
        vebals,
        rewardsInfo,
        nftinfo,
        roundNumber: 0 // 0 is the current round
    })
}
