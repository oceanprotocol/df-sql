const db = require("../../db")

async function dropTable(dbname, round) {
    if (round === undefined) {
        await db.promise().query(`DELETE FROM ${dbname}`)
        return
    }
    await db.promise().query(`DELETE FROM ${dbname} WHERE round = ?`, [round])
}

async function updateDb(data, dbname, round) {
    console.log("Updating db", dbname, round, data.length)
    for (const element of data) {
        let keys = Object.keys(element)
        let values = Object.values(element)

        if (round !== undefined) {
            keys.push("round")
            values.push(round)
        }

        // Create placeholders for parameterized query
        const placeholders = keys.map(() => "?").join(", ")

        let query = `INSERT INTO ${dbname} (${keys.join(
            ", "
        )}) VALUES (${placeholders});`

        try {
            await db.promise().query(query, values)
        } catch (error) {
            console.error("Error updating database:", error)
        }
    }
}

async function updateRewardsSummary(round) {
    // aggregates the sum of "passive" and "curating" rewards for each "LP_addr" for a given "round" by getting the sum of `amt` from `rewards_info` and `passive_rewards_info` tables
    await db.promise().query(
        `
    INSERT INTO rewards_summary(LP_addr,passive_amt,curating_amt,round) 
    select LP_addr,sum(passive) as passive_amt,sum(curating) as curating_amt,? FROM 
        (
            select LP_addr,sum(reward) as passive,0 as curating from passive_rewards_info WHERE round=? group by LP_addr 
            UNION 
            select LP_addr,0 as passive,sum(amt) as curating from rewards_info WHERE round=? group by LP_addr
        ) as foo group by LP_addr`,
        [round, round, round]
    )
}

module.exports = {
    updateDb,
    dropTable,
    updateRewardsSummary
}
