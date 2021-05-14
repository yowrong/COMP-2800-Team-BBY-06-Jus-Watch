import { getGroupforGroupCentre, getNumOfMembers, displayNominatedMovies, getWinningMovie, showGroupMembers } from "./firebase-queries.js";

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
const movieSection = document.getElementById('movieList');
const movieCenterTitle = document.getElementById('movieCenterTitle');
const groupInfo = document.getElementById('groupInfo');

//https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line
function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}


// gets group Info from URL and queries Firestore
// function getGroupforGroupCentre(groupID, movieSection) {
//     groupRef.doc(groupID).get()
//     .then(function(doc) {
//       let id = doc.data().groupId;
//       let name = doc.data().groupName;
//       let desc = doc.data().groupDescription;

//       displayGroup(id, name, desc);
//       shareLink(id);
//       displayMovies(id, movieSection);

//     })
//   }

var groupVars = [];

// const groupCall = async () => {
//     groupVars = await getGroupforGroupCentre(groupID, movieSection);
//     displayGroupOnGroupCentre(groupVars[0], groupVars[1], groupVars[2]);
//     shareLink(groupVars[0]);
//     displayNominatedMovies(groupVars[0], movieSection);
// }
// groupCall();

getGroupforGroupCentre(groupID, movieSection, groupName, groupDesc);


// displays Group name and description
// function displayGroupOnGroupCentre(id, name, desc) {
//     groupName.innerText = name;
//     groupDesc.innerText = desc;
// }

/* Generates correct links for the buttons */
function shareLink(groupID) {
    share.setAttribute("value", `https://www.JusWatch.com/group_main.html?${groupID}`);         // *** need to change to hosted link         
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

shareLink(groupID);


/* queries groupMembers subcollection to get number of members in group */

// function getNumOfMembers() {
//     groupRef.doc(groupID).collection("groupMembers").get()
//     .then(function(doc) {
//         let numOfMembers = doc.size;
//         console.log("num of members: " + numOfMembers);
//         checkVotes(numOfMembers);
//     });

// }
getNumOfMembers(groupID, movieSection, movieCenterTitle);



/* checks to see if everyone in group has voted, if yes, shows "Movie of the Week" */

// function checkVotes(members) {
//     groupRef.doc(groupID).get()
//     .then(function(doc) {
//         if (doc.data().totalVotes == members) {
//             console.log("equal votes");
//             console.log(doc.data().totalVotes);
//             console.log("IF num of members: " + members);

//             getWinningMovie(groupID);

//         } 
//     })
// }



/* gets movie with most votes in nominatedMovies collection */

// function getWinningMovie(id) {
//     groupRef.doc(id).collection("nominatedMovies")
//     .orderBy("numOfVotes", "desc").limit(1)
//     .get()
//     .then(function(snap) {
//         snap.forEach(function(movie) {
//             let title = movie.data().movieTitle;
//             let desc = movie.data().movieDescription;
//             let year = movie.data().movieYear;
//             let pic = movie.data().moviePoster;

//             renderWinningMovie(title, desc, year, id, pic, movieSection)
//         })
//     })
// }

/* changes "nominated movies" section to "movie of the week", generates the winning movie */
// function renderWinningMovie(title, desc, year, id, pic, movieSection) {
//     let movieCard = "";

//         movieCard += `<div class="card winningMovie">
//         <img src="${pic}" class="card-img-top" alt="${title}">
//         <div class="card-body">
//           <h5 class="card-title">${title}</h5>
//           <p class="card-text">${desc}</p>
//         </div>
//         <div class="card-footer">
//       <small class="text-muted">${year}</small>
//     </div>
//       </div>`;

//     movieSection.innerHTML = movieCard;
//     movieCenterTitle.innerText = "Movie of the Week"
// }



// getWinningMovie( groupID, movieSection, movieCenterTitle);


/* displays nominated movies from group's collection */
// function displayNominatedMovies(id, movies) {
//     groupRef.doc(id).collection("nominatedMovies").get()
//     .then((doc) => { 

//         // create arrays of all movies and movie items in group collection
//         let movieId = [];
//         let movieName = [];
//         let movieDesc = [];
//         let movieYear = [];
//         let moviePic = [];

//         // if no nominated movies
//         if (doc.size == 0) {
//             movies.innerHTML = "No Movies Nominated Yet!"

//         } else {
//             doc.forEach((movie) => {
//                 // console.log("movie: " + movie.data().movieTitle);

//                 // each movie gets added to the arrays
//                 movieId.push(movie.data().imdbID)
//                 movieName.push(movie.data().movieTitle)
//                 movieDesc.push(movie.data().movieDescription)
//                 movieYear.push(movie.data().movieYear)
//                 moviePic.push(movie.data().moviePoster)

//             })
//             renderMovies(movieName, movieDesc, movieYear, movieId, moviePic, movies);
//         }

//     })
//     .catch((err) => {
//         throw err;
//     })
// }

/* creates card for each movie in collection */
// function renderMovies(title, desc, year, id, pic) {
//     let movieCard = `<div class="card-group">`;

//     for (let i = 0; i < id.length; i++) {
//         movieCard += `<div class="card">
//         <img src="${pic[i]}" class="card-img-top" alt="${title[i]}">
//         <div class="card-body">
//           <h5 class="card-title">${title[i]}</h5>
//           <p class="card-text">${desc[i]}</p>
//         </div>
//         <div class="card-footer">
//       <small class="text-muted">${year[i]}</small>
//     </div>
//       </div>`;
//     }
//     movieCard += "</div>";
//     movieSection.innerHTML = movieCard;
// }

displayNominatedMovies(groupID, movieSection);

showGroupMembers(groupID, groupInfo);
// $(document).ready(function(){
//     showGroupMembers()
// });