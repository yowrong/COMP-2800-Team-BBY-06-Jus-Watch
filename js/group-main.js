import { displayGroups } from "./firebase-queries.js";

const groupList = document.getElementById("group-list");
const createGroupBtn = document.getElementById("createGroupBtn");

/* Redirects to login if user not signed in */
createGroupBtn.addEventListener("click", function(e) {
    e.preventDefault();
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.location = "/create-group.html";
        } else {
            window.location = "/login.html";
        }
    });
})

displayGroups(groupList);
