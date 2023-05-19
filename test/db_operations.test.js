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
    INSERT INTO rewards_summary(LP_addr,passive_amt,curating_amt,round) 
    select LP_addr,sum(passive) as passive_amt,sum(curating) as curating_amt,? FROM 
        (
            select LP_addr,sum(reward) as passive,0 as curating from passive_rewards_info WHERE round=? group by LP_addr 
            UNION 
            select LP_addr,0 as passive,sum(amt) as curating from rewards_info WHERE round=? group by LP_addr
        ) as foo group by LP_addr`,
            [round, round, round]
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
