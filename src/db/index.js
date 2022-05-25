require("dotenv").config();
const mysql = require("mysql2");
const { createAll } = require("./setup");


const pool = mysql.createPool({
  connectionLimit: 20,
  host: process.env["MYSQL_HOST"],
  user: process.env["MYSQL_USERNAME"],
  password: process.env["MYSQL_PASS"],
  database: process.env["MYSQL_DB"],
  debug: false,
});


function getConnection() {
  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("An error occured:", err);
      if (err.code == "ER_BAD_DB_ERROR") {
        createAll()
      }
      return setTimeout(() => getConnection(), 5000)
    }
    console.log("Database connected");
    connection.release();
  });
}
getConnection()


module.exports = pool;
