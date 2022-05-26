const db = require("../../db");
const jsonSql = require("json-sql")();

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
  let obj = {
    type: "select",
    table: "pool_info",
  }
  if (jsonsql) obj.condition = jsonsql
  if (sort) obj.sort = sort
  if (limit) obj.limit = limit
  if (offset) obj.offset = offset

  const query = jsonSql.build(obj);


  let q = query.query;
  q = q.replaceAll('"', "`");
  const vals = [];
  for (const [key, val] of Object.entries(query.values)) {
    q = q.replace("$" + key, "?");
    vals.push(val);
  }

  return new Promise((res) => {
    db.query(q, vals, (err, data) => {
      if (err) {
        console.error(err);
      }
      return res(data);
    });
  });
};

module.exports = {
  getPool,
  getPools,
};
