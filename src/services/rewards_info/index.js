const { selectQuery } = require("../querier")

const getRewards = ({ query, sort, limit, offset, group, fields, join }) => {
    return selectQuery(
        query,
        sort,
        limit,
        offset,
        "rewards_info",
        group,
        fields,
        join
    )
}

module.exports = {
    getRewards
}
