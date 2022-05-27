const db = require("../db");
const jsonSql = require("json-sql")();

const selectQuery = (jsonsql, sort, limit, offset, dbname) => {
    let obj = {
        type: "select",
        table: dbname,
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
    selectQuery
}