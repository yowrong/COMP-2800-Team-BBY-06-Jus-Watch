import {
    displayGroups
} from "./js/firebase-queries.js";

const db = firebase.firestore();
const usersRef = db.collection("users");
const groupRef = db.collection("groups");

const groupList = document.getElementById("group-list");

displayGroups(groupList);

