const { Parser } = require("node-sql-parser");
const parser = new Parser();
const dbStructure = require("../db/structure");

describe("SQL Table Structures", () => {
    Object.entries(dbStructure).forEach(([tableName, sqlQuery]) => {
        test(`validates structure of ${tableName}`, () => {
            let ast;
            try {
                ast = parser.astify(sqlQuery);
            } catch (error) {
                throw new Error(`Error parsing SQL for ${tableName}: ${error.message}`);
            }
            if (sqlQuery.endsWith(";")) {
                // parser returns an array if the query ends with a ;
                ast.forEach((ast) => {
                    expect(ast.type).toBe("create");
                    expect(ast.keyword).toBe("table");
                });
            } else {
                expect(ast.type).toBe("create");
                expect(ast.keyword).toBe("table");
            }
        });
    });
});
