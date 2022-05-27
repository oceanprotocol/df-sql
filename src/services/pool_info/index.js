const db = require("../../db");
const { selectQuery } = require("../querier");

const getPool = (addr) => {
  return new Promise((res) => {
    db.query("SELECT * FROM pool_info WHERE pool_addr=?", addr, (err, data) => {
      return res(data);
    });
  });
};

String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

const getPools = (jsonsql, sort, limit, offset) => {
  return selectQuery(jsonsql, sort, limit, offset, "pool_info")
};

module.exports = {
  getPool,
  getPools,
};
