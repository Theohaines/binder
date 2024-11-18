const creatorTextArea = document.getElementById("creatorTextArea");
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