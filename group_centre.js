let string = decodeURIComponent(window.location.search);        // from "10b Lecture Javascript Relevant Bits-1"
let query = string.split("?");                                  // Projects 1800 lecture slides
let groupID = query[1];

const db = firebase.firestore();
const usersRef = db.collection("users");
const groupRef = db.collection("groups");
const inviteMsg = document.getElementById("inviteMsg");
const share = document.getElementById("shareLink");

const groupName = document.getElementById('group-name');
const groupDesc = document.getElementById('group-description');
const voteBtn = document.getElementById('voteBtn');
const nominateBtn = document.getElementById('nominateBtn');
const chatBtn = document.getElementById('chatBtn');
const movies = document.getElementById('movieList');

// gets group Info from URL and queries Firestore
function getGroup(groupID, inviteMsg) {
    groupRef.doc(groupID).get()
    .then(function(doc) {
      let id = doc.data().groupId;
      let name = doc.data().groupName;
      let desc = doc.data().groupDescription;
  
      displayGroup(id, name, desc);
      shareLink(id);
      displayMovies(id, movies);
  
    })
  }
  
getGroup(groupID, inviteMsg);

function getNumOfMembers() {

    groupRef.doc(groupID).collection("groupMembers").get()
    .then(function(doc) {
        let numOfMembers = doc.size;
        console.log("num of members: " + numOfMembers);
        checkVotes(numOfMembers);
    });

}
getNumOfMembers();

function checkVotes(members) {
    groupRef.doc(groupID).get()
    .then(function(doc) {
        if (doc.data().numOfVotes == members) {
            console.log("equal votes");
            console.log(doc.data().numOfVotes);
            console.log("IF num of members: " + members);

        } else {
            console.log("not enough votes");
        }
    })
}


function displayGroup(id, name, desc) {
    groupName.innerText = name;
    groupDesc.innerText = desc;
}

// generates correct links for the buttons
function shareLink(groupID) {
    share.setAttribute("value", `https://www.JusWatch.com/group_main.html?${groupID}`);
    nominateBtn.addEventListener("click", function(e) {
        e.preventDefault;
        window.location.href = `nominate.html?${groupID}`;
    })
    voteBtn.addEventListener("click", function(e) {
        e.preventDefault;
        window.location.href = `vote.html?${groupID}`;
    })
    chatBtn.addEventListener("click", function(e) {
        e.preventDefault;
        window.location.href = `group-msgs.html?${groupID}`;
    })
}

// displays nominated movies from group's collection
function displayMovies(id, movies) {
    groupRef.doc(id).collection("nominatedMovies").get()
    .then((doc) => { 

        // create arrays of all movies and movie items in group collection
        let movieId = [];
        let movieName = [];
        let movieDesc = [];
        let movieYear = [];
        let moviePic = [];

        // if no nominated movies
        if (doc.size == 0) {
            movies.innerHTML = "No Movies Nominated Yet!"

        } else {
            doc.forEach((movie) => {
                // console.log("movie: " + movie.data().movieTitle);

                // each movie gets added to the arrays
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
        </div>
        <div class="card-footer">
      <small class="text-muted">${year[i]}</small>
    </div>
      </div>`;
    }
    movieCard += "</div>";
    movies.innerHTML = movieCard;
}

