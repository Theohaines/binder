async function createLobby(){
    fetch('/createlobby', {  
        method: 'post',
        headers: {'Content-Type': 'application/json'}
    }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
    }) .then(data => {
        lobbyId = data.split('"').join("");
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
        if (!response.ok) {
            alert("Status code: " + response.status + ". Did you enter a valid lobby code?");
            throw new Error('Network response was not ok');
        }
        return response.json();
    }) .then(data => {
        prettyListLobby(data);
    }).catch(error => {
        console.error('Fetch error:', error);
    });
}

function prettyListLobby(lobby) {
    const lobbyList = document.getElementById("lobbyList");

    lobbyList.innerHTML = ""

    lobby = JSON.parse(lobby)

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
        if (!response.ok) {
            alert("Status code: " + response.status + ". Did you enter a valid lobby code?");
            throw new Error('Network response was not ok');
        }
    }) .then(data => {
        window.redirect("/creator?lobbyId=" + localStorage.getItem("lobbyId"));
    }).catch(error => {
        console.error('Fetch error:', error);
    });
}

function redirectProfileViaID(id){
    window.location.href = "/profile?id=" + id + "&lobbyId=" + localStorage.getItem("lobbyId");
}

function leaveGame(){
    localStorage.setItem("lobbyId", "null");
    window.location.reload();
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

            viewLobby();
            refreshLobbyView();
        }
    }
}

function refreshLobbyView(){
    var intervalId = window.setInterval(function(){
        if (document.getElementById("gameView").style.display == "flex"){
            viewLobby();
        }
    }, 10000);
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