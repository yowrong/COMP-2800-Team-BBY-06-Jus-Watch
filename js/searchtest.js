// link to search.css
new_element = document.createElement("link");
new_element.setAttribute("rel", "stylesheet");
new_element.setAttribute("type", "text/css");
new_element.setAttribute("href", "./css/search.css");

document.body.appendChild(new_element);

if (document.URL.includes("movieresult.html")) {
    getMovie();
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

function getMovies(myInput) {
    axios.get('http://www.omdbapi.com?s=' + myInput + '&apikey=6753c87c')
        .then((response) => {
            console.log(response);
            let movies = response.data.Search;
            let output = '';
            $.each(movies, (index, movie) => {
                output += `
            <a onclick="movieSelected('${movie.imdbID}')" class="nav-link text-white" href="#">
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
            console.log("!!!!!!!!!!");
            $('#movies').html(output);
        })
        .catch((err) => {
            console.log(err);
        });
}


function movieSelected(id) {
    sessionStorage.setItem('movieId', id);
    window.location = "movieresult.html";

    return false;
}

function getMovie() {
    let movieId = sessionStorage.getItem('movieId');

    axios.get('http://www.omdbapi.com?i=' + movieId + '&apikey=6753c87c')
        .then((response) => {
            console.log(1 + 1);
            console.log(response);

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
            <a href="post-review.html" target="_blank" class="anotest">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Leave a Comment</a>
            <a href="" onclick="addFavourite(event)"; id = "Addfavourite" class="anotest">
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
        `;
            console.log(1 + output);
            $('#movie').html(output);

        })
        .catch((err) => {
            console.log(err);
        });
}
// 
// Lillian21520 add movie to favorite..from here
// 
//catch user login

const db = firebase.firestore();
// const { user } = require("firebase-functions/lib/providers/auth");
function getUser() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("user is signed in");
            db.collection("users")
                .doc(user.uid)
                .get()
                .then(function (doc) {
                    var n = doc.data().name;
                    console.log(n);
                    $("#username").text(n);
                })
        } else {
            console.log("no user is signed in");
        }
    })
}

// Click "favorite" button in movieresult page, get movie&store into firebase
function addFavourite(e) {
  var db = firebase.firestore();
  var addFavBtn = $("#Addfavourite").text();
  e.preventDefault();
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      let movieId = sessionStorage.getItem('movieId');
      axios.get('http://www.omdbapi.com?i=' + movieId + '&apikey=6753c87c')
        .then((response) => {
          let movie = response.data;
          if (addFavBtn.localeCompare('Remove Favourite') != 0) {
            db.collection("users").doc(user.uid).update({
              "favouriteLists": firebase.firestore.FieldValue.arrayUnion(movieId),
            });
            $('#Addfavourite').text('Remove Favourite');
            addFavBtn = $("#Addfavourite").text();
          } else if (addFavBtn.localeCompare("Remove Favourite") == 0) {
            db.collection("users").doc(user.uid).update({
              "favouriteLists": firebase.firestore.FieldValue.arrayRemove(movieId),
            });
            $('#Addfavourite').text('Add Favourite');
            addFavBtn = $("#Addfavourite").text();
          }
        });
    };
  });

  //window.location = "\profile_favorite.html"
    var db = firebase.firestore();
    var addFavBtn = $("#Addfavourite").text();
    e.preventDefault();
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            let movieId = sessionStorage.getItem('movieId');
            axios.get('http://www.omdbapi.com?i=' + movieId + '&apikey=6753c87c')
                .then((response) => {
                    let movie = response.data;
                    if (addFavBtn.localeCompare('Remove Favourite') != 0) {
                        db.collection("users").doc(user.uid).update({
                            "favouriteLists": firebase.firestore.FieldValue.arrayUnion(movieId),
                        });
                        $('#Addfavourite').text('Remove Favourite');
                        addFavBtn = $("#Addfavourite").text();
                    } else if (addFavBtn.localeCompare("Remove Favourite") == 0) {
                        db.collection("users").doc(user.uid).update({
                            "favouriteLists": firebase.firestore.FieldValue.arrayRemove(movieId),
                        });
                        $('#Addfavourite').text('Add Favourite');
                        addFavBtn = $("#Addfavourite").text();
                    }
                });
        };
    });

    //window.location = "\profile_favorite.html"
}


/* Uses the OMDB API to randomly generate a movie suggestion */
function getRandomMovie() {
    let movieID = "tt";
    let imdbID = "" + Math.floor(Math.random() * 100000);

    while (imdbID.length < 7) {
        let num = 0 /*Math.floor(Math.random() * 5)*/ ;
        imdbID = num + imdbID;
    }

    console.log(movieID + imdbID);

    // Continuously fetch until a satisfactory movie is generated
    // Source: https://stackoverflow.com/questions/45008330/how-can-i-use-fetch-in-while-loop
    axios.get('http://www.omdbapi.com?i=' + movieID + imdbID + '&apikey=6753c87c')
        .then((response) => {

            console.log(response);

            let movie = response.data;

            if (movie.Error) {

                getRandomMovie();

            } else {
                // let numVotes = parseInt(movie.imdbVotes);
                // console.log(numVotes);

                if (movie.Rated === "X" || movie.Plot === "N/A" || movie.Poster === "N/A" /*|| numVotes < 1000 || isNaN(numVotes)*/ ) {

                    getRandomMovie();

                } else {

                    let output = `
                        <div class="row">
                            <div class="col-md-4">
                                <img src="${movie.Poster}" class="thumbnail">
                            </div>
                            <div class="col-md-8">
                                <h2 style = "color: white">${movie.Title}</h2>
                                    <ul class="list-group">
                                    <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
                                    <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
                                    <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
                                    <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
                                    <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
                                    <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
                                    <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
                                </ul>
                            </div>
                            </div>
                            <div class="row">
                            <div class="well">
                                <h3 style = "color: white" >Plot</h3>
                                <p style = "color: white">${movie.Plot}</p>
                                <hr>
                                <a href="post-review.html" target="_blank" class="btn btn-primary">Leave a Command</a>
                                <a href="profile_favorite.html" class="btn btn-primary">Favorite</a>
                            </div>
                        </div>`;

                    $('#movie').html(output);
                }
            }
        }).catch((err) => {
            console.log(err);
        });
}