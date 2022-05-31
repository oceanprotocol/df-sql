const { selectQuery } = require("../querier");

const getVols = ({ jsonsql, sort, limit, offset, group, fields }) => {
  return selectQuery(jsonsql, sort, limit, offset, "pool_vols", group, fields);
};

module.exports = {
  getVols,
};
