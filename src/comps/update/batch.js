const { dropTable, updateDb, updateRewardsSummary } = require("../update/index")

const batchUpdateRound = async ({
    allocations,
    nftvols,
    vebals,
    rewardsInfo,
    passiveRewardsInfo,
    nftinfo,
    ownerInfo,
    roundNumber,
    predictoor_data,
    predictoor_rewards,
    challenge_data,
    challenge_rewards
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

    if (predictoor_data) {
        await dropTable("predictoor_data", roundNumber)
        await updateDb(predictoor_data, "predictoor_data", roundNumber)
    }

    if (predictoor_rewards) {
        await dropTable("predictoor_rewards", roundNumber)
        await updateDb(predictoor_rewards, "predictoor_rewards", roundNumber)
    }

    if (challenge_data) {
        await dropTable("challenge_data", roundNumber)
        await updateDb(challenge_data, "challenge_data", roundNumber)
    }

    if (challenge_rewards) {
        await dropTable("challenge_rewards", roundNumber)
        await updateDb(challenge_rewards, "challenge_rewards", roundNumber)
    }
}

module.exports = { batchUpdateRound }
