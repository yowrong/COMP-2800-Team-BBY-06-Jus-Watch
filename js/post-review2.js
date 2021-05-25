import { displayReviews, submitReview } from "./firebase-queries.js";

/* Get movie ID for reviews */
let string = decodeURIComponent(window.location.search); // from "10b Lecture Javascript Relevant Bits-1"
let query = string.split("?"); // Projects 1800 lecture slides
const movieID = query[1];

const settings = {
  timestampsInSnapshots: true
};

const form = document.querySelector("form");
const message = document.getElementById("message");
const errorMessage = document.querySelector(".error-message");
const closebtn = document.querySelector(".error-message .close");
const dataArea = document.getElementById("load-data");
const submitBtn = document.getElementById("submitBtn");

submitReview(movieID, submitBtn, message, errorMessage);

closebtn.addEventListener("click", () => {
  errorMessage.classList.remove("show");
});

displayReviews(movieID, dataArea);