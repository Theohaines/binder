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
        createLobbyCodeInput.value = data.split('"').join("");
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
        //We will do some redirect stuff here once I get profile uploads on the DB working!
    }).catch(error => {
        console.error('Fetch error:', error);
    });
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