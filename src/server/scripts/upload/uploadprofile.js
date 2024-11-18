const sqlite3 = require("sqlite3");
const path = require("path");

async function uploadProfile(lobbyId, profileImage, profileName, profileAge, profileLocation, aboutMeText, interestsList, mamList, friendlyNameInput){
/*     let validatedBody = await validateBody(profileImage, profileName, profileAge, profileLocation, aboutMeText, interestsList, mamList, friendlyNameInput);

    if (!validatedBody){
        return false;
    }
 */
    let validateUpload = await uploadToDB(lobbyId, profileImage, profileName, profileAge, profileLocation, aboutMeText, interestsList, mamList, friendlyNameInput);

    if (!validateUpload){
        return "err";
    }

    return true;
}

async function validateBody(profileName, profileAge, profileLocation, aboutMeText, interestsList, mamList, friendlyNameInput) {
    if (profileName.trim() == "" || profileName == "Click me to edit!"){
        return false;
    }

    if (profileAge.trim() == "" || profileAge == "Click me to edit!"){
        return false
    }

    if (profileLocation.trim() == "" || profileLocation == "Click me to edit!"){
        return false;
    }

    if (aboutMeText == "Click me to edit!" || aboutMeText.trim() == ""){
        return false;
    } else if (aboutMeText.trim().length < 30) {
        return false;
    }

    if (interestsList == "Click me to edit!"){
        return false;
    }

    if (mamList == "Click me to edit!"){
        return false;
    }

    if (friendlyNameInput.trim() == "" || friendlyNameInput == "Click me to edit!"){
        return false;
    }

    return true;
}

async function uploadToDB(lobbyId, profileImage, profileName, profileAge, profileLocation, aboutMeText, interestsList, mamList, friendlyNameInput) {
    let db = new sqlite3.Database(path.resolve('db.sqlite'));

    let response = await new Promise((resolve, reject) => {
        db.run("INSERT INTO profiles (P_LOBBY, P_IMAGE, P_NAME, P_AGE, P_LOCATION, P_ABOUT, P_INTERESTS, P_MAM, P_CREATOR) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
            [lobbyId, profileImage, profileName, profileAge, profileLocation, aboutMeText, JSON.stringify(interestsList), JSON.stringify(mamList), friendlyNameInput], (err) => {
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