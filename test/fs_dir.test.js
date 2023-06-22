const { readDataDir } = require("../src/comps/fs/dir")
const fs = require("fs")
const crypto = require("crypto")
const { parseCsv } = require("../src/comps/csv/parse")

jest.mock("fs")
jest.mock("crypto")
jest.mock("../src/comps/csv/parse")

describe("Testing readDataDir function", () => {
    test("readDataDir correctly reads and parses files from directory and calculates hashsum", () => {
        // Mock readdirSync to return a set of predefined file names
        fs.readdirSync.mockReturnValue([
            "allocations.csv",
            "allocations_realtime.csv",
            "nftvols.csv",
            "vebals.csv",
            "vebals_realtime.csv",
            "rewardsinfo.csv",
            "passive.csv",
            "nftinfo.csv",
            "rate-sample.csv",
            "symbols-sample.csv",
            "predictoor_rewards.csv",
            "predictoor_data.csv",
            "challenge_rewards.csv",
            "challenge_data.csv"
        ])

        // Mock readFileSync to return a predefined string
        fs.readFileSync.mockReturnValue("fileContent")

        // Mock createHash and digest methods from 'crypto' module
        const mockHash = {
            update: jest.fn().mockReturnThis(),
            digest: jest.fn().mockReturnValue("123456")
        }
        crypto.createHash.mockReturnValue(mockHash)

        // Mock parseCsv to return a predefined array
        parseCsv.mockReturnValue([
            {
                chainID: "1",
                nft_addr: "addr1",
                LP_addr: "addr2",
                round: "1"
            }
        ])

        const dataDir = "mockDataDir"
        const result = readDataDir(dataDir)

        expect(fs.readdirSync).toHaveBeenCalledWith(dataDir)
        expect(fs.readFileSync).toHaveBeenCalledTimes(10)
        expect(parseCsv).toHaveBeenCalledTimes(10)
        expect(crypto.createHash).toHaveBeenCalledTimes(10)
        expect(mockHash.update).toHaveBeenCalledTimes(10)
        expect(mockHash.digest).toHaveBeenCalledTimes(10)

        expect(result).toEqual({
            allocations: parseCsv(),
            allocations_realtime: parseCsv(),
            nftvols: parseCsv(),
            vebals: parseCsv(),
            vebals_realtime: parseCsv(),
            rewardsInfo: parseCsv(),
            passiveRewardsInfo: parseCsv(),
            nftinfo: parseCsv(),
            rates: parseCsv(),
            symbols: parseCsv(),
            predictoor_rewards: parseCsv(),
            predictoor_data: parseCsv(),
            challenge_rewards: parseCsv(),
            challenge_data: parseCsv(),
            hashsum:
                "123456123456123456123456123456123456123456123456123456123456"
        })
    })
})
