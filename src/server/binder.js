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
    limits: { fileSize: 10000000 } // 1MB file size limit
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
const loadlobby = require("./scripts/lobby/loadlobby.js")
const uploadprofile = require("./scripts/upload/uploadprofile.js")
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

    if (!lobbyId){
        res.status(500).send("500, Internal server error!")
    } else {
        res.status(200).json(JSON.stringify(lobbyId));
    }
});

app.use('/viewlobby', async (req, res) => {
    let validated = await global.validateLobbyExists(req.body.lobbyId);

    if (!validated){
        res.status(400).send("400, lobby does not exist");
        return;
    } else if (validated == "err") {
        res.status(500).send("500, Internal server error!");
        return;
    }

    let lobby = await loadlobby.loadLobby(req.body.lobbyId);

    if (!lobby){
        res.sendStatus(500);
        return;
    }

    res.status(200).json(JSON.stringify(lobby));
});

app.use('/validatelobby', async (req, res) => {
    let validated = await global.validateLobbyExists(req.body.lobbyId);

    if (!validated){
        res.status(400).send("400, lobby does not exist")
    } else if (validated == "err") {
        res.status(500).send("500, Internal server error!")
    }

    res.sendStatus(200);
})

app.use('/uploadprofile', async (req, res) => {
    console.log(req.body)

    //First we validate the lobby code

    let validated = await global.validateLobbyExists(req.body.lobbyId);

    if (!validated){
        res.status(400).send("400, lobby does not exist")
    } else if (validated == "err") {
        res.status(500).send("500, Internal server error!")
    }

    //If that validates fine then we can begin validating the rest of the body

    var validatedProfile = await uploadprofile.uploadProfile(req.body.lobbyId, req.body.profileImage, req.body.profileName, req.body.profileAge, req.body.profileLocation, req.body.aboutMeText, req.body.interestsList, req.body.mamList, req.body.friendlyNameInput);

    if (!validatedProfile){
        res.sendStatus(400);
    } else if (validatedProfile == "err"){
        res.sendStatus(500)
    }

    res.sendStatus(200);
});

app.use('/loadprofile', async (req, res) => {
    //First we validate the lobby code

    let validated = await global.validateLobbyExists(req.body.lobbyId);

    if (!validated){
        res.status(400).send("400, lobby does not exist")
    } else if (validated == "err") {
        res.status(500).send("500, Internal server error!")
    }

    let profile = await global.loadProfile(req.body.id, req.body.lobbyId);

    if (!profile){
        res.status(400).send("400, profile does not exist")
    } else {
        res.status(200).json(JSON.stringify(profile));
    }
});