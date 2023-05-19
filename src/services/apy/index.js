const { wprToApy } = require("../../comps/apy/calc")
const { readStorage } = require("../../comps/fs/storage")
const { getAllocations } = require("../allocations")
const { getRewards } = require("../rewards_info")

const getActiveApy = () => {
    return readStorage("generalApy")
}

const getApyByAddr = async (addr) => {
    let allocationsQuery = {
        query: {
            LP_addr: addr
        }
    }
    let allocations = await getAllocations(allocationsQuery)
    if (allocations.length == 0) {
        return 0
    }

    let rewards_query = {
        query: {
            LP_addr: addr
        }
    }
    let rewards = await getRewards(rewards_query)
    if (rewards.length == 0) {
        return 0
    }
    // sum allocations
    let tot_allocated = allocations.reduce((acc, cur) => {
        return acc + parseFloat(cur.ocean_amt)
    }, 0)

    // sum rewards
    let tot_rewards = rewards.reduce((acc, cur) => {
        return acc + parseFloat(cur.amt)
    }, 0)
    let roundYield = tot_rewards / tot_allocated
    let apy = wprToApy(roundYield)

    return apy
}

module.exports = {
    getActiveApy,
    getApyByAddr
}
