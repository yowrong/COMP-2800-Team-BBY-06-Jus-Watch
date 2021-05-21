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

  //location.reload();
  //window.location.href = "/movieresult.html";
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
          <div class="row">
            <div class="col-md-4">
              <img src="${movie.Poster}" class="thumbnail">
            </div>
            <div class="col-md-8">
              <h2  style = "color: white">${movie.Title}</h2>
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
          <div class="">
            <div class="well">
              <h3 style = "color: white" >Plot</h3>
              <p style = "color: white">${movie.Plot}</p>
              <hr>
              <a href="post-review.html" target="_blank" class="btn btn-danger">Leave a Comment</a>
              <a href="" onclick="addFavourite(event)"; id = "Addfavourite" class="btn btn-danger">Add Favourite</a>
              <a href="profile_favorite.html" ; class="btn btn-danger">Favourite List</a>
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
          }
          else if (addFavBtn.localeCompare("Remove Favourite") == 0) {
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



