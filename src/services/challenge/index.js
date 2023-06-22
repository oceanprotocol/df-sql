const { selectQuery } = require("../querier")

const getChallengeData = ({ query, sort, limit, offset, group, fields, join }) => {
    return selectQuery(
        query,
        sort,
        limit,
        offset,
        "challenge_data",
        group,
        fields,
        join
    )
}

const getChallengeRewards = ({ query, sort, limit, offset, group, fields, join }) => {
    return selectQuery(
        query,
        sort,
        limit,
        offset,
        "challenge_rewards",
        group,
        fields,
        join
    )
}

module.exports = {
    getChallengeData,
    getChallengeRewards
}
