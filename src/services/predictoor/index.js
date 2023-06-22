const { selectQuery } = require("../querier")

const getPredictoorData = ({ query, sort, limit, offset, group, fields, join }) => {
    return selectQuery(
        query,
        sort,
        limit,
        offset,
        "predictoor_data",
        group,
        fields,
        join
    )
}

const getPredictoorRewards = ({ query, sort, limit, offset, group, fields, join }) => {
    return selectQuery(
        query,
        sort,
        limit,
        offset,
        "predictoor_rewards",
        group,
        fields,
        join
    )
}

module.exports = {
    getPredictoorData,
    getPredictoorRewards
}
