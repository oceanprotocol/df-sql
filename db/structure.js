var allocationsTable = `CREATE TABLE allocations(
    chainID        INT  NOT NULL
    ,nft_addr      VARCHAR(94) NOT NULL
    ,LP_addr      VARCHAR(94) NOT NULL
    ,percent        FLOAT(94,10) NOT NULL,
   PRIMARY KEY(chainID, nft_addr, LP_addr) );`;

var nftVolsTable = `CREATE TABLE nft_vols(
    chainID        INT  NOT NULL
   ,basetoken      VARCHAR(94) NOT NULL
   ,nft_addr      VARCHAR(94) NOT NULL
   ,vol_amt        FLOAT(94,10) NOT NULL,
   PRIMARY KEY(chainID, nft_addr) );`;

var nftinfoTable = `CREATE TABLE nft_info(
    chainID        INT  NOT NULL
    ,nft_addr      VARCHAR(94) NOT NULL
    ,did      VARCHAR(200) NOT NULL
    ,symbol      VARCHAR(50) NOT NULL
   ,basetoken_addr      VARCHAR(94) NOT NULL
   ,volume        FLOAT(94,10) NOT NULL,
   ,PRIMARY KEY(chainID, nft_addr) );`;

var vebalsTable = `CREATE TABLE vebals(
   LP_addr        VARCHAR(94) NOT NULL
   ,balance      FLOAT(94,10) NOT NULL
   ,PRIMARY KEY(LP_addr) )`;

var rewardsInfo = `CREATE TABLE rewards_info(
  chainID INT NOT NULL,
  LP_addr VARCHAR(94) NOT NULL,
  nft_addr VARCHAR(94) NOT NULL,
  amt FLOAT(94, 10) NOT NULL,
  token VARCHAR(94) NOT NULL,
  PRIMARY KEY(chainID, nft_addr, LP_addr, token))`;

module.exports = {
  allocationsTable,
  nftVolsTable,
  vebalsTable,
  rewardsInfo,
  veinfoTable: nftinfoTable,
};
