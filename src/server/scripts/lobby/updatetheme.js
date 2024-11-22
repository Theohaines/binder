const sqlite3 = require("sqlite3");
const path = require("path");
const global = require("../global.js")

async function updateTheme(lobbyId, theme){
    let db = new sqlite3.Database(path.resolve('db.sqlite'));

    let response = await new Promise((resolve, reject) => {
        db.run("UPDATE lobbys SET L_THEME = ? WHERE L_PASS = ?", [theme, lobbyId], (err, rows) => {
            if (err){
                console.log(err);
                resolve(false);
            }

            resolve(true);
        });
    });

    if (!response){
        return [500, await global.errorHandler("E", 8)];
    } else {
        return [200, theme]
    }
}

module.exports = {updateTheme}
