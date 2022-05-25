require("dotenv").config();
const mysql = require("mysql2");
const { poolInfoTable, poolVolsTable, stakesChain } = require("../../db/structure");

function createTables(con) {
    con.query(poolInfoTable, function (err, result) {
        if (err) throw err;
        console.log("Table pool_info created");
    });
    con.query(poolVolsTable, function (err, result) {
        if (err) throw err;
        console.log("Table pool_vols created");
    });
    con.query(stakesChain, function (err, result) {
        if (err) throw err;
        console.log("Table pool_stakes created");
    });
}

async function createDb(con) {
    await con.promise().query(`CREATE DATABASE ${process.env["MYSQL_DB"]}`)
}

async function createAll() {
    let con = mysql.createConnection({
        host: process.env["MYSQL_HOST"],
        user: process.env["MYSQL_USERNAME"],
        password: process.env["MYSQL_PASS"],
    });
    await createDb(con);
    con = mysql.createConnection({
        host: process.env["MYSQL_HOST"],
        user: process.env["MYSQL_USERNAME"],
        password: process.env["MYSQL_PASS"],
        database: process.env["MYSQL_DB"],
    });
    await createTables(con);
}

module.exports = {
    createAll
}