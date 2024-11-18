//required packages
const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", express.static(path.resolve("src/public")));
app.use("/media", express.static(path.resolve("src/public/media")));
app.use("/scripts", express.static(path.resolve("src/public/scripts")));
app.use("/styles", express.static(path.resolve("src/public/styles")));
app.use("/fonts", express.static(path.resolve("src/public/fonts")));

app.use("/landing", express.static(path.resolve("src/public/pages/landing")));
app.use("/lobby", express.static(path.resolve("src/public/pages/lobby")));
app.use("/creator", express.static(path.resolve("src/public/pages/creator")));
app.use("/profile", express.static(path.resolve("src/public/pages/profile")));

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