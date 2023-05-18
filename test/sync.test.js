const { sync } = require("../src/comps/update/sync")
const { readDataDir } = require("../src/comps/fs/dir")
const { calcApyPerAsset, calcGeneralApy } = require("../src/comps/apy/calc")
const {
    calculateAllocations,
    calculateVolumes,
    parsePurgatory
} = require("../src/comps/calc/data")
const { saveStorage } = require("../src/comps/fs/storage")
const { batchUpdateRound } = require("../src/comps/update/batch")
const db = require("../src/db")

jest.mock("../src/comps/fs/dir")
jest.mock("../src/comps/apy/calc")
jest.mock("../src/comps/calc/data")
jest.mock("../src/comps/fs/storage")
jest.mock("../src/comps/update/batch")
jest.mock("../src/db", () => ({
    promise: jest.fn().mockReturnThis(),
    query: jest.fn(),
    escape: jest.fn()
}))
db.query.mockImplementation((query, values, callback) => {
    callback(null, mockResponse)
})

console.log = jest.fn()
describe("sync", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        readDataDir.mockReturnValue({
            allocations: [],
            allocations_realtime: [],
            nftvols: [],
            vebals: [],
            vebals_realtime: [],
            rewardsInfo: [],
            passiveRewardsInfo: [],
            nftinfo: [],
            rates: [],
            symbols: [],
            hashsum: "dummyHash"
        })
        calculateAllocations.mockImplementation(() => [])
    })

    it("should skip sync if roundNumber is undefined", async () => {
        await sync("dummyDataDir")
        expect(console.log).not.toHaveBeenCalled()
        expect(readDataDir).not.toHaveBeenCalled()
        expect(parsePurgatory).not.toHaveBeenCalled()
        expect(calculateAllocations).not.toHaveBeenCalled()
        expect(calculateVolumes).not.toHaveBeenCalled()
        expect(calcApyPerAsset).not.toHaveBeenCalled()
        expect(calcGeneralApy).not.toHaveBeenCalled()
        expect(saveStorage).not.toHaveBeenCalled()
        expect(batchUpdateRound).not.toHaveBeenCalled()
    })

    it("should skip sync if no changes detected", async () => {
        const roundNumber = 1
        await sync("dummyDataDir", roundNumber)
        expect(console.log).toHaveBeenCalledWith("Starting sync", roundNumber)
        await sync("dummyDataDir", roundNumber)
        expect(console.log).toHaveBeenCalledWith(
            "No changes detected, skipping round",
            roundNumber
        )
    })
})
