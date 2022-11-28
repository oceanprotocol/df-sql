const calculateAllocations = ({
    allocations,
    allocations_realtime,
    vebals,
    vebals_realtime,
    nftinfo
}) => {
    // find how much has been allocated to each data nft
    let nft_allocations = {} // nft addr : ve amount
    allocations.forEach((allocation, i) => {
        if (!nft_allocations[allocation.nft_addr]) {
            nft_allocations[allocation.nft_addr] = 0
        }

        let lpbal = vebals.find((x) => x.LP_addr === allocation.LP_addr)
        allocations[i].ve_amt = 0
        if (!lpbal || !lpbal.balance) return
        let ve_amt = parseFloat(allocation.percent) * parseFloat(lpbal.balance)
        nft_allocations[allocation.nft_addr] += ve_amt
        allocations[i].ve_amt = ve_amt
    })

    let nft_allocations_realtime = {} // nft addr : ve amount
    for (let allocation of allocations_realtime) {
        if (!nft_allocations_realtime[allocation.nft_addr]) {
            nft_allocations_realtime[allocation.nft_addr] = 0
        }

        let lpbal = vebals_realtime.find(
            (x) => x.LP_addr === allocation.LP_addr
        )
        if (!lpbal || !lpbal.balance) continue
        nft_allocations_realtime[allocation.nft_addr] +=
            parseFloat(allocation.percent) * parseFloat(lpbal.balance)
    }

    nftinfo.forEach((n, i) => {
        nftinfo[i].ve_allocated = nft_allocations[n.nft_addr] ?? 0 // consider 0 if no allocations
        nftinfo[i].ve_allocated_realtime =
            nft_allocations_realtime[n.nft_addr] ?? 0 // consider 0 if no allocations
    })
    return nftinfo
}

const calculateVolumes = ({ rates, symbols, nftvols }) => {
    nftvols.forEach((n, i) => {
        nftvols[i].volume = nftvols.reduce((acc, x) => {
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
    return nftvols
}

module.exports = {
    calculateAllocations,
    calculateVolumes
}
