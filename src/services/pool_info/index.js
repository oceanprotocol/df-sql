const { selectQuery } = require("../querier");

const getPools = ({ query, sort, limit, offset, group, fields, join }) => {
  return selectQuery(
    query,
    sort,
    limit,
    offset,
    "pool_info",
    group,
    fields,
    join
  );
};

module.exports = {
  getPools,
};
