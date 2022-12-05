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
    allocations.forEach((allocation, i) => {
        if (!nft_allocations[allocation.nft_addr]) {
            nft_allocations[allocation.nft_addr] = 0
            nft_allocations_ocean[allocation.nft_addr] = 0
        }

        let lpbal = vebals.find((x) => x.LP_addr === allocation.LP_addr)
        allocations[i].ve_amt = 0
        allocations[i].ocean_amt = 0
        if (!lpbal || !lpbal.balance) return
        let ve_amt = parseFloat(allocation.percent) * parseFloat(lpbal.balance)
        let ocean_amt =
            parseFloat(allocation.percent) * parseFloat(lpbal.locked_amt)

        nft_allocations[allocation.nft_addr] += ve_amt
        nft_allocations_ocean[allocation.nft_addr] += ocean_amt
        allocations[i].ve_amt = ve_amt
        allocations[i].ocean_amt = ocean_amt
    })

    let nft_allocations_realtime = {} // nft addr : ve amount
    let nft_allocations_ocean_realtime = {}
    for (let allocation of allocations_realtime) {
        if (!nft_allocations_realtime[allocation.nft_addr]) {
            nft_allocations_realtime[allocation.nft_addr] = 0
            nft_allocations_ocean_realtime[allocation.nft_addr] = 0
        }

        let lpbal = vebals_realtime.find(
            (x) => x.LP_addr === allocation.LP_addr
        )
        if (!lpbal || !lpbal.balance) continue
        nft_allocations_realtime[allocation.nft_addr] +=
            parseFloat(allocation.percent) * parseFloat(lpbal.balance)
        nft_allocations_ocean_realtime[allocation.nft_addr] +=
            parseFloat(allocation.percent) * parseFloat(lpbal.locked_amt)
    }

    nftinfo.forEach((n, i) => {
        nftinfo[i].ve_allocated = nft_allocations[n.nft_addr] ?? 0 // consider 0 if no allocations
        nftinfo[i].ve_allocated_realtime =
            nft_allocations_realtime[n.nft_addr] ?? 0 // consider 0 if no allocations
        nftinfo[i].ocean_allocated = nft_allocations_ocean[n.nft_addr] ?? 0
        nftinfo[i].ocean_allocated_realtime =
            nft_allocations_ocean_realtime[n.nft_addr] ?? 0
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
                let rate = rates.find(
                    (x) =>
                        x.token_symbol.replace("M", "") ===
                        token_symbol.replace("M", "")
                )

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
    })
    return nftinfo
}

const parsePurgatory = (nftinfo) => {
    nftinfo.forEach((nft, i) => {
        nftinfo[i].is_purgatory = nft.is_purgatory === "1" ? "true" : "false"
    })
    return nftinfo
}

module.exports = {
    calculateAllocations,
    calculateVolumes,
    parsePurgatory
}
