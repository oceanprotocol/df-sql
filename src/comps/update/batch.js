const { dropTable, updateDb, updateRewardsSummary } = require("../update/index")

const batchUpdateRound = async ({
    allocations,
    nftvols,
    vebals,
    rewardsInfo,
    passiveRewardsInfo,
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

    await dropTable("passive_rewards_info", roundNumber)
    await updateDb(passiveRewardsInfo, "passive_rewards_info", roundNumber)

    await dropTable("nft_info", roundNumber)
    await updateDb(nftinfo, "nft_info", roundNumber)

    await dropTable("rewards_summary", roundNumber)
    await updateRewardsSummary(roundNumber)
    if (ownerInfo) {
        await dropTable("owners_info", roundNumber)
        await updateDb(ownerInfo, "owners_info", roundNumber)
    }
}

module.exports = { batchUpdateRound }
