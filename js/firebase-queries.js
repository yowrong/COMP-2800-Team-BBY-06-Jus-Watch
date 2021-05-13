import { renderGroups } from "./js/group-main.js";
import { renderMovies } from "./js/vote.js";

const db = firebase.firestore();
const usersRef = db.collection("users");
const groupRef = db.collection("groups");
const inviteMsg = document.getElementById("inviteMsg");

export function createUser() {
    firebase.auth().onAuthStateChanged(function(user) {
        usersRef.doc(user.uid).get()
        .then((docSnapshot) => {
            if(!docSnapshot.exists) {
                usersRef.doc(user.uid).set({
                    name: user.displayName,
                    email: user.email,
                    uid: user.uid,
                    groupDescription: [],
                    groupId: [],
                    groupName: []
                });
            }
        });
    });
}

export function displayMsgs(groupID) {
    firebase.auth().onAuthStateChanged(function(user) {
        groupRef.doc("group1").collection("groupMessages")
        .orderBy("sentAt")
        //Tech-Tip 016 from Comp 1800
        //Author: Carly Orr
        //Source: https://www.notion.so/Tech-Tip-016-How-do-I-listen-to-new-documents-added-to-a-collection-16469db1a9d7451f8d0c2012bfd084ee
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(function (change) {
                if (change.type === "added") {
                    let msg = "";
                    snapshot.forEach(function (doc) {
                        if (doc.data().uid === user.uid) {
                            msg += `<div class="sent"><p class="name">${doc.data().sentBy}</p><p class="message">${doc.data().message}</p><aside class="time">${doc.data().sentAt}</aside></div>`;
                        } else {
                            msg += `<div class="incoming"><p class="name">${doc.data().sentBy}</p><p class="message">${doc.data().message}</p><aside class="time">${doc.data().sentAt}</aside></div>`;
                        }
                    });
                    $("#messages").html(msg);
                }
            });
        });
    });
}

export function sendMsg(msgToSend) {
    firebase.auth().onAuthStateChanged(function(user) {
        usersRef.doc(user.uid).get()
        .then(function (doc) {
            const userName = doc.data().name;
            //Intl.DateTimeFormat() constructor from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
            const date = new Intl.DateTimeFormat("en", {
                dateStyle: "short",
                timeStyle: "medium"
            }).format(Date.now());
            groupRef.doc("group1").collection("groupMessages").add({
                sentBy: userName,
                sentAt: date,
                message: msgToSend.value,
                uid: user.uid
            });
            // .then(() => {
            //     window.location.href = "schedule.html";
            // });
        })
    });
}

// takes values inputted on create_group page and writes to Firestore
export function createGroup(name, desc) {
    // writes to group collection
    groupRef.add({
        groupName: name.value,
        groupDescription: desc.value,
        chosenMovie: "",
    })
    .then((doc) => {
        // writes group information to users collection
        usersRef.doc("Bjak8WiHFRY52ScuYiVfgcDPmps1").set({
            groupId: firebase.firestore.FieldValue.arrayUnion(doc.id),              // from Firebase website, adds to array
            groupName: firebase.firestore.FieldValue.arrayUnion(name.value),
            groupDescription: firebase.firestore.FieldValue.arrayUnion(desc.value)
        }, { merge: true });
    })
    .catch((error) => {
        console.log(error);
    });
}

// gets group information from user logged-in, and displays
export function displayGroups(groupSection) {
    usersRef.doc("Bjak8WiHFRY52ScuYiVfgcDPmps1").get()
    .then((doc) => {
        // let groupList = doc.data().groupId;
        let groupId = [];
        let groupName = [];
        let groupDesc = [];

        if (doc.data().groupId.length == 0) {
            groupSection.innerHTML = "No Groups found.";
        } else {
            for (let i = 0; i < doc.data().groupId.length; i++) {
                groupId[i] = doc.data().groupId[i];
                groupName[i] = doc.data().groupName[i];
                groupDesc[i] = doc.data().groupDescription[i];
            }
            renderGroups(groupId, groupName, groupDesc, groupSection)
        }
        console.log("groups: " + groupId + " " + groupName + " " + groupDesc);
    })
}

// gets group ID, name, and description from invite URL
export function getGroup(groupID, inviteMsg) {
    groupRef.doc(groupID).get()
    .then(function(doc) {
      let id = doc.data().groupId;
      let name = doc.data().groupName;
      let desc = doc.data().groupDescription;
  
      addUser(id, name, desc, inviteMsg);
  
      console.log("get group:", id + name + desc + inviteMsg)
  
    })
}

// adds user info to groupMember subcollection within specific group collection
// also adds group info to user's document
export function addUser(groupID, groupName, groupDesc, inviteSection) {
    firebase.auth().onAuthStateChanged((user) => {

      // user must be logged in
        if (user) {
          console.log(user.uid);
          console.log(user.displayName);
          let userFName = user.displayName.split(' ')[0];
          let userLName = user.displayName.split(' ')[1];

          inviteSection.innerHTML = `<h3>Welcome!</h3>
          <a href="./group_main.html?${groupID}" <button type="button" class="btn btn-primary">
          Click to enter your Group's Page!
          </button>`;

          // adds user info to groupMember subcollection
          groupRef.doc("group1").collection("groupMembers").get()                       // to change "group1" to groupID
          .then(member => {
            
            // if not yet a member, creates a new user document under groupMember collection
              if (!member.exists) {
                groupRef.doc("group1").collection("groupMembers").doc(user.uid).set({
                  userId: user.uid,
                  userFirstName: userFName,
                  userLastName: userLName
                })
              }
          });

          // adds group info to user's document
          usersRef.doc(user.uid).update({
            groupId: firebase.firestore.FieldValue.arrayUnion(groupID),
            groupName: firebase.firestore.FieldValue.arrayUnion(groupName),
            groupDescription: firebase.firestore.FieldValue.arrayUnion(groupDesc)
          });

        } else {
          inviteSection.innerHTML = "<h3>Please Log in first!</h3>"
        }
      });
}

// gets group's nominated movie collection and displays
export function displayMovies(movies, id) {
    groupRef.doc(id).collection("nominatedMovies").get()
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

// submits votes to Firestore nominatedMovie collection for group, also increments group's total vote count
export function getVotes(id, submit) {
    submit.addEventListener("click", function() {
        let voteList = [];
        let votes = document.querySelectorAll(".btn-check:checked");        // StackOverflow: https://stackoverflow.com/questions/11599666/get-the-value-of-checked-checkbox
    
        // gets id's of all checked movies
        votes.forEach(function(vote) {
            voteList.push(vote.id)
        });

        // Firestore query based on movieId, increments number of votes by one
        voteList.forEach(function(vote) {
            let movie = groupRef.doc(id).collection("nominatedMovies").doc(vote);       // ******** Need to change to movieID
            
            // doc("movie2") -> movie documents must be named by imdbID

            movie.update({
                numOfVotes: firebase.firestore.FieldValue.increment(1)      // from Firestore "Increment a numeric value"
            });

            });
        });
        groupRef.doc(id).update({
            totalVotes: firebase.firestore.FieldValue.increment(1) 
        })
}