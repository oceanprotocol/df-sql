const { selectQuery } = require("../querier");

const getStakes = ({ query, sort, limit, offset, group, fields }) => {
  return selectQuery(query, sort, limit, offset, "pool_stakes", group, fields);
};

module.exports = {
  getStakes,
};
