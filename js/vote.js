import { displayMoviesForVote, getVotes } from "./firebase-queries.js";

// retrieves group ID from URL
let string = decodeURIComponent(window.location.search);        // from "10b Lecture Javascript Relevant Bits-1"
let query = string.split("?");                                  // Projects 1800 lecture slides
let groupID = query[1];

const movieList = document.getElementById("movieList");
const submit = document.getElementById("submit");
const returnBtn = document.getElementById("returnBtn");

getVotes(groupID, submit);

displayMoviesForVote(groupID, movieList, submit);

returnBtn.addEventListener("click", function(e) {
    e.preventDefault();
    window.location.href = `/group-centre.html?${groupID}`;
})


/* Submits votes to Firestore nominatedMovie collection for group, also increments group's total vote count on vote.html */
// function getVotes(id, submit) {
//   submit.addEventListener("click", function() {
//       let voteList = [];
//       let votes = document.querySelectorAll(".btn-check:checked");        // StackOverflow: https://stackoverflow.com/questions/11599666/get-the-value-of-checked-checkbox
  
//       // gets id's of all checked movies
//       votes.forEach(function(vote) {
//           voteList.push(vote.id)
//       });

//       // Firestore query based on movieId, increments number of votes by one
//       voteList.forEach(function(vote) {
//           let movie = groupRef.doc(id).collection("nominatedMovies").doc(vote);

//           movie.update({
//               numOfVotes: firebase.firestore.FieldValue.increment(1)      // from Firestore "Increment a numeric value"
//               });

//           })
//       })
//   }

// /* Creates card for each movie in collection */
// function renderMoviesForVote(title, desc, year, id, pic, movies) {
//     let movieCard = `<div class="card-group">`;

//     for (let i = 0; i < id.length; i++) {
//         movieCard += `<div class="card">
//         <img src="${pic[i]}" class="card-img-top" alt="${title[i]}">
//         <div class="card-body">
//           <h5 class="card-title">${title[i]}</h5>
//           <p class="card-text">${desc[i]}</p>
//           <p class="card-text"><small class="text-muted">${year[i]}</small></p>
//           <input type="checkbox" class="btn-check" id="${id[i]}" autocomplete="off">
//             <label class="btn btn-outline-danger" for="${id[i]}">Vote</label><br>
//         </div>
//       </div>`;
//     }
//     movieCard += "</div>";
//     movies.innerHTML = movieCard;
// }
