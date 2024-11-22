//required packages
const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();
const multer = require("multer");
const fs = require("fs");
const uuid = require("uuid").v4;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/public/media/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, uuid() + path.extname(file.originalname).toLowerCase())
    },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
})
const upload = multer({
    storage: storage,
    limits: { fileSize: 26214400 } // 1MB file size limit
}).single('profileImage'); // 'myFile' is the name attribute of the file input field

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only! (jpeg, jpg, png, gif)');
    }
}

app.use("/", express.static(path.resolve("src/public")));
app.use("/media", express.static(path.resolve("src/public/media")));
app.use("/scripts", express.static(path.resolve("src/public/scripts")));
app.use("/styles", express.static(path.resolve("src/public/styles")));
app.use("/fonts", express.static(path.resolve("src/public/fonts")));

app.use("/landing", express.static(path.resolve("src/public/pages/landing")));
app.use("/lobby", express.static(path.resolve("src/public/pages/lobby")));
app.use("/creator", express.static(path.resolve("src/public/pages/creator")));
app.use("/profile", express.static(path.resolve("src/public/pages/profile")));

const createlobby = require("./scripts/lobby/createlobby.js");
const loadlobby = require("./scripts/lobby/loadlobby.js");
const uploadprofile = require("./scripts/upload/uploadprofile.js");
const updatetheme = require("./scripts/lobby/updatetheme.js");
const global = require("./scripts/global.js");

app.get("/", (req, res) => {
    res.sendFile(path.resolve("src/public/pages/landing/index.html"));
});

app.get("/lobby", (req, res) => {
    res.sendFile(path.resolve("src/public/pages/lobby/index.html"));
});

app.get("/creator", (req, res) => {
    res.sendFile(path.resolve("src/public/pages/creator/index.html"));
});

app.get("/profile", (req, res) => {
    res.sendFile(path.resolve("src/public/pages/profile/index.html"));
});

app.listen(process.env.PORT, () => {
    console.log("listening on", process.env.PORT);
});

app.use('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Please send file' });
        }
        console.log(req.file);
        res.json(JSON.stringify(req.file.filename))
    });
});

app.use('/createlobby', async (req, res) => {
    let lobbyId = await createlobby.createLobby();

    if (lobbyId[0] != 200){
        res.status(lobbyId[0]).json(JSON.stringify(lobbyId))
    } else {
        res.status(lobbyId[0]).json(JSON.stringify(lobbyId));
    }
});

app.use('/viewlobby', async (req, res) => {
    let validated = await global.validateLobbyExists(req.body.lobbyId);

    if (validated[0] == 400){
        res.status(validated[0]).json(JSON.stringify(validated));
        return;
    } else if (validated[0] == 500) {
        res.status(validated[0]).json(JSON.stringify(validated));
        return;
    }

    let lobby = await loadlobby.loadLobby(req.body.lobbyId);

    if (lobby[0] == 500){
        res.status(500).json(JSON.stringify(lobby));
        return;
    }

    res.status(200).json(JSON.stringify(lobby));
});

app.use('/validatelobby', async (req, res) => {
    let validated = await global.validateLobbyExists(req.body.lobbyId);

    if (validated[0] == 400){
        res.status(validated[0]).json(JSON.stringify(validated));
        return;
    } else if (validated[0] == 500) {
        res.status(validated[0]).json(JSON.stringify(validated));
        return;
    }

    res.sendStatus(200);
})

app.use('/uploadprofile', async (req, res) => {
    console.log(req.body.lobbyId)

    //First we validate the lobby code

    let validated = await global.validateLobbyExists(req.body.lobbyId);

    if (validated[0] == 400){
        res.status(validated[0]).json(JSON.stringify(validated));
        return;
    } else if (validated[0] == 500) {
        res.status(validated[0]).json(JSON.stringify(validated));
        return;
    }

    //We need to get the theme

    const theme = await global.getTheme(req.body.lobbyId);

    if (theme[0] == 400){
        res.status(theme[0]).json(JSON.stringify(theme));
        return;
    } else if (theme[0] == 500) {
        res.status(theme[0]).json(JSON.stringify(theme));
        return;
    }

    //If that validates fine then we can begin validating the rest of the body

    var validatedProfile = await uploadprofile.uploadProfile(req.body.lobbyId, req.body.profileImage, req.body.profileName, req.body.profileAge, req.body.profileLocation, req.body.aboutMeText, req.body.interestsList, req.body.mamList, req.body.friendlyNameInput, theme[1].L_THEME);

    if (validatedProfile[0] == 400){
        res.status(validatedProfile[0]).json(JSON.stringify(validatedProfile));
        return;
    } else if (validatedProfile[0] == 500) {
        res.status(validatedProfile[0]).json(JSON.stringify(validatedProfile));
        return;
    }

    res.status(200).json(JSON.stringify([200, "ok"]));
});

app.use('/loadprofile', async (req, res) => {
    //First we validate the lobby code

    let validated = await global.validateLobbyExists(req.body.lobbyId);

    if (validated[0] == 400){
        res.status(validated[0]).json(JSON.stringify(validated));
        return;
    } else if (validated[0] == 500) {
        res.status(validated[0]).json(JSON.stringify(validated));
        return;
    }

    let profile = await global.loadProfile(req.body.id, req.body.lobbyId);

    if (profile[0] == 400){
        res.status(profile[0]).json(JSON.stringify(profile));
        return;
    } else if (profile[0] == 500) {
        res.status(profile[0]).json(JSON.stringify(profile));
        return;
    } else {
        res.status(profile[0]).json(JSON.stringify(profile));
        return;
    }
});

app.use('/updatetheme', async (req, res) => {
    let themes = require('./JSON/themes.json');
    let i = Math.floor(Math.random() * themes.theme.length);

    let theme = themes.theme[i];

    let response = await updatetheme.updateTheme(req.body.lobbyId, theme);

    if (response[0] == 500){
        res.status(profile[0]).json(JSON.stringify(response));
        return;
    } else {
        res.status(response[0]).json(JSON.stringify(response));
        return;
    }
});

app.use('/gettheme', async (req, res) => {
    let validated = await global.validateLobbyExists(req.body.lobbyId);

    if (validated[0] == 400){
        res.status(validated[0]).json(JSON.stringify(validated));
        return;
    } else if (validated[0] == 500) {
        res.status(validated[0]).json(JSON.stringify(validated));
        return;
    }

    let theme = await global.getTheme(req.body.lobbyId);

    if (theme[0] == 500){
        res.status(theme[0]).json(JSON.stringify(response));
        return;
    } else if (theme[0] == 400){
        res.status(theme[0]).json(JSON.stringify(response));
        return;
    } else {
        res.status(theme[0]).json(JSON.stringify(theme));
        return;
    }
});
