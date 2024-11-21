const creatorTextArea = document.getElementById("creatorTextArea");
const uploadImageForm = document.getElementById("uploadImageForm");
var currentElement = null
var currentType = null
var currentPart = null

var customImageUsed = false

function onClickEdit(element, type, part){
    if (currentElement != null && currentElement.textContent == "") {
        if (type == "interests" || type == "mam"){
            currentElement.innerHTML = "";
            let newEntry = document.createElement("div");

            if (currentType == "interests"){
                newEntry.className = "interest-bubble";
            } else {
                newEntry.className = "mam-bubble";
            }

            newEntry.textContent = "Click me to edit!";
            currentElement.append(newEntry)
        } else {
            currentElement.textContent = "Click me to edit!"
        }
    }

    currentElement = element
    currentType = type
    currentPart = part
    if (element.textContent == "") {
        creatorTextArea.value = ("Now editing:", element.class)
    } else if (type == "part"){
        creatorTextArea.value = part
    } else if (type == "interests" || type == "mam"){
        creatorTextArea.value = "";

        for (var sub of currentElement.children){
            creatorTextArea.value += sub.textContent + "\n";
        }
    } else {
        creatorTextArea.value = element.textContent;
    }
}

function updateTextArea(){
    if (currentType == "interests" || currentType == "mam"){
        parseInterestsAndMam(creatorTextArea.value);
    } else if (currentType == "part") {
        parsePart(currentElement.textContent);
    } else if (currentType == "image") {
        if (creatorTextArea.value){
            currentElement.src = creatorTextArea.value
        }
    } else {
        currentElement.textContent = creatorTextArea.value;
    }
}

function parseInterestsAndMam(string){
    let array = string.split('\n')
    currentElement.innerHTML = "";

    for (var string of array){
        let newEntry = document.createElement("div");
    
        if (currentType == "interests"){
            newEntry.className = "interest-bubble";
        } else {
            newEntry.className = "mam-bubble";
        }

        newEntry.textContent = string;
        currentElement.append(newEntry)
    }
}

uploadImageForm.addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
    /** @type {HTMLFormElement} */
    const form = event.currentTarget;
    const url = new URL(form.action);
    const formData = new FormData(form);
    const searchParams = new URLSearchParams(formData);

    /** @type {Parameters<fetch>[1]} */
    const fetchOptions = {
    method: form.method,
    };

    if (form.method.toLowerCase() === 'post') {
    if (form.enctype === 'multipart/form-data') {
        fetchOptions.body = formData;
    } else {
        fetchOptions.body = searchParams;
    }
    } else {
    url.search = searchParams;
    }

    event.preventDefault();

    const res = await fetch(url, fetchOptions);

    if (!res.ok){
        console.log(res)
    }

    const json = await res.json();
    console.log(json)

    const profileImage = document.getElementById("profileImage");

    profileImage.src = "/media/uploads/" + JSON.parse(json);
    customImageUsed = true
}

function validateBeforeUpload(){
    //Validate like a boss (why bother because we gotta do this on server side anyways)

    if (customImageUsed == false){
        alert('Err! You need to upload your own image!');
        return;
    }

    const profileName = document.getElementById("profileName");

    if (profileName.textContent == "Click me to edit!" || profileName.textContent.trim() == ""){
        alert('Err! You need to edit the name value!');
        return;
    }

    const profileAge = document.getElementById("profileAge");

    if (profileAge.textContent == "Click me to edit!" || profileAge.textContent.trim() == ""){
        alert('Err! You need to edit the age value!');
        return;
    }

    const profileLocation = document.getElementById("profileLocation");

    if (profileLocation.textContent == "Click me to edit!" || profileLocation.textContent.trim() == ""){
        alert('Err! You need to edit the location value!');
        return;
    }

    const aboutMeText = document.getElementById("aboutMeText");

    if (aboutMeText.textContent == "Click me to edit!" || aboutMeText.textContent.trim() == ""){
        alert('Err! You need to edit the About me value!');
        return;
    } else if (aboutMeText.textContent.trim().length < 30) {
        alert('Err! About me text must be more than 30 characters!');
        return;
    }

    const interestsList = document.getElementById("interestsList");

    if (interestsList.childElementCount < 2){
        alert('Err! Interests list must have at least 2 entrys!');
        return;
    }

    const mamList = document.getElementById("mamList");

    if (mamList.childElementCount < 2){
        alert('Err! More about me list must have at least 2 entrys!');
        return;
    }

    const friendlyNameInput = document.getElementById("friendlyNameInput");

    if (friendlyNameInput.value == "Click me to edit!" || friendlyNameInput.value.trim() == ""){
        alert('Err! You need to enter the friendly name value!');
        return;
    }

    //If all of that validates then...

    const lobbyCodeInput = document.getElementById("lobbyCodeInput");

    if (lobbyCodeInput.value.trim() == ""){
        //Removed public lobby
    } else {
        submitProfileToDB();
    }
}

async function submitProfileToDB(){
    const profileImage = document.getElementById("profileImage").src;
    const profileName = document.getElementById("profileName").textContent;
    const profileAge = document.getElementById("profileAge").textContent;
    const profileLocation = document.getElementById("profileLocation").textContent;
    const aboutMeText = document.getElementById("aboutMeText").textContent;
    const friendlyNameInput = document.getElementById("friendlyNameInput").value;

    const interestsListElement = document.getElementById("interestsList");
    const mamListElement = document.getElementById("mamList");

    let lobbyId = localStorage.getItem("lobbyId")

    let interestsList = [];
    let mamList = [];

    for (var entry of interestsListElement.childNodes){
        interestsList.push(entry.textContent);
    }

    for (var entry of mamListElement.childNodes){
        mamList.push(entry.textContent);
    }

    fetch('/uploadprofile', {  
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({lobbyId, profileImage, profileName, profileAge, profileLocation, aboutMeText, interestsList, mamList, friendlyNameInput})
    }).then(response => {
        return response.json()
    }) .then(data => {
        res = JSON.parse(data);
        if (res[0] != 200){
            alert(res[0] + ", " + res[1]);
            return;
        }

        window.location = "/";
    }).catch(error => {
        console.error('Fetch error:', error);
    });
}

function pageLoad(){
    lobbyCodeInput.value = localStorage.getItem("lobbyId");
    currentLobbyHeading.textContent = "Current lobby: " + localStorage.getItem("lobbyId");
}

pageLoad();