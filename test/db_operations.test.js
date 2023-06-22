const db = require("../src/db")
const {
    updateDb,
    dropTable,
    updateRewardsSummary
} = require("../src/comps/update/index.js")

jest.mock("../src/db", () => ({
    promise: jest.fn().mockReturnThis(),
    query: jest.fn(),
    escape: jest.fn()
}))

describe("Test db operations", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test("dropTable with round", async () => {
        const dbname = "test"
        const round = 1
        await dropTable(dbname, round)
        expect(db.promise().query).toHaveBeenCalledWith(
            `DELETE FROM ${dbname} WHERE round = ?`,
            [round]
        )
    })

    test("dropTable without round", async () => {
        const dbname = "test"
        await dropTable(dbname)
        expect(db.promise().query).toHaveBeenCalledWith(`DELETE FROM ${dbname}`)
    })
    test("updateDb with round", async () => {
        const data = [{ volume: "10" }]
        const dbname = "nft_info"
        const round = 1
        await updateDb(data, dbname, round)
        expect(db.promise().query).toHaveBeenCalledWith(
            "INSERT INTO nft_info (volume, round) VALUES (?, ?);",
            ["10", 1]
        )
    })

    test("updateDb without round", async () => {
        const data = [{ volume: "10" }]
        const dbname = "nft_info"
        await updateDb(data, dbname)
        expect(db.promise().query).toHaveBeenCalledWith(
            "INSERT INTO nft_info (volume) VALUES (?);",
            ["10"]
        )
    })

    test("updateRewardsSummary", async () => {
        const round = 1
        await updateRewardsSummary(round)
        expect(db.promise().query).toHaveBeenCalledWith(
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
        )
    })

    test("updateDb is safe from SQL injection", async () => {
        const data = [{ volume: "' OR '1'='1" }] // This is a simple SQL injection attempt
        const dbname = "nft_info"
        await updateDb(data, dbname)

        // The SQL injection attempt should appear as a simple string in the query, not as part of the SQL syntax
        expect(db.promise().query).toHaveBeenCalledWith(
            `INSERT INTO ${dbname} (volume) VALUES (?);`,
            ["' OR '1'='1"]
        )
    })
})
