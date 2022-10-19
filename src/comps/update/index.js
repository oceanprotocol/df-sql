const { parseCsv } = require("../csv/parse");
const db = require("../../db");

async function cleanDb(dbname) {
  await db.promise().query(`DELETE FROM ${dbname}`);
}

async function updateDb(data, dbname) {
  console.log("Updating db", dbname);
  data.forEach(async (element) => {
    let keys = Object.keys(element);
    let values = Object.values(element);

    let query = `INSERT INTO ${dbname} (${keys.join(", ")}) VALUES (${values
      .map((x) => {
        if (isNaN(x) || x.toString().startsWith("0x")) {
          let str = `"${x}"`
          str = str.replace(/%@#/g, ',');
          str = db.escape(str)
          return str
        } else {
          return parseFloat(x)
        }
      }
      )
      .join(", ")})`;

    let res = await db.promise().query(query);
  });
}

module.exports = {
  updateDb,
  cleanDb,
};
