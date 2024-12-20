var currentType = "interests";

function loadProfileViaID(){
    const urlParams = new URLSearchParams(window.location.search);
    const lobbyId = localStorage.getItem("lobbyId");
    const id = urlParams.get('id');
    
    fetch('/loadprofile', {  
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({lobbyId, id})
    }).then(response => {
        return response.json();
    }) .then(data => {
        res = JSON.parse(data);
        if (res[0] != 200){
            alert(res[0] + ", " + res[1]);
            return;
        }

        prettyLoadProfile(data);
    }).catch(error => {
        console.error('Fetch error:', error);
    });

    
}

function prettyLoadProfile(profile){
    profile = JSON.parse(profile);
    profile = profile[1]

    console.log(profile);

    const profileImage = document.getElementById("profileImage");
    profileImage.src = profile.P_IMAGE;

    const profileName = document.getElementById("profileName");
    profileName.textContent = profile.P_NAME;

    const profileAge = document.getElementById("profileAge");
    profileAge.textContent = profile.P_AGE;

    const profileLocation = document.getElementById("profileLocation");
    profileLocation.textContent = profile.P_LOCATION;

    const aboutMeText = document.getElementById("aboutMeText");
    aboutMeText.textContent = profile.P_ABOUT;

    parseInterestsAndMam(profile.P_INTERESTS, "I");

    parseInterestsAndMam(profile.P_MAM, "M");

    const createdBy = document.getElementById("createdBy");
    createdBy.textContent = "Created by: " + profile.P_CREATOR;
}

function parseInterestsAndMam(string, type){
    const interestsList = document.getElementById("interestsList");
    const mamList = document.getElementById("mamList");

    if (type == "I"){
        interestsList.innerHTML = ""
    } else {
        mamList.innerHTML = ""
    }

    var array = JSON.parse(string);
    console.log(array)

    for (var entry in array){
        var element = document.createElement("div");
        element.textContent = array[entry];

        if (type == "I"){
            element.className = "interest-bubble"
            interestsList.appendChild(element);
        } else {
            element.className = "mam-bubble"
            mamList.appendChild(element);
        }
    }
}

loadProfileViaID();