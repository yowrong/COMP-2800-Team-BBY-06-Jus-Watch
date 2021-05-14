// import { renderGroups } from "./group-main.js";
// import { renderMoviesForVote } from "./vote.js";
// import { renderWinningMovie, renderMovies } from "./group-centre.js";

const db = firebase.firestore();
const usersRef = db.collection("users");
const groupRef = db.collection("groups");
const inviteMsg = document.getElementById("inviteMsg");

// Creates a new user to the user collection after sign-up if they are a new user.
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

// Queries the groupMessages subcollection within the groups collection for message sent in the group chat.
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

// Writes to the groupMessages subcollection when a message is sent including sentBy and sentAt.
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
        })
    });
}

/* Takes values inputted on create-group.html page and writes to Firestore */
export function createGroup(name, desc) {
    // writes to group collection
    groupRef.add({
        groupName: name.value,
        groupDescription: desc.value,
        chosenMovie: "",
    })
    .then((doc) => {
        // writes group information to users collection
        usersRef.doc("Bjak8WiHFRY52ScuYiVfgcDPmps1").set({                      //**** TO CHANGE TO USER UID */
            groupId: firebase.firestore.FieldValue.arrayUnion(doc.id),              // from Firebase website, adds to array
            groupName: firebase.firestore.FieldValue.arrayUnion(name.value),
            groupDescription: firebase.firestore.FieldValue.arrayUnion(desc.value)
        }, { merge: true });
    })
    .catch((error) => {
        console.log(error);
    });
}

/* Takes invite URL on invite.html and gets group ID, name, and description from Firestore. */
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

/* Adds user info from invite.html to groupMember subcollection within specific group collection
Also adds group info to user's document */
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

/* Gets group's nominated movie collection and displays on vote.html */
export function displayMoviesForVote(id, movieSection) {
    groupRef.doc(id).collection("nominatedMovies").get()
    .then((doc) => { 
        let movieId = [];
        let movieName = [];
        let movieDesc = [];
        let movieYear = [];
        let moviePic = [];

        // if no nominated movies
        if (doc.size == 0) {
            movieSection.innerHTML = "Nominate some movies to vote on!"

        } else {
            doc.forEach((movie) => {
                // console.log("movie: " + movie.data().movieTitle);
                movieId.push(movie.data().imdbID)
                movieName.push(movie.data().movieTitle)
                movieDesc.push(movie.data().movieDescription)
                movieYear.push(movie.data().movieYear)
                moviePic.push(movie.data().moviePoster)
    
            })   
            renderMoviesForVote(movieName, movieDesc, movieYear, movieId, moviePic, movieSection);
        }
    })
    .catch((err) => {
        throw err;
    })
}


/* Gets group Info from URL and queries Firestore, displays group-related info on group-centre.html */
export function getGroupforGroupCentre(groupID, movieSection) {
    return groupRef.doc(groupID).get()
    .then(function(doc) {
      let id = doc.data().groupId;
      let name = doc.data().groupName;
      let desc = doc.data().groupDescription;

      console.log("getgroup:", id);

      return [
         id,
         name,
         desc
    ]

    //   displayGroupOnGroupCentre(id, name, desc);
    //   shareLink(id);
    //   displayNominatedMovies(id, movieSection);
    })
}

/* Displays nominated movies from group's collection on group-centre.html */
export function displayNominatedMovies(groupId, movieSection) {
    groupRef.doc(groupId).collection("nominatedMovies").get()
    .then((doc) => { 

        // create arrays of all movies and movie items in group collection
        let movieId = [];
        let movieName = [];
        let movieDesc = [];
        let movieYear = [];
        let moviePic = [];

        // if no nominated movies
        if (doc.size == 0) {
            movieSection.innerHTML = "Nominate some movies to vote on!"

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

            renderMovies(movieName, movieDesc, movieYear, movieId, moviePic, movieSection);
        }
    })
    .catch((err) => {
        throw err;
    })
}

/* displays nominated movies from group's collection */
function renderMovies(title, desc, year, id, pic, movieSection) {
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
    movieSection.innerHTML = movieCard;
}

/* Gets movie with most votes in nominatedMovies collection, renders winning movie on group-centre.html */
export function getWinningMovie(groupID, movieSection, movieCenterTitle) {
    groupRef.doc(groupID).collection("nominatedMovies")
    .orderBy("numOfVotes", "desc").limit(1)
    .get()
    .then(function(snap) {
        snap.forEach(function(movie) {
            let title = movie.data().movieTitle;
            let desc = movie.data().movieDescription;
            let year = movie.data().movieYear;
            let id = movie.data().imdbID;
            let pic = movie.data().moviePoster;

            renderWinningMovie(title, desc, year, id, pic, movieSection, movieCenterTitle)
        })
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}

function renderWinningMovie(title, desc, year, id, pic, movieSection, movieCenterTitle) {
    let movieCard = "";

    movieCard += `<div class="card winningMovie">
        <img src="${pic}" class="card-img-top" alt="${title}">
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${desc}</p>
        </div>
        <div class="card-footer">
            <small class="text-muted">${year}</small>
        </div>
        </div>`;

    movieSection.innerHTML = movieCard;
    movieCenterTitle.innerText = "Movie of the Week";
}

/* Checks to see if everyone in group has voted, if yes, shows "Movie of the Week" on group-centre.html */
export function checkVotes(members, groupID) {
    groupRef.doc(groupID).get()
    .then(function(doc) {
        if (doc.data().totalVotes == members) {
            console.log("equal votes");
            console.log(doc.data().totalVotes);
            console.log("IF num of members: " + members);

            getWinningMovie(groupID);
        } 
    })
}

/* Queries groupMembers subcollection to get number of members in group for group-centre.html*/
export function getNumOfMembers(groupID) {
    groupRef.doc(groupID).collection("groupMembers").get()
    .then(function(doc) {
        let numOfMembers = doc.size;
        console.log("num of members: " + numOfMembers);
        checkVotes(numOfMembers, groupID);
    });

}


/* Gets group information from user logged-in, and displays on groups-main.html */
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
    });
}

//Show group member list
export function showGroupMembers() {
    var groupNo = [];
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
    
            var query = usersRef.doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    for (var i = 0; i < doc.data().groupId.length; i++) {
    
                        groupNo[i] = doc.data().groupName[i];
                        $(".groupInfo").append(`<div class="` + groupNo[i] + `">
                <h2><span id="`+ groupNo[i] + `">` + groupNo[i] + `</span></h2>
                <p id="group-member"></p>
            </div>`);
                        console.log(groupNo);
                        console.log(i);
                    }
                } else {
                    console.log("No such document!");
                }
                
                for (var i = 0; i < groupNo.length; i++) {
                    groupRef.doc(groupNo[i]).collection("groupMembers").get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            usersRef.doc(doc.id).get().then((doc) => {
                                if (doc.exists) {
                                    console.log(i.toString() + " " + groupNo[i] + doc.data().FirstName + " " + doc.data().LastName);
                                    $(".group" + (i-1).toString()).append(doc.data().FirstName + " " + doc.data().LastName + '<br>');
                                }
                            });
                        });
                    });
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        }
    })
}