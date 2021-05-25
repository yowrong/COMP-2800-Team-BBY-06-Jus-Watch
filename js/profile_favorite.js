import { displayFavList, favListDetails } from "./firebase-queries.js";

displayFavList();

favListDetails();

const backBtn = document.getElementById('backBtn');

backBtn.addEventListener('click', function(e) {
    window.history.back();
})

//redirect to the detail page
function movieSelected(id) {
    sessionStorage.setItem('movieId', id);
    window.location = "movieresult.html?" + id;
    return false;
}