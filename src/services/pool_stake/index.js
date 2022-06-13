const { selectQuery } = require("../querier");

const getStakes = ({ query, sort, limit, offset, group, fields, join }) => {
  return selectQuery(
    query,
    sort,
    limit,
    offset,
    "pool_stakes",
    group,
    fields,
    join
  );
};

module.exports = {
  getStakes,
};
