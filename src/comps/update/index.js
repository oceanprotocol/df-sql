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
    // Aggregates the sum of "passive," "curating," and "predictoor" rewards for each "LP_addr" for a given "round" by getting the sum of `amt` from `rewards_info`, `passive_rewards_info`, and `predictoor_rewards` tables
    await db.promise().query(
        `
    INSERT INTO rewards_summary(LP_addr, passive_amt, curating_amt, predictoor_amt, round) 
    SELECT LP_addr, SUM(passive) AS passive_amt, SUM(curating) AS curating_amt, SUM(OCEAN_amt) AS predictoor_amt, ? FROM 
        (
            SELECT LP_addr, SUM(reward) AS passive, 0 AS curating, 0 AS OCEAN_amt FROM passive_rewards_info WHERE round = ? GROUP BY LP_addr 
            UNION 
            SELECT LP_addr, 0 AS passive, SUM(amt) AS curating, 0 AS OCEAN_amt FROM rewards_info WHERE round = ? GROUP BY LP_addr
            UNION
            SELECT predictoor_addr AS LP_addr, 0 AS passive, 0 AS curating, OCEAN_amt FROM predictoor_rewards WHERE round = ?
        ) AS foo GROUP BY LP_addr`,
        [round, round, round, round]
    );
}


module.exports = {
    updateDb,
    dropTable,
    updateRewardsSummary
}
