const allocationMultiplier = ({ nftinfo, lp_addr, nft_addr }) => {
    let nftrec = nftinfo.find((x) => x.nft_addr === nft_addr)
    if (nftrec != undefined) {
        let _owneraddr = nftrec.owner_addr
        if (_owneraddr === lp_addr) {
            return 2
        }
    }
    return 1
}

const calculateAllocations = ({
    allocations,
    allocations_realtime,
    vebals,
    vebals_realtime,
    nftinfo
}) => {
    // find how much has been allocated to each data nft
    let nft_allocations = {} // nft addr : ve amount
    let nft_allocations_ocean = {}
    let nft_allocations_owner = {}
    let nft_allocations_owner_ocean = {}
    allocations.forEach((allocation, i) => {
        if (!nft_allocations[allocation.nft_addr]) {
            nft_allocations[allocation.nft_addr] = 0
            nft_allocations_ocean[allocation.nft_addr] = 0
        }

        let lpbal = vebals.find((x) => x.LP_addr === allocation.LP_addr)
        allocations[i].ve_amt = 0
        allocations[i].ocean_amt = 0
        if (!lpbal || !lpbal.balance) return
        let multiplier = allocationMultiplier({
            nftinfo,
            lp_addr: allocation.LP_addr,
            nft_addr: allocation.nft_addr
        })

        // publisher 2x bonus
        let ve_amt =
            parseFloat(allocation.percent) *
            parseFloat(lpbal.balance) *
            multiplier
        let ocean_amt =
            parseFloat(allocation.percent) * parseFloat(lpbal.locked_amt)

        // Let's track what was allocated globally
        nft_allocations[allocation.nft_addr] += ve_amt
        nft_allocations_ocean[allocation.nft_addr] += ocean_amt
        allocations[i].ve_amt = ve_amt
        allocations[i].ocean_amt = ocean_amt

        // track owner allocation
        if (multiplier !== 1) {
            nft_allocations_owner[allocation.nft_addr] = ve_amt
            nft_allocations_owner_ocean[allocation.nft_addr] = ocean_amt
        }
    })

    let nft_allocations_realtime = {} // nft addr : ve amount
    let nft_allocations_ocean_realtime = {}
    let nft_allocations_realtime_owner = {}
    let nft_allocations_ocean_realtime_owner = {}
    for (let allocation of allocations_realtime) {
        if (!nft_allocations_realtime[allocation.nft_addr]) {
            nft_allocations_realtime[allocation.nft_addr] = 0
            nft_allocations_ocean_realtime[allocation.nft_addr] = 0
        }

        let lpbal = vebals_realtime.find(
            (x) => x.LP_addr === allocation.LP_addr
        )
        if (!lpbal || !lpbal.balance) continue

        let multiplier = allocationMultiplier({
            nftinfo,
            lp_addr: allocation.LP_addr,
            nft_addr: allocation.nft_addr
        })

        // publisher 2x bonus
        let ve_amt =
            parseFloat(allocation.percent) *
            parseFloat(lpbal.balance) *
            multiplier
        let ocean_amt =
            parseFloat(allocation.percent) * parseFloat(lpbal.locked_amt)

        nft_allocations_realtime[allocation.nft_addr] += ve_amt
        nft_allocations_ocean_realtime[allocation.nft_addr] += ocean_amt

        // track owner allocation
        if (multiplier !== 1) {
            nft_allocations_realtime_owner[allocation.nft_addr] = ve_amt
            nft_allocations_ocean_realtime_owner[allocation.nft_addr] =
                ocean_amt
        }
    }

    nftinfo.forEach((n, i) => {
        // nftinfo summarizing for global allocations
        nftinfo[i].ve_allocated = nft_allocations[n.nft_addr] ?? 0 // consider 0 if no allocations
        nftinfo[i].ve_allocated_realtime =
            nft_allocations_realtime[n.nft_addr] ?? 0 // consider 0 if no allocations
        nftinfo[i].ocean_allocated = nft_allocations_ocean[n.nft_addr] ?? 0
        nftinfo[i].ocean_allocated_realtime =
            nft_allocations_ocean_realtime[n.nft_addr] ?? 0

        // nftinfo summarizing for owner/publisher 2x allocation bonus
        nftinfo[i].ve_allocated_owner = nft_allocations_owner[n.nft_addr] ?? 0 // consider 0 if no allocations
        nftinfo[i].ve_allocated_realtime_owner =
            nft_allocations_realtime_owner[n.nft_addr] ?? 0 // consider 0 if no allocations
        nftinfo[i].ocean_allocated_owner =
            nft_allocations_owner_ocean[n.nft_addr] ?? 0
        nftinfo[i].ocean_allocated_realtime_owner =
            nft_allocations_ocean_realtime_owner[n.nft_addr] ?? 0
    })
    return { nftinfo, allocations }
}

const calculateVolumes = ({ rates, symbols, nftvols, nftinfo }) => {
    nftinfo.forEach((n, i) => {
        nftinfo[i].volume = nftvols.reduce((acc, x) => {
            if (x.nft_addr === n.nft_addr) {
                let baseTokenSymbol = symbols.find(
                    (y) => y.token_addr === x.basetoken_addr
                )

                if (!baseTokenSymbol) {
                    console.error(
                        `No symbol found for ${x.basetoken_addr} in ${n.nft_addr}`
                    )
                    return acc
                }

                let token_symbol = baseTokenSymbol.token_symbol

                let rate = 0
                if (token_symbol == "USDC") {
                    rate = { rate: 1 }
                } else {
                    rate = rates.find(
                        (x) =>
                            x.token_symbol.replace("M", "") ===
                            token_symbol.replace("M", "")
                    )
                }

                if (!rate) {
                    console.error(
                        `No rate found for ${token_symbol} in ${n.nft_addr}`
                    )
                    return acc
                }

                return acc + parseFloat(x.vol_amt) * parseFloat(rate.rate)
            }
            return acc
        }, 0)
        if (nftinfo[i].volume == NaN) {
            console.log("Found NaN value", nftinfo[i])
            nftinfo[i].volume = 0
        }
    })
    return nftinfo
}

const parsePurgatory = (nftinfo) => {
    nftinfo.forEach((nft, i) => {
        nftinfo[i].is_purgatory = nft.is_purgatory === "1" ? 1 : 0
    })
    return nftinfo
}

module.exports = {
    allocationMultiplier,
    calculateAllocations,
    calculateVolumes,
    parsePurgatory
}
