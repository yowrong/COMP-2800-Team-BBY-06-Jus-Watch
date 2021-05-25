import { createGroup } from "./firebase-queries.js";

const groupName = document.getElementById("groupName");
const groupDesc = document.getElementById("groupDescription");
const createBtn = document.getElementById("create");
const modalBtn = document.getElementById("modalBtn");
const modalName = document.getElementById("modal-groupName");
const modalBody = document.getElementById('modal-body');

/* Creates group on click of create button, only created if name field is not empty*/
createBtn.addEventListener("click", function(e) {
    if (groupName.value.trim() != '') {
        createGroup(groupName, groupDesc)
        modalName.innerText = groupName.value
    } else {
        modalBody.innerHTML = "<p>Your group needs a name!</p>"
        setTimeout(function() {
            window.location.href = "create-group.html";
        }, 800);
    }
})

//redirect to group-main after confirmation
modalBtn.addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = "./group-main.html";
})
