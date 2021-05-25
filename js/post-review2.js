// Initialize Firebase

// const config = {
//   apiKey: "AIzaSyBKFYVvWiU38IHUNQxgZHam8M68cC7Q8OQ",
//   authDomain: "jus-watch.firebaseapp.com",
//   projectId: "jus-watch",
//   storageBucket: "jus-watch.appspot.com",
//   messagingSenderId: "793273634117",
//   appId: "1:793273634117:web:7c8d0589a9b2bef101c22c",
//   measurementId: "G-M53J0E72DL"
// };

// firebase.initializeApp(config);

import { displayReviews, submitReview } from "./firebase-queries.js";

/* Get movie ID for reviews */
let string = decodeURIComponent(window.location.search); // from "10b Lecture Javascript Relevant Bits-1"
let query = string.split("?"); // Projects 1800 lecture slides
const movieID = query[1];



// Initialize Cloud Firestore through Firebase
// const db = firebase.firestore();
const settings = {
  timestampsInSnapshots: true
};

// db.settings(settings);
// // const { user } = require("firebase-functions/lib/providers/auth");
// function getUser() {
//   firebase.auth().onAuthStateChanged(function (user) {
//     if (user) {
//       console.log("user is signed in");
//       db.collection("users")
//         .doc(user.uid)
//         .get()
//         .then(function (doc) {
//           var n = doc.data().name;
//           console.log(n);
//           $("#username").text(n);
//         })
//     } else {
//       console.log("no user is signed in");
//     }
//   })
// }

const form = document.querySelector("form");
// const nickname = document.getElementById("nickname");
const message = document.getElementById("message");
const errorMessage = document.querySelector(".error-message");
const closebtn = document.querySelector(".error-message .close");
const dataArea = document.getElementById("load-data");
const submitBtn = document.getElementById("submitBtn");




submitReview(movieID, submitBtn, message, errorMessage);



closebtn.addEventListener("click", () => {
  errorMessage.classList.remove("show");
});


displayReviews(movieID, dataArea);


// const usercommandsRef = db.collection("users").doc("uid").collection('commands');
// usercommandsRef.orderBy("date")
//   .onSnapshot(querySnapshot => {
//     let messages = [];
//     querySnapshot.forEach(chat => {
//       messages.push(chat.data());
//     });
//     if (messages.length !== 0) {
//       dataArea.innerHTML = "";
//     } else {
//       dataArea.innerHTML = "<p >No Review Yet</p>";
//     }

//     for (let i = 0; i < messages.length; i++) {
//       const createdOn = new Date(messages[i].date.seconds * 1000);

//       dataArea.innerHTML += `
     
//      <article style= "background-color:rgb(95, 15, 15);">
                               
//                                     <p style = "color: white">${messages[i].message}</p>
                                    
//                                 <div class="float-right">
//                                     <span style = "color: white" class="">
//                                         ${messages[i].nickname}
//                                     </span>
//                                     <span style = "color: white" class="">
//                                         ${formatDate(createdOn)}
//                                     </span>
//                                 </div>
                              
//                             </article>
//                         `;
//     }
//   });