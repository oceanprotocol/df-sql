# SQL API for data farming


![image](https://user-images.githubusercontent.com/25263018/170274359-03eb4ea6-7988-44a4-bcb5-132bc70f98d7.png)

## Endpoints

### POST `/pools`
Queries `pool_info` table.

Queryable fields:
```
chainID,basetoken,pool_addr,vol_amt,stake_amt,nft_addr,DT_addr,DT_symbol,basetoken_addr,did,url
```

Request examples:

---

```json
"query":{
   "vol_amt":{"$gt":3}
}
```
Returns the list of pools where the `vol_amt` is greater than 3.

---

```json
"query":{
  "pool_addr":"0x18b025e44bcd8dafd00638ce87bddbd38c4c38e7"
}
```
Returns the info for pool with the address `0x18b025e44bcd8dafd00638ce87bddbd38c4c38e7`

---
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
Returns the list of pools where `chainID` is 4 and `vol_amt` is greater than 3 or `chainID` is 1 and `vol_amt` is greater than 5.




