// bump start script
require("dotenv").config()
const mysql = require("mysql2")
const dbStructure = require("./db/structure");

const con = mysql.createConnection({
    host: process.env["MYSQL_HOST"],
    user: process.env["MYSQL_USERNAME"],
    password: process.env["MYSQL_PASS"],
    database: process.env["MYSQL_DB"]
})

con.connect(function (err) {
    if (err) throw err
    Object.entries(dbStructure).forEach(([tableName, sqlQuery]) => {
        con.query(sqlQuery, function (err, result) {
            if (err) throw err
            console.log(`Table ${tableName} created`)
        })
    })
})
