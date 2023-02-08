const db = require("../../db")

async function cleanDb(dbname, round) {
    if (!round !== undefined) {
        await db.promise().query(`DELETE FROM ${dbname}`)
        return
    }
    await db.promise().query(`DELETE FROM ${dbname} WHERE round = ?`, [round])
}

async function updateDb(data, dbname, round) {
    console.log("Updating db", dbname, round, data.length)
    data.forEach(async (element) => {
        let keys = Object.keys(element)
        let values = Object.values(element)

        if (round !== undefined) {
            keys.push("round")
            values.push(round)
        }

        let query = `INSERT INTO ${dbname} (${keys.join(", ")}) VALUES (${values
            .map((x) => {
                if (isNaN(x) || x.toString().startsWith("0x")) {
                    let str = `${x}`
                    str = str.replace(/%@#/g, ",")
                    str = db.escape(str)
                    return str
                } else {
                    return parseFloat(x)
                }
            })
            .join(", ")})`

        let res = await db.promise().query(query)
    })
}

module.exports = {
    updateDb,
    cleanDb
}
