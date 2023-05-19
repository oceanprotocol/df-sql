const {
    wprToApy,
    calcGeneralApy,
    calcApyPerAsset
} = require("../src/comps/apy/calc")

test("test apy per asset", () => {
    let rewardsInfo = [
        {
            amt: 2000,
            nft_addr: "0x1"
        },
        {
            amt: 1000,
            nft_addr: "0x2"
        }
    ]

    let nftinfo = [
        {
            ocean_allocated: 40000,
            ocean_allocated_owner: 0,
            nft_addr: "0x1"
        },
        {
            ocean_allocated: 60000,
            ocean_allocated_owner: 0,
            nft_addr: "0x2"
        }
    ]

    nftinfo = calcApyPerAsset({ rewardsInfo, nftinfo })

    for (let n of nftinfo) {
        expect(n.apy).toBe(wprToApy(n.roundYield))
    }

    expect(nftinfo[0].apy).toBeCloseTo(11.64)
    expect(nftinfo[0].apr).toBeCloseTo(2.6)
    expect(nftinfo[0].roundYield).toBeCloseTo(0.05)

    expect(nftinfo[1].apy).toBeCloseTo(1.362)
    expect(nftinfo[1].apr).toBeCloseTo(0.866)
    expect(nftinfo[1].roundYield).toBeCloseTo(0.016)
})

test("test general apy", () => {
    let rewardsInfo = [
        {
            amt: 100,
            nft_addr: "0x1"
        },
        {
            amt: 100,
            nft_addr: "0x1"
        },
        {
            amt: 800,
            nft_addr: "0x2"
        }
    ]

    let nftinfo = [
        {
            ocean_allocated: 40000,
            ocean_allocated_owner: 0,
            nft_addr: "0x1"
        },
        {
            ocean_allocated: 60000,
            ocean_allocated_owner: 0,
            nft_addr: "0x2"
        }
    ]

    let generalApy = calcGeneralApy({ rewardsInfo, nftinfo })

    expect(generalApy).toBeCloseTo(0.677, 0.0001)
})

test("test wprToApy", () => {
    let wpr = 0.015717
    let expected = 1.25
    let apy = wprToApy(wpr)
    expect(apy).toBeCloseTo(expected, 0.0001)
})
