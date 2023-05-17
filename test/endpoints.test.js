const request = require("supertest")
const db = require("../src/db")
const express = require("express")
const allocationsRouter = require("../src/routes/allocations")
const apyRouter = require("../src/routes/apy")
const nftInfoRouter = require("../src/routes/nft_info")
const nftVolsRouter = require("../src/routes/nft_vols")
const rewardsInfoRouter = require("../src/routes/rewards_info")
const rewardsSummaryRouter = require("../src/routes/rewards_summary")
const vebalsRouter = require("../src/routes/vebals")

const {
    getVols,
    getveBals,
    getRewards,
    getRewardsSummary,
    getAllocations,
    getApyByAddr,
    getActiveApy,
    getNftInfo
} = require("../src/services")

jest.mock("../src/services/index.js", () => ({
    getVols: jest.fn(),
    getveBals: jest.fn(),
    getRewards: jest.fn(),
    getRewardsSummary: jest.fn(),
    getAllocations: jest.fn(),
    getApyByAddr: jest.fn(),
    getActiveApy: jest.fn(),
    getNftInfo: jest.fn()
}))
jest.mock("../src/db", () => ({
    promise: jest.fn().mockReturnThis(),
    query: jest.fn(),
    escape: jest.fn()
}))

const mockResponse = [{ a: 1, b: 2 }]
getAllocations.mockImplementation((query, values, callback) => {
    callback(null, mockResponse)
})
getRewards.mockImplementation((query, values, callback) => {
    callback(null, mockResponse)
})
db.query.mockImplementation((query, values, callback) => {
    callback(null, mockResponse)
})

const app = express()
app.use(express.json())
app.use("/api", allocationsRouter)
app.use("/api/apy", apyRouter)
app.use("/api", nftInfoRouter)
app.use("/api", nftVolsRouter)
app.use("/api", rewardsInfoRouter)
app.use("/api", rewardsSummaryRouter)
app.use("/api", vebalsRouter)

const requestData = JSON.stringify({ query: { a: 5 } })
describe("Allocations Endpoint", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test("POST /api/allocations should return allocations data", async () => {
        const response = await request(app)
            .post("/api/allocations")
            .send(requestData)

        expect(response.status).toBe(200)
        expect(response.body).toEqual(mockResponse)
    })
})

describe("NFT Info Endpoint", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test("post /api/nftinfo should return NFT info data", async () => {
        const response = await request(app).post("/api/nftinfo")

        expect(response.status).toBe(200)
        expect(response.body).toEqual(mockResponse)
    })
})

describe("NFT Vols Endpoint", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test("post /api/volume should return NFT volumes data", async () => {
        const response = await request(app).post("/api/volume")

        expect(response.status).toBe(200)
        expect(response.body).toEqual(mockResponse)
    })
})

describe("Rewards Info Endpoint", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test("post /api/rewards should return rewards info data", async () => {
        const response = await request(app).post("/api/rewards")

        expect(response.status).toBe(200)
        expect(response.body).toEqual(mockResponse)
    })
})

describe("Rewards Summary Endpoint", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test("post /api/rewardsSummary should return rewards summary data", async () => {
        const response = await request(app).post("/api/rewardsSummary")

        expect(response.status).toBe(200)
        expect(response.body).toEqual(mockResponse)
    })
})

describe("vebals Endpoint", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test("post /api/vebals should return vebals data", async () => {
        const response = await request(app).post("/api/vebals")

        expect(response.status).toBe(200)
        expect(response.body).toEqual(mockResponse)
    })
})

describe("APY Endpoint", () => {
    const { getActiveApy, getApyByAddr } = require("../src/services/apy")
    jest.mock("../src/services/apy", () => ({
        getActiveApy: jest.fn(),
        getApyByAddr: jest.fn()
    }))

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test("get /api/apy/active should return active apy", async () => {
        getActiveApy.mockResolvedValueOnce(0)
        const response = await request(app).get("/api/apy/active")

        expect(response.status).toBe(200)
        expect(response.body).toEqual({ apy: 0 })
    })

    test.skip("get /api/apy/active should return active apy", async () => {
        getApyByAddr.mockImplementation((query, values, callback) => {
            callback(null, 42)
        })

        const response = await request(app).get("/api/apy/addr/test")

        expect(response.status).toBe(200)
        expect(response.body).toEqual({ apy: 0 })
    })
})
