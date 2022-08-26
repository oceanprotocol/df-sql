require("dotenv").config();
const mysql = require("mysql2");
const {
  allocationsTable,
  nftVolsTable,
  vebalsTable,
  rewardsInfo,
} = require("./db/structure");

const con = mysql.createConnection({
  host: process.env["MYSQL_HOST"],
  user: process.env["MYSQL_USERNAME"],
  password: process.env["MYSQL_PASS"],
  database: process.env["MYSQL_DB"],
});

con.connect(function (err) {
  if (err) throw err;

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
});
