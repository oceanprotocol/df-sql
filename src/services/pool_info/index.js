const { selectQuery } = require("../querier");

const getPools = ({ jsonsql, sort, limit, offset, group, fields }) => {
  return selectQuery(jsonsql, sort, limit, offset, "pool_info", group, fields);
};

module.exports = {
  getPools,
};
