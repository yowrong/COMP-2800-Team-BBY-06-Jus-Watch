const db = firebase.firestore();
const usersRef = db.collection("users");
const groupRef = db.collection("groups");


const movies = document.getElementById("movieList");
const submit = document.getElementById("submit");

// gets group's nominated movie collection and displays
function displayMovies(movies) {
    groupRef.doc("group1").collection("nominatedMovies").get()
    .then((doc) => { 
        let movieId = [];
        let movieName = [];
        let movieDesc = [];
        let movieYear = [];
        let moviePic = [];

        // if no nominated movies
        if (doc.size == 0) {
            movies.innerHTML = "Nominate some movies to vote on!"

        } else {
            doc.forEach((movie) => {
                // console.log("movie: " + movie.data().movieTitle);
                movieId.push(movie.data().imdbID)
                movieName.push(movie.data().movieTitle)
                movieDesc.push(movie.data().movieDescription)
                movieYear.push(movie.data().movieYear)
                moviePic.push(movie.data().moviePoster)
    
            })
    
            renderMovies(movieName, movieDesc, movieYear, movieId, moviePic, movies);
        }

        
    })
    .catch((err) => {
        throw err;
    })
}

// creates card for each movie in collection
function renderMovies(title, desc, year, id, pic, movies) {
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

displayMovies(movies);


// submits votes to Firestore nominated movie collection for group
function getVotes() {
    submit.addEventListener("click", function() {
        let voteList = [];
        let votes = document.querySelectorAll(".btn-check:checked");        // StackOverflow: https://stackoverflow.com/questions/11599666/get-the-value-of-checked-checkbox
    
        // gets id's of all checked movies
        votes.forEach(function(vote) {
            voteList.push(vote.id)
        });


        // Firestore query based on movieId, increments number of votes by one
        voteList.forEach(function(vote) {
            let movie = groupRef.doc("group1").collection("nominatedMovies").doc("movie2");     
            
            // doc("movie2") -> movie documents must be named by imdbID

            movie.update({
                numOfVotes: firebase.firestore.FieldValue.increment(1)      // from Firestore "Increment a numeric value"
            });

            });
        });
}

getVotes();

