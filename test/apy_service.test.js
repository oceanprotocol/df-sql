const { getApyByAddr, getActiveApy } = require("../src/services/apy")
const { getAllocations } = require("../src/services/allocations")
const { getRewards } = require("../src/services/rewards_info")
const { readStorage } = require("../src/comps/fs/storage")

jest.mock("../src/services/allocations", () => ({
    getAllocations: jest.fn()
}))

jest.mock("../src/services/rewards_info", () => ({
    getRewards: jest.fn()
}))

jest.mock("../src/comps/fs/storage", () => ({
    readStorage: jest.fn()
}))
describe("getApyByAddr", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test("should calculate APY correctly for a given address", async () => {
        const mockAllocations = [
            { ocean_amt: "1000" },
            { ocean_amt: "2000" },
            { ocean_amt: "3000" }
        ]
        // rewards are weekly
        const mockRewards = [{ amt: "1" }, { amt: "2" }, { amt: "5" }]

        getAllocations.mockResolvedValue(mockAllocations)
        getRewards.mockResolvedValue(mockRewards)

        const addr = "0x123"
        const expectedApy = 0.0717

        const apy = await getApyByAddr(addr)

        expect(getAllocations).toHaveBeenCalledWith({
            query: { LP_addr: addr }
        })
        expect(getRewards).toHaveBeenCalledWith({ query: { LP_addr: addr } })
        expect(apy).toBeCloseTo(expectedApy)
    })

    test("should return 0 if allocations or rewards are empty", async () => {
        const mockAllocations = []
        const mockRewards = []

        getAllocations.mockResolvedValue(mockAllocations)
        getRewards.mockResolvedValue(mockRewards)

        const addr = "0x123"
        const expectedApy = 0

        const apy = await getApyByAddr(addr)

        expect(getAllocations).toHaveBeenCalledWith({
            query: { LP_addr: addr }
        })
        expect(apy).toBe(expectedApy)
    })

    test("should return active apy from storage", async () => {
        readStorage.mockImplementation(() => 15)
        const activeApy = getActiveApy()

        expect(activeApy).toBe(15)
    })
})
