function wprToApy(wpr) {
    let weeks = 52
    let apy = Math.pow(1 + wpr, weeks) - 1
    return apy
}

function calcGeneralApy({ rewardsInfo, nftinfo }) {
    const totalRewards = rewardsInfo.reduce((acc, cur) => {
        return acc + parseFloat(cur.amt)
    }, 0)
    const totalAllocatedVe = nftinfo.reduce((acc, cur) => {
        return acc + parseFloat(cur.ocean_allocated)
    }, 0)

    const generalApr = totalRewards / totalAllocatedVe
    const generalApy = wprToApy(generalApr)

    return generalApy
}

function calcApyPerAsset({ rewardsInfo, nftinfo }) {
    nftinfo.forEach((nft, i) => {
        const nftRewards = rewardsInfo.filter(
            (x) => x.nft_addr === nft.nft_addr
        )
        const nftRewardsAmt = nftRewards.reduce((acc, cur) => {
            return acc + parseFloat(cur.amt)
        }, 0)
        if (nftRewardsAmt === 0) {
            nftinfo[i].apy = 0
            nftinfo[i].apr = 0
            return
        }
        const nftApr =
            nftRewardsAmt / (nft.ocean_allocated + nft.ocean_allocated_owner)
        const nftApy = wprToApy(nftApr)
        nftinfo[i].apr = nftApr
        nftinfo[i].apy = nftApy
    })
    return nftinfo
}

module.exports = {
    calcGeneralApy,
    calcApyPerAsset,
    wprToApy
}
