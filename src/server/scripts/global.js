//Toolbox for all reuseable things
const sqlite3 = require("sqlite3");
const path = require("path");

async function validateLobbyExists(lobbyId){
    let db = new sqlite3.Database(path.resolve('db.sqlite'));

    let response = await new Promise((resolve, reject) => {
        db.all("SELECT * FROM lobbys WHERE L_PASS = ?", [lobbyId], (err, rows) => {
            if (err){
                console.log(err);
                resolve("err"); //500
            }

            if (rows[0] == null || rows[0].L_PASS != lobbyId){
                resolve(false) //400
            } else {
                resolve(true); //200
            }
        });
    });

    db.close();

    if (response == "err"){
        return [500, await errorHandler("E", 1)];
    } else if (response == false){
        return [400, await errorHandler("E", 2)]
    } else {
        return [200, response]
    }
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

    if (response == "err"){
        return [500, await errorHandler("E", 6)];
    } else if (response == false){
        return [400, await errorHandler("E", 7)]
    } else {
        return [200, response]
    }
}

async function errorHandler(type, i){
    //Types E = error, W = warning, I = info

    var message = await new Promise((resolve, reject) => {
        let messageList = require("../../../err.json");

        if (type == "E"){
            msg = messageList.E[i]
            resolve(msg);
        } else if (type == "W"){
            msg = messageList.W[i]
            resolve(msg);
        } else if (type == "I") {
            msg = messageList.I[i]
            resolve(msg);
        } else { //We done fucked up real bad, send error from error handler smh
            resolve("500! Internal server error (Something went wrong with the errorHandler function in global.js).");
        }
    });

    console.log(message)

    return message;
}

module.exports = {validateLobbyExists, loadProfile, errorHandler}