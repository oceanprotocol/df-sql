const { selectQuery } = require("../querier");

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, "g"), replacement);
};

const getVols = (jsonsql, sort, limit, offset) => {
    return selectQuery(jsonsql, sort, limit, offset, "pool_vols")
};

module.exports = {
    getVols,
};
