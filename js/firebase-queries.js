const db = firebase.firestore();
const usersRef = db.collection("users");
const groupRef = db.collection("groups");

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
        groupRef.doc(groupID).collection("groupMessages")
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
                    window.scrollTo($("#messages"));
                }
            });
        });
    });
}

// Creates a new document in the groupMessages collection containing the message, sentBy, and sendAt.
export function sendMsg(msgToSend, groupID) {
    firebase.auth().onAuthStateChanged(function(user) {
        usersRef.doc(user.uid).get()
        .then(function (doc) {
            const userName = doc.data().name;
            const date = new Date(Date.now());
            //Intl.DateTimeFormat() constructor from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
            const formattedDate = new Intl.DateTimeFormat("en", {
                dateStyle: "short",
                timeStyle: "medium"
            }).format(date);
            groupRef.doc(groupID).collection("groupMessages").add({
                sentBy: userName,
                sentAt: formattedDate,
                message: msgToSend.value,
                uid: user.uid
            });
        })
    });
}

/* Takes values inputted on create-group.html page and writes to Firestore */
export function createGroup(name, desc) {
    firebase.auth().onAuthStateChanged(function(user) {
    // writes to group collection
        groupRef.add({
            groupName: name.value,
            groupDescription: desc.value,
            chosenMovie: "",
            totalVotes: 0,
            isPicked: false
        })
        .then((doc) => {
            // writes group information to users collection, adds to arrays in order so that group information corresponds
            usersRef.doc(user.uid).set({          

                /* Used Firebase doc https://firebase.google.com/docs/firestore/manage-data/add-data for reference */    
                groupId: firebase.firestore.FieldValue.arrayUnion(doc.id),              
                groupName: firebase.firestore.FieldValue.arrayUnion(name.value),
                groupDescription: firebase.firestore.FieldValue.arrayUnion(desc.value)
            }, { merge: true });
        })
        .catch((error) => {
            console.log(error);
        })
    });
}

/* Takes invite URL on invite.html and gets group ID, name, and description from Firestore. */
export function getGroup(groupID, inviteMsg) {
    groupRef.doc(groupID).get()
    .then(function(doc) {
    //   let id = doc.data().groupId;
      let name = doc.data().groupName;
      let desc = doc.data().groupDescription;
  
      addUser(groupID, name, desc, inviteMsg);
  
    //   console.log("get group:", id + name + desc + inviteMsg)
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
          <a href="./group-centre.html?${groupID}" <button type="button" class="btn btn-primary">
          Click to enter your Group's Page!
          </button>`;

          // adds user info to groupMember subcollection
          groupRef.doc(groupID).collection("groupMembers").get()                       // to change "group1" to groupID
          .then(member => {
            
            // if not yet a member, creates a new user document under groupMember collection
              if (!member.exists) {
                groupRef.doc(groupID).collection("groupMembers").doc(user.uid).set({
                  userId: user.uid,
                  name: user.displayName
                //   userLastName: userLName
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
            movieSection.innerHTML = "Nominate some movies to vote on!";

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

// Display nominated movies to vote on.
function renderMoviesForVote(title, desc, year, id, pic, movies) {
    let movieCard = `<div class="card-group">`;

    for (let i = 0; i < id.length; i++) {
        movieCard += `<div class="card">
        <img src="${pic[i]}" class="card-img-top" alt="${title[i]}">
        <div class="card-body">
          <h5 class="card-title">${title[i]}</h5>
          <p class="card-text">${desc[i]}</p>
          <p class="card-text"><small class="text-muted">${year[i]}</small></p>
          <input type="checkbox" class="btn-check" id="${id[i]}" autocomplete="off">
            <label class="btn btn-outline-danger" for="${id[i]}">Vote</label><br>
        </div>
      </div>`;
    }
    movieCard += "</div>";
    movies.innerHTML = movieCard;
}

/* Gets group Info from URL and queries Firestore, displays group-related info on group-centre.html */
export function getGroupforGroupCentre(groupID, movieSection, groupName, groupDesc) {
    groupRef.doc(groupID).get()
    .then(function(doc) {
    //   let id = doc.data().groupId;
      let name = doc.data().groupName;
      let desc = doc.data().groupDescription;

    //   console.log("getgroup:", id);

      displayGroupOnGroupCentre(groupID, name, desc, groupName, groupDesc);
      displayNominatedMovies(groupID, movieSection);
    })
}

// displays Group name and description
function displayGroupOnGroupCentre(id, name, desc, groupName, groupDesc) {
    groupName.innerText = name;
    groupDesc.innerText = desc;
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
            movieSection.innerHTML = `<h5 class="movieCenterTitle">Nominate some movies to vote on!</h5>`;

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

/* displays nominated movies from group's collection on group-centre.html*/
/** Adapted from https://blog.avada.io/examples/bootstrap-movie-cards-sukhmeet.html **/
function renderMovies(title, desc, year, id, pic, movieSection) {
    let movieCard = `<div class="row justify-content-center">`;

    for (let i = 0; i < id.length; i++) {
        movieCard += `<div class="card movie_card">
        <img src="${pic[i]}" class="card-img-top" alt="${title[i]}">
        <div class="card-body">
          <h5 class="card-title">${title[i]}</h5>
          <p class="card-text">${desc[i]}</p>
          
        </div>
        <div class="card-footer">
        <span class="movie_info">${year[i]}</span><span class="movie_info float-end">&#9733 9 / 10</span>
    </div>
      </div>`;
    }
    movieCard += "</div>";
    movieSection.innerHTML = movieCard;
}

/* Gets movie with most votes in nominatedMovies collection, renders winning movie on group-centre.html */
export function getWinningMovie(groupID, movieSection, movieCenterTitle, resetBtn) {
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

            renderWinningMovie(title, desc, year, pic, movieSection, movieCenterTitle, resetBtn, groupID)
        })
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}

/* Changes "nominated movies" section to "movie of the week", generates the winning movie on group-centre.html */
function renderWinningMovie(title, desc, year, pic, movieSection, movieCenterTitle, resetBtn, groupID) {
    let movieCard = `<div class="row justify-content-center">`;

    movieCard += `<div class="card movie_card">
        <img src="${pic}" class="card-img-top" alt="${title}">
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">${desc}</p>
          
        </div>
        <div class="card-footer">
        <span class="movie_info">${year}</span><span class="movie_info float-end">&#9733 / 10</span>
    </div>
      </div>`;

    resetBtn.style.display = "block";
    resetVotes(groupID, resetBtn);

    movieSection.innerHTML = movieCard;
    movieCenterTitle.innerText = "Movie of the Week";

}

/** Resets Nominated Movies Section by deleting all movies in nominatedMovies subcollection for group-centre.html.
 * Resets group's totalVotes to 0. **/
/* Adapted from https://stackoverflow.com/questions/47860812/deleting-all-documents-in-firestore-collection */
function resetVotes(groupID, resetBtn) {
    resetBtn.addEventListener("click", function() {
        let movieDocs = groupRef.doc(groupID).collection("nominatedMovies");
        
        movieDocs.onSnapshot((snapshot) => {
            snapshot.docs.forEach((doc) => {
                movieDocs.doc(doc.id).delete()
            })
            
        });
        groupRef.doc(groupID).update({
            totalVotes: 0
        });
        setTimeout(() => {
            window.location.href = `group-centre.html?${groupID}`
        }, 500)
        
    });
}

/* Checks to see if everyone in group has voted, if yes, shows "Movie of the Week" on group-centre.html */
function checkVotes(members, groupID, movieSection, movieCenterTitle, resetBtn) {
    groupRef.doc(groupID).get()
    .then(function(doc) {
        if (doc.data().totalVotes >= members) {
            console.log("equal votes");
            console.log(doc.data().totalVotes);
            console.log("IF num of members: " + members);

            getWinningMovie(groupID, movieSection, movieCenterTitle, resetBtn);
        } else {
            console.log("not equal votes");
        }
    })
}

/* Queries groupMembers subcollection to get number of members in group for group-centre.html*/
export function getNumOfMembers(groupID, movieSection, movieCenterTitle, resetBtn) {
    groupRef.doc(groupID).collection("groupMembers").get()
    .then(function(doc) {
        let numOfMembers = doc.size;
        console.log("num of members: " + numOfMembers);
        checkVotes(numOfMembers, groupID, movieSection, movieCenterTitle, resetBtn);
    });

}

/* Gets group information from user logged-in, and displays on group-main.html */
export function displayGroups(groupSection) {
    firebase.auth().onAuthStateChanged(function(user) {
        usersRef.doc(user.uid).get()
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
        })
    })
}

/* Renders a "Group" card for each group the user is in, in group-main.html */
export function renderGroups(id, name, desc, groupSection) {
    let groupCard = "";
    for (let i = 0; i < id.length; i++) {

        // Bootstrap card template, "Enter Group" button redirects to Group Center page
        groupCard += `<div class="card mb-3" style="max-width: 540px;">
                        <div class="row g-0">
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${name[i]}</h5>
                                    <p class="card-text">${desc[i]}</p>
                                    <a href="./group-centre.html?${id[i]}">
                                        <button id="${id[i]}" type="button" class="btn btn-danger btn-lg enter">Enter Group</button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>`;
    }
    groupSection.innerHTML = groupCard;
}


/* Writes movie to Firestore nominatedMovies collection on nominate.html*/
export function writeMovie(id, title, year, desc, pic, groupID) {
    groupRef.doc(groupID).collection("nominatedMovies").doc(id).set({
        chosen: false,
        imdbID: id,
        movieDescription: desc,
        moviePoster: pic,
        movieTitle: title,
        movieYear: year,
        numOfVotes: 0
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
}


/* Submits votes to Firestore nominatedMovie collection for group, also increments group's total vote count on vote.html */
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
            let movie = groupRef.doc(id).collection("nominatedMovies").doc(vote);
  
            movie.update({
                numOfVotes: firebase.firestore.FieldValue.increment(1)      // from Firestore "Increment a numeric value"
            });
        });
        groupRef.doc(id).update({
            totalVotes: firebase.firestore.FieldValue.increment(1) 
        });
    });
}
  
//Show group member list
export function showGroupMembers(groupID, groupInfo) {
    groupRef.doc(groupID).collection("groupMembers").get()
    .then((snap) => {
        let nameList = "";
        snap.forEach(function (doc) {
            nameList += `<p>${doc.data().name}</p>`;
        })
        groupInfo.innerHTML = nameList;
    });
    // var groupNo = [];
    // firebase.auth().onAuthStateChanged(function (user) {
    //     if (user) {
    
    //         var query = usersRef.doc(user.uid).get().then((doc) => {
    //             if (doc.exists) {
    //                 for (var i = 0; i < doc.data().groupId.length; i++) {
    
    //                     groupNo[i] = doc.data().groupName[i];
    //                     $(".groupInfo").append(`<div class="` + groupNo[i] + `">
    //             <h2><span id="`+ groupNo[i] + `">` + groupNo[i] + `</span></h2>
    //             <p id="group-member"></p>
    //         </div>`);
    //                     console.log(groupNo);
    //                     console.log(i);
    //                 }
    //             } else {
    //                 console.log("No such document!");
    //             }
                
    //             for (var i = 0; i < groupNo.length; i++) {
    //                 groupRef.doc(groupNo[i]).collection("groupMembers").get().then((querySnapshot) => {
    //                     querySnapshot.forEach((doc) => {
    //                         usersRef.doc(doc.id).get().then((doc) => {
    //                             if (doc.exists) {
    //                                 console.log(i.toString() + " " + groupNo[i] + doc.data().FirstName + " " + doc.data().LastName);
    //                                 $(".group" + (i-1).toString()).append(doc.data().FirstName + " " + doc.data().LastName + '<br>');
    //                             }
    //                         });
    //                     });
    //                 });
    //             }
    //         }).catch((error) => {
    //             console.log("Error getting document:", error);
    //         });
    //     }
    // })
}

export function welcomeUser() {
    firebase.auth().onAuthStateChanged(function(user) {
        if(user) {
            usersRef.doc(user.uid).get()
            .then(function(doc) {
                $("#welcome-msg").text(`Welcome ${doc.data().name}!`);
                $("#log-status").text("You are now logged in.");
            }).catch(function(err) {
                console.log(err);
            });
        } else {
            $("#welcome-msg").hide();
            $(".my-btns").hide();
            $("#log-status").text("You are not logged in.");
            $(".login-btn").show();
        }
    });
}

/* Gets all group messages a user has, and displays them on msgs-main.html */
export function displayGroupMsgs(groupMsgs) {
    firebase.auth().onAuthStateChanged(function(user) {
        usersRef.doc(user.uid).get()
        .then((doc) => {

            let groupId = [];
            let groupName = [];
            let groupDesc = [];

            if (doc.data().groupId.length == 0) {
                groupMsgs.innerHTML = "No Group Chats found.";
            } else {
                for (let i = 0; i < doc.data().groupId.length; i++) {
                    groupId[i] = doc.data().groupId[i];
                    groupName[i] = doc.data().groupName[i];
                }
                renderGroupMsgs(groupId, groupName, groupMsgs)
            }
            console.log("groups: " + groupId + " " + groupName + " " + groupDesc);
        })
    })
}

/* Renders a "Group Message" card for each group chat the user is in, in msgs-main.html */
function renderGroupMsgs(id, name, groupMsgs) {
    let groupMsgCard = "";
    for (let i = 0; i < id.length; i++) {

        // Bootstrap card template, "Enter Group" button redirects to Group Center page
        groupMsgCard += `<div class="card mb-3" style="max-width: 540px;">
                        <div class="row g-0">
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${name[i]}</h5>
                                    <a href="./group-msgs.html?${id[i]}">
                                        <button id="${id[i]}" type="button" class="btn btn-primary btn-lg enter">Enter Group Chat</button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>`;
    }
    groupMsgs.innerHTML = groupMsgCard;
}

/** Ends voting round and displays winning movie on group-centre.html. */
export function endVoting(groupID, endVoteBtn) {
    endVoteBtn.addEventListener("click", function () {
        groupRef.doc(groupID).update({ 
            totalVotes: 100
        });
        setTimeout(function () {
            window.location = `group-centre.html?${groupID}`;
        }, 500);    
    })  
}