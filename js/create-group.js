import { createGroup } from "./firebase-queries.js";
const db = firebase.firestore();

const groupName = document.getElementById("groupName");
const groupDesc = document.getElementById("groupDescription");

const createBtn = document.getElementById("create");
const modalBtn = document.getElementById("modalBtn");
const modalName = document.getElementById("modal-groupName");

createBtn.addEventListener("click", function(e) {
    createGroup(groupName, groupDesc)

    modalName.innerText = groupName.value
})

modalBtn.addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = "./group-main.html";
})
