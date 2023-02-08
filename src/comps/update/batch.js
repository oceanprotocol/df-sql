const { cleanDb, updateDb } = require("../update/index")

const batchUpdateRound = async ({
    allocations,
    nftvols,
    vebals,
    rewardsInfo,
    nftinfo,
    ownerInfo,
    roundNumber
}) => {
    await cleanDb("allocations", roundNumber)
    await updateDb(allocations, "allocations", roundNumber)

    await cleanDb("nft_vols", roundNumber)
    await updateDb(nftvols, "nft_vols", roundNumber)

    await cleanDb("vebals", roundNumber)
    await updateDb(vebals, "vebals", roundNumber)

    await cleanDb("rewards_info", roundNumber)
    await updateDb(rewardsInfo, "rewards_info", roundNumber)

    await cleanDb("nft_info", roundNumber)
    await updateDb(nftinfo, "nft_info", roundNumber)

    if (ownerInfo) {
        await cleanDb("owners_info")
        await updateDb(ownerInfo, "owners_info")
    }
}

module.exports = { batchUpdateRound }
