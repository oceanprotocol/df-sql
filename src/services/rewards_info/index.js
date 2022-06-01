const { selectQuery } = require("../querier");

const getRewards = ({ query, sort, limit, offset, group, fields }) => {
  return selectQuery(query, sort, limit, offset, "rewards_info", group, fields);
};

module.exports = {
  getRewards,
};
