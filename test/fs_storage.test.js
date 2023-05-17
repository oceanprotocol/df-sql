const { saveStorage, readStorage } = require("../src/comps/fs/storage")
const fs = require("fs")
const path = "/tmp/storage_dfsql.json"

jest.mock("fs")

describe("Testing Storage Module", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test("test saveStorage function", () => {
        fs.existsSync.mockReturnValue(true)
        fs.readFileSync.mockReturnValue(
            JSON.stringify({ existingKey: "existingValue" })
        )

        const key = "testKey"
        const value = "testValue"
        const expected = JSON.stringify({
            existingKey: "existingValue",
            testKey: "testValue"
        })

        saveStorage(key, value)

        expect(fs.writeFileSync).toHaveBeenCalledWith(path, expected)
    })

    test("test readStorage function", () => {
        const mockData = { testKey: "testValue" }
        fs.existsSync.mockReturnValue(true)
        fs.readFileSync.mockReturnValue(JSON.stringify(mockData))

        const result = readStorage("testKey")

        expect(result).toBe("testValue")
    })

    test("test readStorage function with missing key", () => {
        const mockData = { testKey: "testValue" }
        fs.existsSync.mockReturnValue(true)
        fs.readFileSync.mockReturnValue(JSON.stringify(mockData))

        const result = readStorage("missingKey")

        expect(result).toBe(undefined)
    })

    test("test readStorage function with no storage file", () => {
        fs.existsSync.mockReturnValue(false)

        const result = readStorage("testKey")

        expect(result).toBe(null)
    })
})
