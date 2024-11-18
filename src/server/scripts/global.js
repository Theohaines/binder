//Toolbox for all reuseable things
const sqlite3 = require("sqlite3");
const path = require("path");

async function validateLobbyExists(lobbyId){
    let db = new sqlite3.Database(path.resolve('db.sqlite'));

    let response = await new Promise((resolve, reject) => {
        db.all("SELECT * FROM lobbys WHERE L_PASS = ?", [lobbyId], (err, rows) => {
            if (err){
                console.log(err);
                resolve("err");
            }

            if (rows[0] == null || rows[0].L_PASS != lobbyId){
                resolve(false)
            } else {
                resolve(true);
            }
        });
    });

    return response;
}

module.exports = {validateLobbyExists}