const creatorTextArea = document.getElementById("creatorTextArea");
const uploadImageForm = document.getElementById("uploadImageForm");
var currentElement = null
var currentType = null
var currentPart = null

var customImageUsed = false

function onClickEdit(element, type, part){
    if (currentElement != null && currentElement.textContent == "" || currentType == "image") {
        if (type == "image" && currentElement.src == ""){
            currentElement.src = "/media/clicktoedit.png"
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
    } else if (type == "image"){
        creatorTextArea.value = element.src
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

    if (friendlyNameInput.textContent == "Click me to edit!" || friendlyNameInput.textContent.trim() == ""){
        alert('Err! You need to enter the friendly name value!');
        return;
    }

    //If all of that validates then...

    const lobbyCodeInput = document.getElementById("lobbyCodeInput");

    if (lobbyCodeInput.value.trim() == ""){
        submitProfileToDB('public');
    } else {
        submitProfileToDB(lobbyCodeInput.value)
    }
}

async function submitProfileToDB(lobbyId){
    fetch('/viewlobby', {  
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"lobbyId" : lobbyId})
    }).then(response => {
        if (!response.ok) {
            alert("Status code: " + response.status + ". Did you enter a valid lobby code?");
            throw new Error('Network response was not ok');
        }
        response.json()
    }) .then(data => {
        //Cool profile stuff I might do...
    }).catch(error => {
        console.error('Fetch error:', error);
    });
}

function pageLoad(){
    const urlParams = new URLSearchParams(window.location.search);
    const lobbyId = urlParams.get('lobbyId');

    lobbyCodeInput.value = lobbyId;
}

pageLoad();