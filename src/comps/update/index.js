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

    if (data.length === 0) return

    // Determine the number of keys expected in each element
    const expectedKeyCount =
        Object.keys(data[0]).length + (round !== undefined ? 1 : 0)
    let valuesToInsert = []

    for (const element of data) {
        const currentKeyCount =
            Object.keys(element).length + (round !== undefined ? 1 : 0)

        // Skip elements with inconsistent number of keys
        if (currentKeyCount !== expectedKeyCount) {
            console.log(
                "Skipping element with inconsistent data structure:",
                element
            )
            continue
        }

        let values = Object.values(element)

        if (round !== undefined) {
            values.push(round) // Add round value if it's provided
        }

        valuesToInsert.push(values) // Add this set of values for bulk insertion
    }

    if (valuesToInsert.length === 0) {
        console.log("No valid data to insert. Exiting function.")
        return
    }

    let keys = Object.keys(data[0])
    if (round !== undefined) {
        keys.push("round")
    }

    const singlePlaceholder = `(${keys.map(() => "?").join(", ")})`
    const allPlaceholders = valuesToInsert
        .map(() => singlePlaceholder)
        .join(", ")

    let query = `INSERT INTO ${dbname} (${keys.join(
        ", "
    )}) VALUES ${allPlaceholders};`

    try {
        await db.promise().query(query, [].concat(...valuesToInsert))
    } catch (error) {
        console.error("Error during bulk database update:", error)
    }
}

async function updateRewardsSummary(round) {
    // Aggregates the sum of "passive," "curating," "predictoor" and "challenge" rewards for each "LP_addr" for a given "round" by getting the sum of `amt` from `rewards_info`, `passive_rewards_info`, `predictoor_rewards` and `challenge_rewards` tables
    await db.promise().query(
        `
        INSERT INTO rewards_summary(LP_addr, passive_amt, curating_amt, predictoor_amt, challenge_amt, round) 
        SELECT LP_addr, SUM(passive) AS passive_amt, SUM(curating) AS curating_amt, SUM(predictoor) AS predictoor_amt, SUM(challenge) AS challenge_amt, ? FROM 
            (
                SELECT LP_addr, SUM(reward) AS passive, 0 AS curating, 0 AS predictoor, 0 AS challenge FROM passive_rewards_info WHERE round = ? GROUP BY LP_addr
                UNION 
                SELECT LP_addr, 0 AS passive, SUM(amt) AS curating, 0 AS predictoor, 0 AS challenge FROM rewards_info WHERE round = ? GROUP BY LP_addr
                UNION
                SELECT predictoor_addr AS LP_addr, 0 AS passive, 0 AS curating, OCEAN_amt AS predictoor, 0 AS challenge FROM predictoor_rewards WHERE round = ?
                UNION
                SELECT winner_addr AS LP_addr, 0 AS passive, 0 AS curating, 0 AS predictoor, SUM(OCEAN_amt) AS challenge FROM challenge_rewards WHERE round = ? GROUP BY winner_addr
            ) AS foo GROUP BY LP_addr`,
        [round, round, round, round, round]
    )
}

module.exports = {
    updateDb,
    dropTable,
    updateRewardsSummary
}
