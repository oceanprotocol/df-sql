var poolInfoTable = `CREATE TABLE pool_info(
    chainID        INT  NOT NULL
    ,basetoken      VARCHAR(94) NOT NULL
    ,pool_addr      VARCHAR(94) NOT NULL
   ,vol_amt        FLOAT(25,10) NOT NULL
   ,stake_amt      FLOAT(25,10) NOT NULL
   ,nft_addr       VARCHAR(94) NOT NULL
   ,DT_addr        VARCHAR(94) NOT NULL
   ,DT_symbol      VARCHAR(94) NOT NULL
   ,basetoken_addr VARCHAR(94) NOT NULL
   ,did            VARCHAR(71) NOT NULL
   ,url            VARCHAR(113) NOT NULL,
   PRIMARY KEY(chainID, pool_addr) );`;

var poolVolsTable = `CREATE TABLE pool_vols(
    chainID        INT  NOT NULL
   ,basetoken      VARCHAR(94) NOT NULL
   ,pool_addr      VARCHAR(94) NOT NULL
   ,vol_amt        FLOAT(25,10) NOT NULL,
   PRIMARY KEY(chainID, pool_addr) );`;

var stakesChain = `CREATE TABLE pool_stakes(
    chainID        INT  NOT NULL
   ,basetoken      VARCHAR(94) NOT NULL
   ,LP_addr        VARCHAR(94) NOT NULL
   ,pool_addr      VARCHAR(94) NOT NULL
   ,stake_amt        FLOAT(25,10) NOT NULL,
   PRIMARY KEY(chainID, pool_addr, LP_addr) )`;

module.exports = {
    poolInfoTable,
    poolVolsTable,
    stakesChain
}