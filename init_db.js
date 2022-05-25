require("dotenv").config();
const mysql = require("mysql2");

const con = mysql.createConnection({
  host: process.env["MYSQL_HOST"],
  user: process.env["MYSQL_USERNAME"],
  password: process.env["MYSQL_PASS"],
});

con.query(`CREATE DATABASE ${process.env["MYSQL_DB"]}`, function (err, result) {
  if (err) throw err;
  console.log("Database created");
  process.exit(0);
});
