const creatorTextArea = document.getElementById("creatorTextArea");
const uploadImageForm = document.getElementById("uploadImageForm");
var currentElement = null
var currentType = null
var currentPart = null

function onClickEdit(element, type, part){
    if (currentElement != null && currentElement.textContent == "" || currentType == "image") {
        if (type == "image" && currentElement.src == ""){
            currentElement.src = "/media/clicktoedit.png"
        } else {
            currentElement.textContent = "Click to edit!"
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

function validateBeforeUpload(){
    const profileImage = document.getElementById("profileImage");

    if (!profileImage.src.trim() || profileImage.src.trim() == ""){
        alert("FUCK");
        return;
    }

    console.log("ran")
    console.log(profileImage.src, profileImage.src.trim())
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
}