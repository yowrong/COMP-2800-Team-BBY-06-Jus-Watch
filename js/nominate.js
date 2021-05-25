import { writeMovie } from "./firebase-queries.js";

let string = decodeURIComponent(window.location.search); // from "10b Lecture Javascript Relevant Bits-1"
let query = string.split("?"); // Projects 1800 lecture slides
let groupID = query[1];

const searchResultsDiv = document.getElementById('searchResults');

/** Searches through the OMDB API database for movie. */
function searchOMDB(search) {
    // adapted from https://stackoverflow.com/questions/33237200/fetch-response-json-gives-responsedata-undefined

    fetch(`https://www.omdbapi.com/?s=${search}&apikey=5623718`)
        .then((response) => {
            return response.json()
        })
        // returns array of search results
        .then((responseData) => {

            let searchResults = responseData.Search;
            let titles = [];
            let years = [];
            let posters = [];
            let ids = [];

            // loop through search results to grab movie info
            searchResults.forEach(function (movie) {
                titles.push(movie.Title)
                years.push(movie.Year)
                posters.push(movie.Poster)
                ids.push(movie.imdbID)
            })

            renderSearchResults(titles, years, posters, ids, groupID, searchResultsDiv);
        })
        .catch(function (err) {
            console.log(err);
        })
}

// renders Cards of movies in search results in modal for nomination
function renderSearchResults(title, year, poster, movieId, groupId, searchResultsDiv) {
    let card = "";

    for (let i = 0; i < movieId.length; i++) {
        card += `<div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${poster[i]}" alt="${title[i]}" style="max-width: 100%">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${title[i]}</h5>
              <p class="card-text">${year[i]}</p>
              <p class="card-text">
              <a href="group-centre.html?${groupId}">
              <button type="button" class="btn btn-danger btn-lg nominateBtn" id="${movieId[i]}">Nominate</button>
            </a>
              </p>
            </div>
          </div>
        </div>
      </div>`

    }
    searchResultsDiv.innerHTML = card;
}

/* accesses nominated movie's info from OMDB and writes to group's nominatedMovie collection */
function accessMovie(movieId) {
    let movieTitle = "";
    let movieDesc = "";
    let moviePic = "";
    let movieYear = "";
    let movieImdbId = movieId;

    fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=5623718`)
        .then((response) => {
            return response.json()
        })
        .then((responseData) => {
            movieTitle = responseData.Title;
            movieYear = responseData.Year;
            movieDesc = responseData.Plot;
            moviePic = responseData.Poster;

            writeMovie(movieImdbId, movieTitle, movieYear, movieDesc, moviePic, groupID)
        })
        .catch(function (err) {
            console.log(err);
        })
}

$(searchResultsDiv).on("click", ".nominateBtn", function (e) {
    e.preventDefault();
    let movieId = e.target.id;

    accessMovie(movieId);

    setTimeout(function () {
        window.location.href = `/group-centre.html?${groupID}`
    }, 1000)
})

var item;

/* Locally stores the user's search term and redirects to the movie page */
function saveSearchFromUser() {
    document.getElementById("myBtn").addEventListener('click', function () {
        item = document.getElementById("myInput").value;
        searchOMDB(item);

    });
}
saveSearchFromUser();
