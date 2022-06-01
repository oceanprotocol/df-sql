const { selectQuery } = require("../querier");

const getPools = ({ query, sort, limit, offset, group, fields }) => {
  return selectQuery(query, sort, limit, offset, "pool_info", group, fields);
};

module.exports = {
  getPools,
};
