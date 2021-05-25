import { displayMoviesForVote, getVotes } from "./firebase-queries.js";

// retrieves group ID from URL
let string = decodeURIComponent(window.location.search);        // from "10b Lecture Javascript Relevant Bits-1"
let query = string.split("?");                                  // Projects 1800 lecture slides
let groupID = query[1];

const movieList = document.getElementById("movieList");
const submit = document.getElementById("submit");
const returnBtn = document.getElementById("returnBtn");
const closeBtn = document.getElementById("closeBtn");
const modalBody = document.getElementById("modal-body");

getVotes(groupID, submit, modalBody);

displayMoviesForVote(groupID, movieList, submit);

returnBtn.addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = `/group-centre.html?${groupID}`;
})

closeBtn.addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = `/group-centre.html?${groupID}`;
})
