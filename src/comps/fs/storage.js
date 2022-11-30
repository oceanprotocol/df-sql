const fs = require("fs")
let storage_file = "/tmp/storage_dfsql.json"

function saveStorage(key, value) {
    let storage = {}
    if (fs.existsSync(storage_file)) {
        storage = loadStorage()
    }
    storage[key] = value
    fs.writeFileSync(storage_file, JSON.stringify(storage))
}

function loadStorage() {
    let data = fs.readFileSync(storage_file, "utf-8")
    return JSON.parse(data)
}

function readStorage(key) {
    if (!fs.existsSync(storage_file)) return null
    let storage = loadStorage()
    return storage[key]
}

module.exports = { saveStorage, readStorage }
