const { selectQuery } = require("../querier")

const getAllocations = ({
    query = { round: 0 },
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
        "allocations",
        group,
        fields,
        join
    )
}

module.exports = {
    getAllocations
}
