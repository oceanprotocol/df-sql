const { getAllocations } = require("./allocations")
const { getActiveApy, getApyByAddr } = require("./apy")
const { getNftInfo } = require("./nft_info")
const { getVols } = require("./nft_vols")
const { getRewards } = require("./rewards_info")
const { getRewardsSummary } = require("./rewards_summary")
const { getveBals } = require("./vebals")

module.exports = {
    getAllocations,
    getActiveApy,
    getApyByAddr,
    getNftInfo,
    getVols,
    getRewards,
    getRewardsSummary,
    getveBals
}
