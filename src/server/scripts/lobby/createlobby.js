const sqlite3 = require("sqlite3");
const path = require("path");
const uuid = require("uuid").v4;

const global = require("../global.js");

async function createLobby(){
    var db = new sqlite3.Database(path.resolve("db.sqlite"));
    let pass = uuid();

    let response = await new Promise((resolve, reject) => {
        db.run("INSERT INTO lobbys (L_PASS) VALUES (?)", [pass], (err) => {
            if (err){
                console.log(err);
                resolve(false);
            }

            resolve(true)
        })
    })

    db.close();

    if (response){
        return [200, pass];
    } else {
        return [500, await global.errorHandler("E", 0)];
    }
}

module.exports = {createLobby}