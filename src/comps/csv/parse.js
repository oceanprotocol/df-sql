const fs = require("fs");

const cleanText = (text) => text.replace(/(\r\n|\n|\r)/gm, "");

function createObject(keys, data) {
  let o = {};
  keys.forEach((_, y) => {
    o[keys[y]] = data[y];
  });

  return o;
}

function parseCsv(path) {
  let result = [];

  let data = fs.readFileSync(path, "utf-8");
  let rows = data.split("\n");

  let firstRow = rows.shift();
  let keys = firstRow.split(",").map(cleanText);

  rows.forEach((x) => {
    x = x.split(",");
    if (x.length > keys.length) {
      x[keys.length - 1] += x.slice(keys.length).join(",");
    }
    x = x.map(cleanText)
    if (x.some((p) => !p)) return;
    let obj = createObject(keys, x);
    result.push(obj);
  });

  return result;
}

module.exports = { parseCsv };
