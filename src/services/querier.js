const db = require("../db")
const jsonSql = require("json-sql")({
    dialect: "mysql"
})

String.prototype.replaceAll = function (search, replacement) {
    var target = this
    return target.replace(new RegExp(search, "g"), replacement)
}

const selectQuery = (
    jsonsql = { round: 0 },
    sort,
    limit,
    offset,
    dbname,
    group,
    fields,
    join
) => {
    let obj = {
        type: "select",
        table: dbname
    }
    if (fields) obj.fields = fields
    if (jsonsql) obj.condition = jsonsql
    if (sort) obj.sort = sort
    if (limit) obj.limit = limit
    else obj.limit = 10000
    if (offset) obj.offset = offset
    if (group) obj.group = group
    if (join) obj.join = join
    if (jsonsql.round === undefined) jsonsql.round = 0

    const query = jsonSql.build(obj)
    console.log("Query:", query)

    let q = query.query
    // q = q.replaceAll('"', "`");
    const vals = []
    for (const [key, val] of Object.entries(query.values)) {
        q = q.replace("$" + key, "?")
        vals.push(val)
    }

    return new Promise((res) => {
        db.query(q, vals, (err, data) => {
            if (err) {
                console.error(err)
            }
            return res(data)
        })
    })
}

module.exports = {
    selectQuery
}
