import { displayGroups } from "./firebase-queries.js";

// const db = firebase.firestore();
// const usersRef = db.collection("users");
// const groupRef = db.collection("groups");

const groupList = document.getElementById("group-list");

displayGroups(groupList);

/* Renders a "Group" card for each group the user is in, in group-main.html */
// function renderGroups(id, name, desc, groupSection) {
//     let groupCard = "";
//     for (let i = 0; i < id.length; i++) {

//         // Bootstrap card template, "Enter Group" button redirects to Group Center page
//         groupCard += `<div class="card mb-3" style="max-width: 540px;">
//                         <div class="row g-0">
//                             <div class="col-md-4">
//                                 <!-- <img src="..." alt="..."> -->
//                             </div>
//                             <div class="col-md-8">
//                                 <div class="card-body">
//                                     <h5 class="card-title">${name[i]}</h5>
//                                     <p class="card-text">${desc[i]}</p>
//                                     <a href="./index.html?${id[i]}">
//                                         <button id="${id[i]}" type="button" class="btn btn-primary btn-lg enter">Enter Group</button>
//                                     </a>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>`;
//     }
//     groupSection.innerHTML = groupCard;
// }