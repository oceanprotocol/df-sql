const { dropTable, updateDb } = require("../update/index")

const batchUpdateRound = async ({
    allocations,
    nftvols,
    vebals,
    rewardsInfo,
    nftinfo,
    ownerInfo,
    roundNumber
}) => {
    await dropTable("allocations", roundNumber)
    await updateDb(allocations, "allocations", roundNumber)

    await dropTable("nft_vols", roundNumber)
    await updateDb(nftvols, "nft_vols", roundNumber)

    await dropTable("vebals", roundNumber)
    await updateDb(vebals, "vebals", roundNumber)

    await dropTable("rewards_info", roundNumber)
    await updateDb(rewardsInfo, "rewards_info", roundNumber)

    await dropTable("nft_info", roundNumber)
    await updateDb(nftinfo, "nft_info", roundNumber)

    if (ownerInfo) {
        await dropTable("owners_info")
        await updateDb(ownerInfo, "owners_info")
    }
}

module.exports = { batchUpdateRound }
