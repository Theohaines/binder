function redirect(url){
    window.location.href = url;
}

function redirectT(url){
    window.open(url, '_blank').focus();
}

function parseRefLinkToLocalStorageLobbyId(){ //Allows for shareable links
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('lobbyId')){
        localStorage.setItem('lobbyId', urlParams.get('lobbyId'))
    }
}

parseRefLinkToLocalStorageLobbyId()