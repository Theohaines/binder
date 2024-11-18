async function createLobby(){
    let createLobbyCodeInput = document.getElementById("createLobbyCodeInput");

    fetch('/createlobby', {  
        method: 'post',
        headers: {'Content-Type': 'application/json'}
    }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
    }) .then(data => {
        let lobbyId = data.split('"').join("");
        createLobbyCodeInput.value = "https://binder.theohaines.xyz/creator/?lobbyId=" + lobbyId;
        createLobbyCodeInput.select();
        createLobbyCodeInput.setSelectionRange(0, 99999);

        navigator.clipboard.writeText(createLobbyCodeInput.value);
        
        createLobbyCodeInput.value = lobbyId;
        document.getElementById("viewLobbyCodeInput").value = lobbyId;
        document.getElementById("createProfileInput").value = lobbyId;

        viewLobby();
    }).catch(error => {
        console.error('Fetch error:', error);
    });
}

async function viewLobby() {
    let viewLobbyCodeInput = document.getElementById("viewLobbyCodeInput");

    fetch('/viewlobby', {  
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"lobbyId" : viewLobbyCodeInput.value})
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
    console.log(lobby)
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
}

async function createProfileAdv(params) {
    let createProfileInput = document.getElementById("createProfileInput");

    if (createProfileInput.value.trim() == ""){ //set lobby query ref to public
        window.redirect("/creator?lobbyId=public");
    } else {
        fetch('/viewlobby', {  
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"lobbyId" : createProfileInput.value})
        }).then(response => {
            if (!response.ok) {
                alert("Status code: " + response.status + ". Did you enter a valid lobby code?");
                throw new Error('Network response was not ok');
            }
        }) .then(data => {
            window.redirect("/creator?lobbyId=" + createProfileInput.value);
        }).catch(error => {
            console.error('Fetch error:', error);
        });
    }
}

function redirectProfileViaID(id){
    let viewLobbyCodeInput = document.getElementById("viewLobbyCodeInput"); //We use the lobby code like a password to make sure the user is allowed to view this code ;)
    
    window.location.href = "/profile?id=" + id + "&lobbyId=" + viewLobbyCodeInput.value;
}

function init(){
    if (document.getElementById("viewLobbyCodeInput")){
        const urlParams = new URLSearchParams(window.location.search);
        const lobbyId = urlParams.get('lobbyId');

        if (lobbyId == null){
            return;
        }
    
        document.getElementById("viewLobbyCodeInput").value = lobbyId;
        document.getElementById("createProfileInput").value = lobbyId;
        viewLobby();

        refreshLobbyView();
    }
}

function refreshLobbyView(){
    var intervalId = window.setInterval(function(){
        if (document.getElementById("viewLobbyCodeInput").value != ""){
            viewLobby();
        }
    }, 10000);
}

init();