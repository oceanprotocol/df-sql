CREATE DATABASE asdxc

CREATE TABLE pool_info(
    chainID        INT  NOT NULL
    ,basetoken      VARCHAR(94) NOT NULL
    ,pool_addr      VARCHAR(94) NOT NULL PRIMARY KEY
   ,vol_amt        FLOAT(25,10) NOT NULL
   ,stake_amt      FLOAT(25,10) NOT NULL
   ,nft_addr       VARCHAR(94) NOT NULL
   ,DT_addr        VARCHAR(94) NOT NULL
   ,DT_symbol      VARCHAR(94) NOT NULL
   ,basetoken_addr VARCHAR(94) NOT NULL
   ,did            VARCHAR(71) NOT NULL
   ,url            VARCHAR(113) NOT NULL);

CREATE TABLE pool_vols(
    recordId int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    chainID        INT  NOT NULL
   ,basetoken      VARCHAR(94) NOT NULL
   ,pool_addr      VARCHAR(94) NOT NULL
   ,vol_amt        FLOAT(25,10) NOT NULL);

CREATE TABLE pool_stakes(
    recordId int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    chainID        INT  NOT NULL
   ,basetoken      VARCHAR(94) NOT NULL
   ,LP_addr        VARCHAR(94) NOT NULL
   ,pool_addr      VARCHAR(94) NOT NULL
   ,stake_amt        FLOAT(25,10) NOT NULL)