const { selectQuery } = require("../querier")

const getveBals = ({ query, sort, limit, offset, group, fields, join }) => {
    return selectQuery(
        query,
        sort,
        limit,
        offset,
        "vebals",
        group,
        fields,
        join
    )
}

module.exports = {
    getveBals
}
