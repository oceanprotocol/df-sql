const { Parser } = require("node-sql-parser")
const parser = new Parser()
const {
    allocationsTable,
    nftVolsTable,
    vebalsTable,
    rewardsInfo,
    passiveRewardsInfo,
    nftinfoTable,
    rewardsSummary,
    ownersInfo,
    predictoorData,
} = require("../db/structure")

describe("SQL Table Structures", () => {
    test.each([
        ["allocationsTable", allocationsTable],
        ["nftVolsTable", nftVolsTable],
        ["vebalsTable", vebalsTable],
        ["rewardsInfo", rewardsInfo],
        ["passiveRewardsInfo", passiveRewardsInfo],
        ["nftinfoTable", nftinfoTable],
        ["rewardsSummary", rewardsSummary],
        ["ownersInfo", ownersInfo],
        ["predictoorData", predictoorData]
    ])("validates structure of %s", (tableName, sqlQuery) => {
        let ast
        try {
            ast = parser.astify(sqlQuery)
        } catch (error) {
            throw new Error(
                `Error parsing SQL for ${tableName}: ${error.message}`
            )
        }
        if (sqlQuery.endsWith(";")) {
            // parser returns an array if the query ends with a ;
            ast.forEach((ast) => {
                expect(ast.type).toBe("create")
                expect(ast.keyword).toBe("table")
            })
        } else {
            expect(ast.type).toBe("create")
            expect(ast.keyword).toBe("table")
        }
    })
})
