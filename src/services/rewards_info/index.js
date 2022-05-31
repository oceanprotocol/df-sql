const { selectQuery } = require("../querier");

const getRewards = ({ jsonsql, sort, limit, offset, group, fields }) => {
  return selectQuery(
    jsonsql,
    sort,
    limit,
    offset,
    "rewards_info",
    group,
    fields
  );
};

module.exports = {
  getRewards,
};
