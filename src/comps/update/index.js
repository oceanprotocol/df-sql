const db = require("../../db")

async function cleanDb(dbname, round) {
    await db.promise().query(`DELETE FROM ${dbname} WHERE round = ?`, [round])
}

async function updateDb(data, dbname, round) {
    console.log("Updating db", dbname, round, data.length)
    data.forEach(async (element) => {
        let keys = Object.keys(element)
        let values = Object.values(element)

        keys.push("round")
        values.push(round)

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


async function updateRewardsSummary(round) {
    await db.promise().query(`
    INSERT INTO rewards_summary(LP_addr,passive_amt,curating_amt,round) 
    select LP_addr,sum(passive) as passive_amt,sum(curating) as curating_amt,? FROM 
        (
            select LP_addr,sum(amt) as passive,0 as curating from vebals WHERE round=? group by LP_addr 
            UNION 
            select LP_addr,0 as passive,sum(amt) as curating from rewards_info WHERE round=? group by LP_addr
        ) as foo group by LP_addr`
    , [round,round,round])
}

module.exports = {
    updateDb,
    cleanDb,
    updateRewardsSummary
}
