const { selectQuery } = require("../querier");

const getVols = ({ query, sort, limit, offset, group, fields }) => {
  return selectQuery(query, sort, limit, offset, "pool_vols", group, fields);
};

module.exports = {
  getVols,
};
