require("dotenv").config()
const mysql = require("mysql2")
const dbStructure = require("../../db/structure")


function createTables(con) {
    Object.entries(dbStructure).forEach(([tableName, sqlQuery]) => {
        con.query(sqlQuery, function (err, result) {
            if (err) throw err
            console.log(`Table ${tableName} created`)
        })
    })
}

async function createDb(con) {
    await con.promise().query(`CREATE DATABASE ${process.env["MYSQL_DB"]}`)
}

async function createAll() {
    let con = mysql.createConnection({
        host: process.env["MYSQL_HOST"],
        user: process.env["MYSQL_USERNAME"],
        password: process.env["MYSQL_PASS"]
    })
    await createDb(con)
    con = mysql.createConnection({
        host: process.env["MYSQL_HOST"],
        user: process.env["MYSQL_USERNAME"],
        password: process.env["MYSQL_PASS"],
        database: process.env["MYSQL_DB"]
    })
    await createTables(con)
}

module.exports = {
    createAll
}
