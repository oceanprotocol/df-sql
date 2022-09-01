const { selectQuery } = require("../querier");

const getNftInfo = ({ query, sort, limit, offset, group, fields, join }) => {
  return selectQuery(
    query,
    sort,
    limit,
    offset,
    "nft_info",
    group,
    fields,
    join
  );
};

module.exports = {
  getNftInfo,
};
