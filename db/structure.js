// NOTE: When adding or modifying structures
// make sure to update test/validate_db.test.js

const allocationsTable = `CREATE TABLE allocations(
    chainID        INT  NOT NULL
    ,nft_addr      VARCHAR(94) NOT NULL
    ,LP_addr      VARCHAR(94) NOT NULL
    ,percent        FLOAT(94,10) NOT NULL
    ,ve_amt        FLOAT(94,10)
    ,ocean_amt        FLOAT(94,10)
    ,round         INT NOT NULL
   ,PRIMARY KEY(chainID, nft_addr, LP_addr, round) );`

const nftVolsTable = `CREATE TABLE nft_vols(
    chainID        INT  NOT NULL
   ,basetoken_addr      VARCHAR(94) NOT NULL
   ,nft_addr      VARCHAR(94) NOT NULL
   ,vol_amt        FLOAT(94,10) NOT NULL
   ,round         INT NOT NULL
   ,PRIMARY KEY(chainID, nft_addr, basetoken_addr, round) );`

const nftinfoTable = `CREATE TABLE nft_info(
    chainID        INT  NOT NULL
    ,nft_addr      VARCHAR(94) NOT NULL
    ,did      VARCHAR(300) NOT NULL
    ,symbol      VARCHAR(300) NOT NULL
    ,name      VARCHAR(750) NOT NULL
   ,ve_allocated  FLOAT(94,10)
   ,ocean_allocated  FLOAT(94,10)
   ,ve_allocated_owner  FLOAT(94,10)
   ,ocean_allocated_owner  FLOAT(94,10)
   ,ve_allocated_realtime  FLOAT(94,10)
   ,ocean_allocated_realtime  FLOAT(94,10)
   ,ve_allocated_realtime_owner  FLOAT(94,10)
   ,ocean_allocated_realtime_owner  FLOAT(94,10)
   ,volume  FLOAT(94,10)
   ,is_purgatory  BOOLEAN
   ,roundYield  FLOAT(94,10)
   ,apy  FLOAT(94,10)
   ,apr  FLOAT(94,10)
   ,owner_addr      VARCHAR(94)
   ,round         INT NOT NULL
   ,PRIMARY KEY(chainID, nft_addr, round) );`

const vebalsTable = `CREATE TABLE vebals(
   LP_addr        VARCHAR(94) NOT NULL
   ,balance      FLOAT(94,10) NOT NULL
   ,locked_amt   FLOAT(94,10) NOT NULL
   ,unlock_time  INT NOT NULL
   ,round         INT NOT NULL
   ,PRIMARY KEY(LP_addr, round) )`

const rewardsInfo = `CREATE TABLE rewards_info(
  chainID INT NOT NULL,
  LP_addr VARCHAR(94) NOT NULL,
  nft_addr VARCHAR(94) NOT NULL,
  amt FLOAT(94, 10) NOT NULL,
  token VARCHAR(94) NOT NULL,
  round         INT NOT NULL,
  PRIMARY KEY(chainID, nft_addr, LP_addr, token, round))`

const passiveRewardsInfo = `CREATE TABLE passive_rewards_info(
    LP_addr VARCHAR(94) NOT NULL,
    balance      FLOAT(94,10) NOT NULL,
    reward   FLOAT(94,10) NOT NULL,
    round         INT NOT NULL,
    PRIMARY KEY(LP_addr, round))`

const rewardsSummary = `CREATE TABLE rewards_summary(
  LP_addr VARCHAR(94) NOT NULL,
  passive_amt    FLOAT(94, 10) NOT NULL,
  curating_amt   FLOAT(94, 10) NOT NULL,
  predictoor_amt FLOAT(94, 10) NOT NULL,
  challenge_amt  FLOAT(94, 10) NOT NULL,
  round          INT NOT NULL,
  PRIMARY KEY(LP_addr, round))`

const ownersInfo = `CREATE TABLE owners_info(
    chainID INT NOT NULL,
    nft_addr VARCHAR(94) NOT NULL,
    owner_addr VARCHAR(94) NOT NULL,
    PRIMARY KEY(chainID, nft_addr)
)`

const predictoorData = `CREATE TABLE predictoor_data(
    predictoor_addr             VARCHAR(42) NOT NULL,
    contract_addr               VARCHAR(42) NOT NULL,
    slot                        INT NOT NULL,
    payout                      FLOAT(94, 10) NOT NULL,
    stake                       FLOAT(94, 10) DEFAULT 0,
    round                       INT NOT NULL,
    PRIMARY KEY(predictoor_addr, contract_addr, slot, round)
)`

const predictoorSummary = `CREATE TABLE predictoor_summary(
    predictoor_addr             VARCHAR(42) NOT NULL,
    contract_addr               VARCHAR(42) NOT NULL,
    prediction_count            INT NOT NULL,
    correct_prediction_count    INT NOT NULL,
    accuracy                    FLOAT(94, 10) NOT NULL,
    round                       INT NOT NULL,
    PRIMARY KEY(predictoor_addr, contract_addr, round)
)`

const predictoorRewards = `CREATE TABLE predictoor_rewards(
    predictoor_addr VARCHAR(42) NOT NULL,
    OCEAN_amt                   FLOAT(94, 10) NOT NULL,
    round                       INT NOT NULL,
    PRIMARY KEY(predictoor_addr, round)
)`

const challengeData = `CREATE TABLE challenge_data(
    from_addr                   VARCHAR(42) NOT NULL,
    nft_addr                    VARCHAR(42) NOT NULL,
    nmse                        FLOAT(94, 10) NOT NULL,
    round                       INT NOT NULL,
    PRIMARY KEY(from_addr, nft_addr, round)
)`

const challengeRewards = `CREATE TABLE challenge_rewards(
    winner_addr                 VARCHAR(42) NOT NULL,
    OCEAN_amt                   FLOAT(94, 10) NOT NULL,
    round                       INT NOT NULL,
    PRIMARY KEY(winner_addr, round)
)`

module.exports = {
  allocationsTable,
  nftVolsTable,
  vebalsTable,
  rewardsInfo,
  passiveRewardsInfo,
  nftinfoTable,
  rewardsSummary,
  ownersInfo,
  predictoorData,
  predictoorRewards,
  predictoorSummary,
  challengeData,
  challengeRewards
}
