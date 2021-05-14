import { displayMovies, getVotes } from "./js/firebase-queries.js";
// retrieves group ID from URL
let string = decodeURIComponent(window.location.search);        // from "10b Lecture Javascript Relevant Bits-1"
let query = string.split("?");                                  // Projects 1800 lecture slides
let groupID = query[1];

const movies = document.getElementById("movieList");
const submit = document.getElementById("submit");
const returnBtn = document.getElementById("returnBtn");

displayMovies(movies, groupID);

// creates card for each movie in collection
export function renderMovies(title, desc, year, id, pic, movies) {
    let movieCard = `<div class="card-group">`;

    for (let i = 0; i < id.length; i++) {
        movieCard += `<div class="card">
        <img src="${pic[i]}" class="card-img-top" alt="${title[i]}">
        <div class="card-body">
          <h5 class="card-title">${title[i]}</h5>
          <p class="card-text">${desc[i]}</p>
          <p class="card-text"><small class="text-muted">${year[i]}</small></p>
          <input type="checkbox" class="btn-check" id="${id[i]}" autocomplete="off">
            <label class="btn btn-outline-primary" for="${id[i]}">Vote</label><br>
        </div>
      </div>`;
    }
    movieCard += "</div>";
    movies.innerHTML = movieCard;
}

getVotes(groupID, submit);

returnBtn.addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = `/group_centre.html?${groupID}`;
})

