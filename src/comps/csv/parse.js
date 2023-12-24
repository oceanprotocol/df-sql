const fs = require("fs")

const cleanText = (text) => text.replace(/(\r\n|\n|\r)/gm, "")

function createObject(keys, data) {
    let o = {}
    keys.forEach((_, y) => {
        o[keys[y]] = data[y]
    })

    return o
}

function parseCsv(path) {
    let result = []

    let data = fs.readFileSync(path, "utf-8")
    let rows = data.split("\n")

    let firstRow = rows.shift()
    let keys = firstRow.split(",").map(cleanText)

    rows.forEach((row) => {
        let values = row.split(",").map(cleanText)

        // Skip the row if the number of values doesn't match the number of keys
        if (values.length !== keys.length) {
            // console.log("Skipping invalid row:", row)
            return
        }

        // Skip the row if any value is empty
        if (values.some((value) => !value)) {
            console.log("Skipping row with empty value(s):", row);
            return;
        }

        let obj = createObject(keys, values)
        result.push(obj)
    })

    return result
}

module.exports = { createObject, parseCsv }
