const {
    calculateAllocations,
    calculateVolumes,
    parsePurgatory,
    allocationMultiplier
} = require("../src/comps/calc/data.js")

test("test allocationMultiplier", () => {
    const nftinfo = [
        { nft_addr: "addr1", owner_addr: "lp1" },
        { nft_addr: "addr2", owner_addr: "lp2" }
    ]
    const lp_addr = "lp1"
    const nft_addr = "addr1"

    let expected = 2
    let result = allocationMultiplier({ nftinfo, lp_addr, nft_addr })
    expect(result).toBe(expected)
})

test("test allocationMultiplier not found", () => {
    const nftinfo = [
        { nft_addr: "addr1", owner_addr: "lp1" },
        { nft_addr: "addr2", owner_addr: "lp2" }
    ]
    const lp_addr = "lp3"
    const nft_addr = "addr3"

    let expected = 1
    let result = allocationMultiplier({ nftinfo, lp_addr, nft_addr })
    expect(result).toBe(expected)
})

test("test parsePurgatory", () => {
    let nftinfo = [{ is_purgatory: "1" }, { is_purgatory: "0" }]

    let expected = [{ is_purgatory: 1 }, { is_purgatory: 0 }]

    let result = parsePurgatory(nftinfo)
    expect(result).toStrictEqual(expected)
})

test("test calculateVolumes", () => {
    let rates = [
        { token_symbol: "TOKEN1", rate: "1.5" },
        { token_symbol: "USDC", rate: "1" }
    ]
    let symbols = [
        { token_addr: "addr1", token_symbol: "TOKEN1" },
        { token_addr: "addr2", token_symbol: "USDC" }
    ]
    let nftvols = [
        { nft_addr: "nftaddr1", basetoken_addr: "addr1", vol_amt: "2" },
        { nft_addr: "nftaddr2", basetoken_addr: "addr2", vol_amt: "3" }
    ]
    let nftinfo = [{ nft_addr: "nftaddr1" }, { nft_addr: "nftaddr2" }]

    let expected = [
        { nft_addr: "nftaddr1", volume: 3.0 },
        { nft_addr: "nftaddr2", volume: 3.0 }
    ]

    let result = calculateVolumes({ rates, symbols, nftvols, nftinfo })
    expect(result).toStrictEqual(expected)
})

test("test calculateAllocations", () => {
    const allocations = [
        {
            LP_addr: "lp1",
            nft_addr: "nft1",
            percent: "0.5"
        },
        {
            LP_addr: "lp2",
            nft_addr: "nft2",
            percent: "0.25"
        }
    ]

    const allocations_realtime = [
        {
            LP_addr: "lp1",
            nft_addr: "nft1",
            percent: "0.75"
        },
        {
            LP_addr: "lp2",
            nft_addr: "nft2",
            percent: "0.35"
        }
    ]

    const vebals = [
        {
            LP_addr: "lp1",
            balance: "100",
            locked_amt: "50"
        },
        {
            LP_addr: "lp2",
            balance: "200",
            locked_amt: "75"
        }
    ]

    const vebals_realtime = [
        {
            LP_addr: "lp1",
            balance: "120",
            locked_amt: "60"
        },
        {
            LP_addr: "lp2",
            balance: "220",
            locked_amt: "85"
        }
    ]

    const nftinfo = [
        {
            nft_addr: "nft1",
            owner_addr: "lp1"
        },
        {
            nft_addr: "nft2",
            owner_addr: "lp2"
        }
    ]

    const { nftinfo: resultNftinfo, allocations: resultAllocations } =
        calculateAllocations({
            allocations,
            allocations_realtime,
            vebals,
            vebals_realtime,
            nftinfo
        })

    const expectedNftinfo = [
        {
            nft_addr: "nft1",
            owner_addr: "lp1",
            ve_allocated: 100,
            ve_allocated_realtime: 180,
            ocean_allocated: 25,
            ocean_allocated_realtime: 45,
            ve_allocated_owner: 100,
            ve_allocated_realtime_owner: 180,
            ocean_allocated_owner: 25,
            ocean_allocated_realtime_owner: 45
        },
        {
            nft_addr: "nft2",
            owner_addr: "lp2",
            ve_allocated: 100,
            ve_allocated_realtime: 154,
            ocean_allocated: 18.75,
            ocean_allocated_realtime: 29.75,
            ve_allocated_owner: 100,
            ve_allocated_realtime_owner: 154,
            ocean_allocated_owner: 18.75,
            ocean_allocated_realtime_owner: 29.75
        }
    ]

    const expectedAllocations = [
        {
            LP_addr: "lp1",
            nft_addr: "nft1",
            percent: "0.5",
            ve_amt: 100,
            ocean_amt: 25
        },
        {
            LP_addr: "lp2",
            nft_addr: "nft2",
            percent: "0.25",
            ve_amt: 100,
            ocean_amt: 18.75
        }
    ]

    expect(resultNftinfo[0].ocean_allocated_realtime).toBeCloseTo(
        expectedNftinfo[0].ocean_allocated_realtime,
        5
    )
    expect(resultNftinfo[0].ocean_allocated_realtime_owner).toBeCloseTo(
        expectedNftinfo[0].ocean_allocated_realtime_owner,
        5
    )
    expect(resultNftinfo[1].ocean_allocated_realtime).toBeCloseTo(
        expectedNftinfo[1].ocean_allocated_realtime,
        5
    )
    expect(resultNftinfo[1].ocean_allocated_realtime_owner).toBeCloseTo(
        expectedNftinfo[1].ocean_allocated_realtime_owner,
        5
    )

    delete resultNftinfo[0].ocean_allocated_realtime
    delete resultNftinfo[0].ocean_allocated_realtime_owner
    delete resultNftinfo[1].ocean_allocated_realtime
    delete resultNftinfo[1].ocean_allocated_realtime_owner

    delete expectedNftinfo[0].ocean_allocated_realtime
    delete expectedNftinfo[0].ocean_allocated_realtime_owner
    delete expectedNftinfo[1].ocean_allocated_realtime
    delete expectedNftinfo[1].ocean_allocated_realtime_owner

    expect(resultNftinfo).toStrictEqual(expectedNftinfo)
    expect(resultAllocations).toStrictEqual(expectedAllocations)
})
