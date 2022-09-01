require("dotenv").config();
const mysql = require("mysql2");
const {
  allocationsTable,
  nftVolsTable,
  vebalsTable,
  rewardsInfo,
  nftinfoTable,
} = require("../../db/structure");

function createTables(con) {
  con.query(allocationsTable, function (err, result) {
    if (err) throw err;
    console.log("Table allocations created");
  });
  con.query(nftVolsTable, function (err, result) {
    if (err) throw err;
    console.log("Table nft_vols created");
  });
  con.query(vebalsTable, function (err, result) {
    if (err) throw err;
    console.log("Table vebals created");
  });
  con.query(rewardsInfo, function (err, result) {
    if (err) throw err;
    console.log("Table rewards_info created");
  });
  con.query(nftinfoTable, function (err, result) {
    if (err) throw err;
    console.log("Table nft_info created");
  });
}

async function createDb(con) {
  await con.promise().query(`CREATE DATABASE ${process.env["MYSQL_DB"]}`);
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
  createAll,
};
