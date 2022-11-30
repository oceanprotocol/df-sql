const { selectQuery } = require("../querier")

const getVols = ({ query, sort, limit, offset, group, fields, join }) => {
    return selectQuery(
        query,
        sort,
        limit,
        offset,
        "nft_vols",
        group,
        fields,
        join
    )
}

module.exports = {
    getVols
}
