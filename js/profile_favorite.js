import { displayFavList, favListDetails } from "./firebase-queries.js";

displayFavList();

favListDetails();

//back button function
function back() {
    window.history.back();
}

//redirect to the detail page
function movieSelected(id) {
    sessionStorage.setItem('movieId', id);
    window.location = "movieresult.html?" + id;
    return false;
}