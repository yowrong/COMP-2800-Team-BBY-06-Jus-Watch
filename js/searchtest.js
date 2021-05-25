import { getUser } from "./firebase-queries.js";

let new_element = document.createElement("link");
new_element.setAttribute("rel", "stylesheet");
new_element.setAttribute("type", "text/css");
new_element.setAttribute("href", "./css/search.css");

document.body.appendChild(new_element);

getUser();

if (document.URL.includes("movieresult.html")) {
    let string = decodeURIComponent(window.location.search); // from "10b Lecture Javascript Relevant Bits-1"
    let query = string.split("?"); // Projects 1800 lecture slides
    let movieID = query[1];
    getMovie(movieID);
}

if (document.URL.includes("post-review.html")) {
    let string = decodeURIComponent(window.location.search); // from "10b Lecture Javascript Relevant Bits-1"
    let query = string.split("?"); // Projects 1800 lecture slides
    let movieID = query[1];
    getMovie(movieID);
}

$(document).ready(() => {
    $('#searchBar').on('submit', (e) => {
        let myInput = $('#myInput').val();
        if (myInput === 'juswatch') {
            window.location = 'easter.html';
        } else {
            getMovies(myInput);
        }
        e.preventDefault();
    });
    $('#search').on('click', (e) => {
        let myInput = $('#myInput').val();
        if (myInput === 'juswatch') {
            window.location = 'easter.html';
        } else {
            getMovies(myInput);

        }
        e.preventDefault();
    });
    $('#random').on('click', function (e) {
        e.preventDefault();
        getRandomMovie();
    })
});


//return the input from search box as movieid for get the information 
//from omdb api some movie infromation and display in card in search page
function getMovies(myInput) {
    axios.get('https://www.omdbapi.com?s=' + myInput + '&apikey=5623718')
        .then((response) => {
            let movies = response.data.Search;
            let output = '';
            $.each(movies, (index, movie) => {
                output += `
            <a href="movieresult.html?${movie.imdbID}" class="nav-link text-white">
            <div class="movie_card" style="width: 18rem;margin: 0 auto;>
              <div class="card h-100">
                <img src="${movie.Poster}"  class="poster">
                <div class="card-body">
                <h5>${movie.Title}</h5>
                </div>
              </div>
            </div>
          </a>
          `;
            });
            $('#movies').html(output);
        })
        .catch((err) => {
            console.log(err);
        });
}

//return the movie result description page with url contain "movieid" and styling the movie description page 
function getMovie(movieID) {

    axios.get('https://www.omdbapi.com?i=' + movieID + '&apikey=5623718')
        .then((response) => {
            let movie = response.data;
            let output = `
      <div class="moviedscrpt">
        <div class="centerbox">
          <img src="${movie.Poster}" class="thumbnail">
          <h2  style = "color: white;">${movie.Title}</h2>
        </div>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
            </ul>
        <div class="well" style="margin:4%">
            <h3 style = "color: white" >Plot</h3>
            <p style = "color: white">${movie.Plot}</p>
            <hr>
            <div class="centerbox">
            <a href="post-review.html?${movie.imdbID}";  id = "postreview"  class="anotest">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Leave a Comment</a>
              <a onclick="a()"; id = "Addfavourite" class="anotest">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Add Favourite</a>
            <a href="profile_favorite.html" ; class="anotest">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Favourite List</a>
              </div>
        </div>
      </div>
      <script>
      function check() {
        let string = decodeURIComponent(window.location.search); // from "10b Lecture Javascript Relevant Bits-1"
        let query = string.split("?"); // Projects 1800 lecture slides
        let movieId = query[1];
        const db = firebase.firestore();
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
             axios.get('https://www.omdbapi.com?i=' + movieId + '&apikey=5623718')
              .then((response) => {
                var checka = db.collection('users');
                let movie = response.data;
                checka.where('favouriteLists',  'array-contains', movieId).get().then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    console.log(movieId + user.uid);
                      if (doc.exists) {
                        $('#Addfavourite').text('Remove Favourite');
                    } else {
                        console.log("No such document!");
                    }
                  });
              })
              .catch((error) => {
                  console.log("Error getting documents: ", error);
              });
            });
          };
        });
      }
      check();
      function a() {
        let string = decodeURIComponent(window.location.search); // from "10b Lecture Javascript Relevant Bits-1"
        let query = string.split("?"); // Projects 1800 lecture slides
        let movieId = query[1];
        const db = firebase.firestore();
        var addFavBtn = $("#Addfavourite").text();
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
             axios.get('https://www.omdbapi.com?i=' + movieId + '&apikey=5623718')
              .then((response) => {
                let movie = response.data;
                console.log(addFavBtn.trim() );
                if (addFavBtn.trim().localeCompare("Remove Favourite") != 0) {
                  db.collection("users").doc(user.uid).update({
                    "favouriteLists": firebase.firestore.FieldValue.arrayUnion(movieId),
                  });
                  $('#Addfavourite').text('Remove Favourite');
                  addFavBtn = $("#Addfavourite").text();
                } else if (addFavBtn.trim().localeCompare("Remove Favourite") == 0) {
                  db.collection("users").doc(user.uid).update({
                    "favouriteLists": firebase.firestore.FieldValue.arrayRemove(movieId),
                  });
                  $('#Addfavourite').text('Add Favourite');
                  addFavBtn = $("#Addfavourite").text();
                }
              });
          };
        });
      }
            </script>`;
            $('#movies').html(output);

        })
        .catch((err) => {
            console.log(err);
        });
}


/* https://code.tutsplus.com/tutorials/parsing-a-csv-file-with-javascript--cms-25626 */
function getRandomMovie() {
    $.ajax({
        url: 'https://raw.githubusercontent.com/peetck/IMDB-Top1000-Movies/master/IMDB-Movie-Data.csv',
        dataType: 'text',
    }).done(successFunction);

    function successFunction(data) {
        var movie = [];
        let randomMovie = "";


        let movieRow = data.split(/\r?\n|\r/);
        for (let i = 1; i < movieRow.length; i++) {
            let movieItems = movieRow[i].split(',');
            movie.push(movieItems[1]);

        }
        let number = Math.floor(Math.random() * 1000)

        randomMovie = movie[number];

        getOMDBInfo(randomMovie);

    }

    function getOMDBInfo(randomMovie) {
        axios.get('https://www.omdbapi.com?t=' + randomMovie + '&apikey=6753c87c')
            .then((response) => {
                let movie = response.data;
                let output = `
                              <div class="moviedscrpt">
                              <div class="centerbox">
                                <img src="${movie.Poster}" class="thumbnail">
                                <h2  style = "color: white;">${movie.Title}</h2>
                              </div>
                                  <ul class="list-group">
                                    <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
                                    <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
                                    <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
                                    <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
                                    <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
                                    <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
                                    <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
                                  </ul>
                              <div class="well" style="margin:4%">
                                  <h3 style = "color: white" >Plot</h3>
                                  <p style = "color: white">${movie.Plot}</p>
                                  <hr>
                                  <div class="centerbox">`;
                $('#movies').html(output);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}