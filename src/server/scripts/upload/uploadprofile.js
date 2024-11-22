const sqlite3 = require("sqlite3");
const path = require("path");
const global = require("../global.js")

async function uploadProfile(lobbyId, profileImage, profileName, profileAge, profileLocation, aboutMeText, interestsList, mamList, friendlyNameInput, theme){
    let validatedBody = await validateBody(profileImage, profileName, profileAge, profileLocation, aboutMeText, interestsList, mamList, friendlyNameInput);

    if (!validatedBody){
        return [400, await global.errorHandler("E", 4)];
    }

    let validateUpload = await uploadToDB(lobbyId, profileImage, profileName, profileAge, profileLocation, aboutMeText, interestsList, mamList, friendlyNameInput, theme);

    if (!validateUpload){
        return [500, await global.errorHandler("E", 5)];
    }

    return [200, true];
}

async function validateBody(profileName, profileAge, profileLocation, aboutMeText, interestsList, mamList, friendlyNameInput) {
    let validated = await new Promise((resolve, reject) => {
        if (profileName.trim() == "" || profileName == "Click me to edit!"){
            resolve(false);
        }
    
        if (profileAge.trim() == "" || profileAge == "Click me to edit!"){
            resolve(false);
        }
    
        if (profileLocation.trim() == "" || profileLocation == "Click me to edit!"){
            resolve(false);
        }
    
        if (aboutMeText == "Click me to edit!" || aboutMeText.trim() == ""){
            resolve(false);
        } else if (aboutMeText < 30) {
            resolve(false);
        }
    
        if (interestsList == "Click me to edit!"){
            resolve(false);
        }

        if (mamList == "Click me to edit!"){
            resolve(false);
        }

    
        if (friendlyNameInput == "" || friendlyNameInput == "Click me to edit!"){
            resolve(false);
        }


        resolve(true);
    });

    return validated;
}

async function uploadToDB(lobbyId, profileImage, profileName, profileAge, profileLocation, aboutMeText, interestsList, mamList, friendlyNameInput, theme) {
    let db = new sqlite3.Database(path.resolve('db.sqlite'));

    let response = await new Promise((resolve, reject) => {
        db.run("INSERT INTO profiles (P_LOBBY, P_IMAGE, P_NAME, P_AGE, P_LOCATION, P_ABOUT, P_INTERESTS, P_MAM, P_CREATOR, P_THEME) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
            [lobbyId, profileImage, profileName, profileAge, profileLocation, aboutMeText, JSON.stringify(interestsList), JSON.stringify(mamList), friendlyNameInput, theme], (err) => {
            if (err){
                console.log(err);
                resolve(false);
            }

            resolve(true)
        });
    });

    return response;
}

module.exports = {uploadProfile}