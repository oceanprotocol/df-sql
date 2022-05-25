const { parseCsv } = require("../csv/parse");
const db = require("../../db");

async function updateDb(filepath, dbname) {
  console.log("Updating db", dbname);
  let poolInfos = parseCsv(filepath);
  try {
    await db.promise().query(`DELETE FROM ${dbname}`);
  } catch (err) {
    return err;
  }
  poolInfos.forEach(async (element) => {
    let keys = Object.keys(element);
    let values = Object.values(element);

    let query = `INSERT INTO ${dbname} (${keys.join(", ")}) VALUES (${values
      .map((x) =>
        isNaN(x) || x.toString().startsWith("0x") ? `"${x}"` : parseFloat(x)
      )
      .join(", ")})`;

    let res = await db.promise().query(query);
    console.log(res);
  });
}

module.exports = {
  updateDb,
};
