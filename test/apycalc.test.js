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
            ve_allocated: 40000,
            nft_addr: "0x1"
        },
        {
            ve_allocated: 60000,
            nft_addr: "0x2"
        },
        {
            ve_allocated: 0,
            nft_addr: "0x2"
        },
        {
            ve_allocated: 0,
            nft_addr: "0x3"
        }
    ]

    nftinfo = calcApyPerAsset({ rewardsInfo, nftinfo })

    for (let n of nftinfo) {
        expect(n.apy).toBe(wprToApy(n.apr))
    }

    expect(nftinfo[0].apy).toBeCloseTo(141.04)
    expect(nftinfo[0].apr).toBe(0.1)

    expect(nftinfo[1].apy).toBeCloseTo(1.362)
    expect(nftinfo[1].apr).toBeCloseTo(0.016)
})

test("test general apy", () => {
    let rewardsInfo = [
        {
            amt: 100
        },
        {
            amt: 100
        },
        {
            amt: 800
        }
    ]

    let nftinfo = [
        {
            ve_allocated: 40000
        },
        {
            ve_allocated: 60000
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
