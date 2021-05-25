import { displayFavList, favListDetails } from "./firebase-queries.js";

displayFavList();

favListDetails();

const backBtn = document.getElementById('backBtn');

backBtn.addEventListener('click', function(e) {
    window.history.back();
})