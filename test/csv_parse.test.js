const { createObject, parseCsv } = require("../src/comps/csv/parse.js")
const fs = require("fs")

jest.mock("fs")

describe("Testing CSV Parser", () => {
    test("test createObject function", () => {
        const keys = ["name", "age", "gender"]
        const values = ["John", "25", "Male"]
        const expected = {
            name: "John",
            age: "25",
            gender: "Male"
        }

        const obj = createObject(keys, values)
        expect(obj).toEqual(expected)
    })

    test("test parseCsv function", () => {
        const mockCsvData = "name,age,gender\nJohn,25,Male\nJane,30,Female"
        fs.readFileSync.mockReturnValue(mockCsvData)

        const expected = [
            {
                name: "John",
                age: "25",
                gender: "Male"
            },
            {
                name: "Jane",
                age: "30",
                gender: "Female"
            }
        ]

        const result = parseCsv("some_path")
        expect(result).toEqual(expected)
    })

    test("test parseCsv function with missing data", () => {
        const mockCsvData =
            "name,age,gender\nJohn,25,Male\nJane,30,Female\n,35,Male"
        fs.readFileSync.mockReturnValue(mockCsvData)

        const expected = [
            {
                name: "John",
                age: "25",
                gender: "Male"
            },
            {
                name: "Jane",
                age: "30",
                gender: "Female"
            }
        ]

        const result = parseCsv("some_path")
        expect(result).toEqual(expected)
    })

    test("test parseCsv function with missing data and missing comma", () => {
        const mockCsvData =
            "name,age,gender\nJohn,25,Male\nJane,30,Female\n35,Male"
        fs.readFileSync.mockReturnValue(mockCsvData)

        const expected = [
            {
                name: "John",
                age: "25",
                gender: "Male"
            },
            {
                name: "Jane",
                age: "30",
                gender: "Female"
            }
        ]

        const result = parseCsv("some_path")
        expect(result).toEqual(expected)
    })
})
