async function createLobby(){
    fetch('/createlobby', {  
        method: 'post',
        headers: {'Content-Type': 'application/json'}
    }).then(response => {
        return response.json();
    }) .then(data => {
        res = JSON.parse(data);
        if (res[0] != 200){
            alert(res[0] + ", " + res[1]);
            return;
        }

        lobbyId = res[1].split('"').join("");
        prettyLayoutLobby();
    }).catch(error => {
        console.error('Fetch error:', error);
    });
}

function prettyLayoutLobby(){
    const joinGame = document.getElementById("joinGame");
    joinGame.style.display = "none";

    const hostGame = document.getElementById("hostGame");
    hostGame.style.width = "100%"

    const gameView = document.getElementById("gameView")
    gameView.style.display = "flex";

    localStorage.setItem("lobbyId", lobbyId);
    
    const createLobbyCodeInput = document.getElementById("createLobbyCodeInput");
    createLobbyCodeInput.value = localStorage.getItem("lobbyId");
}

function joinGame(){
    viewLobby();

    const hostGame = document.getElementById("hostGame");
    hostGame.style.display = "none";

    const joinGame = document.getElementById("joinGame");
    joinGame.style.width = "100%";
}

async function viewLobby() {
    let joinGameInput = document.getElementById("joinGameInput");
    localStorage.setItem("lobbyId", joinGameInput.value);

    fetch('/viewlobby', {  
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"lobbyId" : joinGameInput.value})
    }).then(response => {
        return response.json();
    }) .then(data => {
        res = JSON.parse(data);
        if (res[0] != 200){
            alert(res[0] + ", " + res[1]);
            return;
        }

        prettyListLobby(data);
    }).catch(error => {
        console.error('Fetch error:', error);
    });
}

function prettyListLobby(lobby) {
    const lobbyList = document.getElementById("lobbyList");

    lobbyList.innerHTML = ""

    lobby = JSON.parse(lobby)

    lobby = lobby[1]

    for (var profile of lobby){
        var profileEntry = document.createElement("div");
        profileEntry.className = "lobby-entry";
        lobbyList.appendChild(profileEntry);

        var profileEntryName = document.createElement("H4");
        profileEntryName.textContent = profile.P_NAME;
        profileEntry.appendChild(profileEntryName);
        
        var profileEntryCreator = document.createElement("H4");
        profileEntryCreator.textContent = "| Created by: " + profile.P_CREATOR;
        profileEntry.appendChild(profileEntryCreator);

        var profileEntryButton = document.createElement("button");
        profileEntryButton.textContent = "Click to view!";
        profileEntryButton.className = "freeform-button"
        profileEntryButton.setAttribute("onClick", "redirectProfileViaID("+profile.P_ID+")")
        profileEntry.appendChild(profileEntryButton);
    }

    const gameView = document.getElementById("gameView")
    gameView.style.display = "flex";
}

async function createProfileAdv() {
    fetch('/viewlobby', {  
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"lobbyId" : localStorage.getItem("lobbyId")})
    }).then(response => {
        return response.json()
    }) .then(data => {
        res = JSON.parse(data);
        if (res[0] != 200){
            alert(res[0] + ", " + res[1]);
            return;
        }

        window.redirect("/creator");
    }).catch(error => {
        console.error('Fetch error:', error);
    });
}

function redirectProfileViaID(id){
    window.location.href = "/profile?id=" + id + "&lobbyId=" + localStorage.getItem("lobbyId");
}

function leaveGame(){
    localStorage.setItem("lobbyId", "null");
    window.location.href = "/";
}

function updateTheme(){
    const lobbyId = localStorage.getItem("lobbyId");

    fetch('/updatetheme', {  
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({lobbyId})
    }).then(response => {
        return response.json();
    }) .then(data => {
        res = JSON.parse(data);
        if (res[0] != 200){
            alert(res[0] + ", " + res[1]);
            return;
        }

        document.getElementById("currentThemeText").textContent = "Current theme: " + res[1];
    }).catch(error => {
        console.error('Fetch error:', error);
    });
}

function getTheme(){
    const lobbyId = localStorage.getItem("lobbyId");

    fetch('/gettheme', {  
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({lobbyId})
    }).then(response => {
        return response.json();
    }) .then(data => {
        res = JSON.parse(data);
        if (res[0] != 200){
            alert(res[0] + ", " + res[1]);
            return;
        }

        document.getElementById("currentThemeText").textContent = "Current theme: " + res[1].L_THEME;
    }).catch(error => {
        console.error('Fetch error:', error);
    });
}

// LANDING ONLY

function init(){
    if (checkLanding()){
        if (localStorage.getItem("lobbyId") == "null"){
            return;
        } else {
            document.getElementById("joinGameInput").value = localStorage.getItem("lobbyId");

            const joinGame = document.getElementById("joinGame");
            joinGame.style.width = "100%";
        
            const hostGame = document.getElementById("hostGame");
            hostGame.style.display = "none"
        
            const gameView = document.getElementById("gameView")
            gameView.style.display = "flex";

            getTheme();
            viewLobby();
            refreshLobbyView();
        }
    }
}

function refreshLobbyView(){
    var intervalId = window.setInterval(function(){
        if (document.getElementById("gameView").style.display == "flex"){
            viewLobby();
            getTheme();
        }
    }, 1000);
}

function toggleLobbyView(){
    const lobbyView = document.getElementById("gameView");

    if (lobbyView.style.display == "none"){
        lobbyView.style.display = "flex";
    } else {
        lobbyView.style.display = "none";
    }
}

function checkLanding(){
    if (document.getElementById("gameView")){
        return true
    } else {
        return false
    }
}

init();