const sqlite3 = require("sqlite3");
const path = require("path");
const global = require("../global.js")

async function loadLobby(lobbyId){
    let db = new sqlite3.Database(path.resolve('db.sqlite'));

    let response = await new Promise((resolve, reject) => {
        db.all("SELECT * FROM profiles WHERE P_LOBBY = ?", [lobbyId], (err, rows) => {
            if (err){
                console.log(err);
                resolve(false);
            }

            resolve(rows);
        });
    });

    if (!response){
        return [500, await global.errorHandler("E", 3)]
    } else {
        return [200, response]
    }
}

module.exports = {loadLobby}