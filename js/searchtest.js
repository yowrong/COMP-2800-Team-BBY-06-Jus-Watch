// link to search.css
new_element = document.createElement("link");
new_element.setAttribute("rel", "stylesheet");
new_element.setAttribute("type", "text/css");
new_element.setAttribute("href", "./css/search.css");

document.body.appendChild(new_element);
$(document).ready(() => {
  $('#searchBar').on('submit', (e) => {
    let myInput = $('#myInput').val();
    getMovies(myInput);
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

      $('#movies').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}

function movieSelected(id) {
  sessionStorage.setItem('movieId', id);
  window.location = "movieresult.html";
  // window.location.href = "/movieresult.html";
  return false;
}

function getMovie() {
  let movieId = sessionStorage.getItem('movieId');

  axios.get('http://www.omdbapi.com?i=' + movieId + '&apikey=6753c87c')
    .then((response) => {
      console.log(response);
      let movie = response.data;

      let output = `
          <div class="moviedscrpt">
            <div class="col-md-4">
              <img src="${movie.Poster}" class="thumbnail">
            </div>
            <div class="col-md-8">
              <h2>${movie.Title}</h2>
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
              <h3>Plot</h3>
              ${movie.Plot}
              <hr>
              <a href="post-review.html" target="_blank" class="btn btn-primary">Leave a Command</a>
              <a href="#" id="favorite" class="btn btn-primary">Favorite</a>
            </div>
          </div>
        `;

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

var db = firebase.firestore();
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
const addBtn = document.getElementById("favorite");

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
      let movieId = sessionStorage.getItem('movieId');
    
      axios.get('http://www.omdbapi.com?i=' + movieId + '&apikey=6753c87c')
        .addBtn.addEventListener("click", function (e) {
          // console.log("clicked create");
          console.log("New movie id", movieId);
        })
        .catch((err) => {
          console.log(err);
        });

    
  }
});