const db = require("../src/db")
const { selectQuery } = require("../src/services/querier")

jest.mock("../src/db", () => ({
    promise: jest.fn().mockReturnThis(),
    query: jest.fn(),
    escape: jest.fn()
}))

describe("selectQuery module", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test("selectQuery should generate and execute the correct SQL query", async () => {
        const jsonsql = { round: 0, mock: 1, tomato: "tomato" }
        const sort = "field ASC"
        const limit = 10
        const offset = 0
        const dbname = "table_name"
        const group = "field"
        const fields = ["field1", "field2"]
        const join = { table: "table3" }

        db.query.mockImplementation((query, values, callback) => {
            callback(null, "mocked data")
        })

        await selectQuery(
            jsonsql,
            sort,
            limit,
            offset,
            dbname,
            group,
            fields,
            join
        )

        const expectedQuery =
            "select `field1`, `field2` from `table_name` join `table` where `round` = 0 and `mock` = 1 and `tomato` = ? group by `field` order by `field ASC` limit 10;"
        const expectedValues = ["tomato"]

        expect(db.query).toHaveBeenCalledWith(
            expectedQuery,
            expectedValues,
            expect.any(Function)
        )
    })
})
