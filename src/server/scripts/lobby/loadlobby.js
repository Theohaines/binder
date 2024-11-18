const sqlite3 = require("sqlite3");
const path = require("path");

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

    return response;
}

module.exports = {loadLobby}