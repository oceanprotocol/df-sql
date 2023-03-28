const { selectQuery } = require("../querier")

const getRewardsSummary = ({
    query,
    sort,
    limit,
    offset,
    group,
    fields,
    join
}) => {
    return selectQuery(
        query,
        sort,
        limit,
        offset,
        "rewards_summary",
        group,
        fields,
        join
    )
}

module.exports = {
    getRewardsSummary
}
