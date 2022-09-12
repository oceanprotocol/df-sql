# SQL API for data farming


![image](https://user-images.githubusercontent.com/25263018/170274359-03eb4ea6-7988-44a4-bcb5-132bc70f98d7.png)

## Endpoints

<!-- ### POST `/pools`
Queries `pool_info` table.  
Queryable fields:
```
chainID,basetoken,pool_addr,vol_amt,stake_amt,nft_addr,DT_addr,DT_symbol,basetoken_addr,did,url
``` -->

### POST `/allocations`
Queries `allocations` table.
Queryable fields:
```
chainID,nft_addr,LP_addr,percent
```

### POST `/volume`
Queries `nft_vols` table.
Queryable fields:
```
chainID,basetoken_addr,nft_addr,vol_amt
```

### POST `/nftinfo`
Queries `nft_info` table.
Queryable fields:
```
chainID,nft_addr,did,symbol,basetoken_addr,volume
```

### POST `/vebals`
Queries `vebals` table.  
Queryable fields:
```
LP_addr,balance
```

### POST `/rewards`
Queries `rewards_info` table.  
Queryable fields:
```
chainID,LP_addr,nft_addr,amt,token
```

## Request examples

`POST /nft_vols`
```json
"query":{
   "vol_amt":{"$gt":3}
}
```
Returns the list of DataNFTs where the `vol_amt` is greater than 3.

---

`POST /nft_vols`
```json
"query":{
  "nft_addr":"0x18b025e44bcd8dafd00638ce87bddbd38c4c38e7"
}
```
Returns the info for DataNFT with the address `0x18b025e44bcd8dafd00638ce87bddbd38c4c38e7`

---

`POST /volume`
```json
"query":{
  "$or": [
    {
      "$and": {
        "chainID": 4,
        "vol_amt": {
          "$gt": 3
        }
      }
    },
    {
      "$and": {
        "chainID": 1,
        "vol_amt": {
          "$gt": 5
        }
      }
    }
  ]
}
```
Returns the list of DataNFTs where `chainID` is 4 and `vol_amt` is greater than 3 or `chainID` is 1 and `vol_amt` is greater than 5.

---

`POST /nft_vols`
```json
"query":{
  "vol_amt":{"$gt":3}
},
"sort":{
  "vol_amt":-1
},
"limit":10
```
Returns the list of **10** DataNFTs where the `vol_amt` is greater than 3. Sorted by `vol_amt` descending.

---

`POST /nft_vols`
```json
"query":{
  "vol_amt":{"$gt":3}
},
"sort":{
  "vol_amt":-1
},
"limit":10,
"offset":10
```

Same as above + skips the first 10 DataNFTs.

---

`POST /rewards_info`
```json
{
  "fields": [
    {
      "expression": {
        "pattern": "sum(amt)"
      }
    },
    "nft_addr"
  ],
  "group": "nft_addr"
}
```

Returns the reward amount per pool.

---

`POST /nft_info`
```json
{
  "join": [
    {
      "alias": "t0",
      "type": "left",
      "on": {
        "nft_info.nft_addr": "t0.nft_addr"
      },
      "select": {
        "table": "rewards_info",
        "fields": [
          {
            "expression": {
              "pattern": "sum(amt)"
            }
          },
          "nft_addr"
        ],
        "group": "nft_addr"
      }
    }
  ]
}
```

Returns the DataNFT list with the total reward amount for each DataNFT.