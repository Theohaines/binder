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

    db.close();

    return response;
}

async function loadProfile(id, lobbyId) {
    let db = new sqlite3.Database(path.resolve('db.sqlite'));

    let response = await new Promise((resolve, reject) => {
        db.all("SELECT P_IMAGE, P_NAME, P_AGE, P_LOCATION, P_ABOUT, P_INTERESTS, P_MAM, P_CREATOR FROM profiles WHERE P_ID = ? AND P_LOBBY = ?", [id, lobbyId], (err, rows) => {
            if (err){
                console.log(err);
                resolve("err");
            }

            if (!rows[0]){
                resolve(false)
            } else {
                resolve(rows[0])
            }

        });
    });

    db.close();

    return response;
}

module.exports = {validateLobbyExists, loadProfile}