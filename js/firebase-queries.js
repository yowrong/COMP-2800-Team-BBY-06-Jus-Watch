const db = firebase.firestore();
const usersRef = db.collection("users");
const groupRef = db.collection("groups");

// Creates a new user to the user collection after sign-up if they are a new user.
export function createUser() {
    firebase.auth().onAuthStateChanged(function (user) {
        usersRef.doc(user.uid).get()
            .then((docSnapshot) => {
                if (!docSnapshot.exists) {
                    // Initialize user document with name, email, uid, groupDescription, groupId, and groupName fields
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
    firebase.auth().onAuthStateChanged(function (user) {
        groupRef.doc(groupID).collection("groupMessages")
            .orderBy("sentAt")
            //Tech-Tip 016 from Comp 1800
            //Author: Carly Orr
            //Source: https://www.notion.so/Tech-Tip-016-How-do-I-listen-to-new-documents-added-to-a-collection-16469db1a9d7451f8d0c2012bfd084ee
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach(function (change) {
                    let msg = "";
                    snapshot.forEach(function (doc) {
                        //Convert firestore timestamp to date Object
                        //Source: https://stackoverflow.com/questions/52247445/how-do-i-convert-a-firestore-date-timestamp-to-a-js-date
                        let date = doc.data().sentAt.toDate();
                        //Intl.DateTimeFormat() constructor from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
                        let formatTime = new Intl.DateTimeFormat("en", {
                            dateStyle: "short",
                            timeStyle: "medium"
                        }).format(date);
                        if (doc.data().uid === user.uid) {
                            msg += `<div class="sent"><p class="name">${doc.data().sentBy}</p><p class="message">${doc.data().message}</p><aside class="time">${formatTime}</aside></div>`;
                        } else {
                            msg += `<div class="incoming"><p class="name">${doc.data().sentBy}</p><p class="message">${doc.data().message}</p><aside class="time">${formatTime}</aside></div>`;
                        }
                    });
                    //Append all messages from groupMessages subcollection
                    $("#messages").html(msg);
                });
            });
    });
}

// Creates a new document in the groupMessages collection containing the message, sentBy, and sendAt.
export function sendMsg(msgToSend, groupID) {
    firebase.auth().onAuthStateChanged(function (user) {
        usersRef.doc(user.uid).get()
            .then(function (doc) {
                const userName = doc.data().name;
                groupRef.doc(groupID).collection("groupMessages").add({
                    sentBy: userName,
                    message: msgToSend.value,
                    uid: user.uid,
                    // Timestamp for when the message was sent
                    sentAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            })
    });
}

/* Takes values inputted on create-group.html page and writes to Firestore */
export function createGroup(name, desc) {
    firebase.auth().onAuthStateChanged(function (user) {
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
                }, {
                    merge: true
                });

                // adds initial user to groupMembers.
                addFirstUser(doc.id);
            })
            .catch((error) => {
                console.log(error);
            })
    });
}

/* Takes invite URL on invite.html and gets group ID, name, and description from Firestore. */
export function getGroup(groupID, inviteMsg) {
    groupRef.doc(groupID).get()
        .then(function (doc) {
            let name = doc.data().groupName;
            let desc = doc.data().groupDescription;

            addUser(groupID, name, desc, inviteMsg);
        })
}

/** Adds user to groupMembers subcollection when first creating group on create-group.html */
function addFirstUser(groupID) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            groupRef.doc(groupID).collection("groupMembers").get()
                .then(member => {

                    // if not yet a member, creates a new user document under groupMember collection
                    if (!member.exists) {
                        groupRef.doc(groupID).collection("groupMembers").doc(user.uid).set({
                            userId: user.uid,
                            name: user.displayName
                        })
                    }
                });
        }
    })
}

/* Adds user info from invite.html to groupMember subcollection within specific group collection
Also adds group info to user's document */
export function addUser(groupID, groupName, groupDesc, inviteSection) {
    firebase.auth().onAuthStateChanged((user) => {

        // user must be logged in
        if (user) {

            inviteSection.innerHTML = `<h3 class="inviteTitle">Welcome to ${groupName}!</h3>
          <a href="./group-centre.html?${groupID}" <button type="button" class="btn btn-danger">
          Enter Group
          </button>`;

            // adds user info to groupMember subcollection
            groupRef.doc(groupID).collection("groupMembers").get()
                .then(member => {

                    // if not yet a member, creates a new user document under groupMember collection
                    if (!member.exists) {
                        groupRef.doc(groupID).collection("groupMembers").doc(user.uid).set({
                            userId: user.uid,
                            name: user.displayName
                        })
                    }
                });

            // adds group info to user's document
            usersRef.doc(user.uid).update({
                groupId: firebase.firestore.FieldValue.arrayUnion(groupID),
                groupName: firebase.firestore.FieldValue.arrayUnion(groupName),
                groupDescription: firebase.firestore.FieldValue.arrayUnion(groupDesc)
            });

            // if not logged in, displays message to login
        } else {
            inviteSection.innerHTML = `<h3 class="inviteTitle">Please Log in first!</h3>
          <a href="login.html" <button type="button" class="btn btn-danger">
          Login
          </button>`;
        }
    });
}

/* Gets group's nominated movie collection and displays on vote.html */
export function displayMoviesForVote(id, movieSection, submit) {
    groupRef.doc(id).collection("nominatedMovies").get()
        .then((doc) => {
            let movieId = [];
            let movieName = [];
            let movieDesc = [];
            let movieYear = [];
            let moviePic = [];

            // if no nominated movies
            if (doc.size == 0) {
                movieSection.innerHTML = `<h5 class="text-center nominate">Nominate some movies to vote on!</h4>`;
                submit.style.display = "none";
            } else {
                doc.forEach((movie) => {

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

/** Displays nominated movies on vote.html */
function renderMoviesForVote(title, desc, year, id, pic, movies) {
    let movieCard = `<div class="row justify-content-center">`;

    for (let i = 0; i < id.length; i++) {
        movieCard += `<div class="card movie_card">
        <img src="${pic[i]}" class="card-img-top" alt="${title[i]}">
        <div class="card-body">
          <h5 class="card-title">${title[i]}</h5>
          <p class="movie_info year">${year[i]}</p>
          <p class="card-text">${desc[i]}</p>
        </div>
        <div class="card-footer d-flex justify-content-center">       
        <input type="checkbox" class="btn-check" id="${id[i]}" autocomplete="off">
        <label class="btn btn-outline-danger" for="${id[i]}"><i class="fas fa-check"></i></label><br>
        </div>
      </div>`;
    }
    movieCard += "</div>";
    movies.innerHTML = movieCard;

}

/* Gets group Info from URL and queries Firestore, displays group-related info on group-centre.html */
export function getGroupforGroupCentre(groupID, movieSection, groupName, groupDesc) {
    groupRef.doc(groupID).get()
        .then(function (doc) {

            let name = doc.data().groupName;
            let desc = doc.data().groupDescription;

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

/* Displays nominated movies from group's collection on group-centre.html*/
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
        .then(function (snap) {
            snap.forEach(function (movie) {
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
/ * Resets group's totalVotes to 0. **/
/* Adapted from https://stackoverflow.com/questions/47860812/deleting-all-documents-in-firestore-collection */
function resetVotes(groupID, resetBtn) {
    resetBtn.addEventListener("click", function () {
        let movieDocs = groupRef.doc(groupID).collection("nominatedMovies");

        // deletes all movies in nominatedMovies collection
        movieDocs.onSnapshot((snapshot) => {
            snapshot.docs.forEach((doc) => {
                movieDocs.doc(doc.id).delete()
            })

        });
        // reset group total votes to 0
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
        .then(function (doc) {
            if (doc.data().totalVotes >= members) {

                getWinningMovie(groupID, movieSection, movieCenterTitle, resetBtn);
            }
        })
}

/* Queries groupMembers subcollection to get number of members in group for group-centre.html*/
export function getNumOfMembers(groupID, movieSection, movieCenterTitle, resetBtn) {
    groupRef.doc(groupID).collection("groupMembers").get()
        .then(function (doc) {
            let numOfMembers = doc.size;
            checkVotes(numOfMembers, groupID, movieSection, movieCenterTitle, resetBtn);
        });

}

/* Gets group information from user logged-in, and displays on group-main.html */
export function displayGroups(groupSection) {
    firebase.auth().onAuthStateChanged(function (user) {
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
function renderGroups(id, name, desc, groupSection) {
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
export function getVotes(id, submit, modalBody) {
    submit.addEventListener("click", function () {
        let voteList = [];
        let votes = document.querySelectorAll(".btn-check:checked"); // StackOverflow: https://stackoverflow.com/questions/11599666/get-the-value-of-checked-checkbox

        // gets id's of all checked movies
        votes.forEach(function (vote) {
            voteList.push(vote.id)
        });

        // if movies checked
        if (voteList.length > 0) {
            // Firestore query based on movieId, increments number of votes by one
            voteList.forEach(function (vote) {
                let movie = groupRef.doc(id).collection("nominatedMovies").doc(vote);

                movie.update({
                    numOfVotes: firebase.firestore.FieldValue.increment(1) // from Firestore "Increment a numeric value"
                });
            });
            groupRef.doc(id).update({
                totalVotes: firebase.firestore.FieldValue.increment(1)
            });

            // if no movies checked
        } else {
            modalBody.innerText = "You didn't vote on anything!"
        }

    });
}

/* Show group member list on group-centre.html*/
export function showGroupMembers(groupID, groupInfo) {
    groupRef.doc(groupID).collection("groupMembers").get()
        .then((snap) => {
            let nameList = "";
            snap.forEach(function (doc) {
                nameList += `<p>${doc.data().name}</p>`;
            })
            groupInfo.innerHTML = nameList;
        });
}

/* Displays personalized welcome message and buttons when user logged-in on main.html */
export function welcomeUser() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            usersRef.doc(user.uid).get()
                .then(function (doc) {
                    $("#welcome-msg").text(`Welcome ${doc.data().name}!`);
                    $("#log-status").text("You are now logged in.");
                }).catch(function (err) {
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
    firebase.auth().onAuthStateChanged(function (user) {
        usersRef.doc(user.uid).get()
            .then((doc) => {

                let groupId = [];
                let groupName = [];

                if (doc.data().groupId.length == 0) {
                    groupMsgs.innerHTML = "No Group Chats found.";
                } else {
                    for (let i = 0; i < doc.data().groupId.length; i++) {
                        groupId[i] = doc.data().groupId[i];
                        groupName[i] = doc.data().groupName[i];
                    }
                    renderGroupMsgs(groupId, groupName, groupMsgs)
                }
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
                                        <button id="${id[i]}" type="button" class="btn btn-danger btn-lg enter">Enter Group Chat</button>
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

        // sets group's total votes to large integer
        groupRef.doc(groupID).update({
            totalVotes: 100
        });
        setTimeout(function () {
            window.location = `group-centre.html?${groupID}`;
        }, 500);
    })
}

/* Removes the user from the group and the group from the user's groups. */
export function leaveGroup(groupID, leaveBtn) {
    leaveBtn.addEventListener("click", function (event) {
        event.preventDefault();
        firebase.auth().onAuthStateChanged(function (user) {
            groupRef.doc(groupID).get()
                .then((doc) => {
                    let groupTitle = doc.data().groupName;
                    let groupDesc = doc.data().groupDescription;

                    /* Used Firebase doc https://firebase.google.com/docs/firestore/manage-data/add-data for reference */
                    usersRef.doc(user.uid).update({
                        groupId: firebase.firestore.FieldValue.arrayRemove(groupID),
                        groupName: firebase.firestore.FieldValue.arrayRemove(groupTitle),
                        groupDescription: firebase.firestore.FieldValue.arrayRemove(groupDesc)
                    });

                    // Remove user from groupMembers subcollection
                    groupRef.doc(groupID).collection("groupMembers").doc(user.uid).delete();
                }).catch((err) => {
                    console.log(err);
                });
        });
        setTimeout(function () {
            window.location = `group-main.html`;
        }, 3000);
    });
}

//get username info from firebase
export function getUser() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("users")
                .doc(user.uid)
                .get()
                .then(function (doc) {
                    var n = doc.data().name;
                    $("#username").text(n);
                })
        } else {
            console.log("no user is signed in");
        }
    })
}

/* adds movie to user's favourite movies list */
export function addFavourite() {
    var addFavBtn = $("#Addfavourite").text();
    firebase.auth().onAuthStateChanged(function (user) {
        // if user logged in
        if (user) {
            let movieId = sessionStorage.getItem('movieId');

            // Access movie info from OMDB
            axios.get('https://www.omdbapi.com?i=' + movieId + '&apikey=5623718')
                .then((response) => {

                    // changes button text when clicked 
                    // adds/removes movie to user's favourite movie list.
                    if (addFavBtn.localeCompare('Remove Favourite') != 0) {
                        db.collection("users").doc(user.uid).update({
                            "favouriteLists": firebase.firestore.FieldValue.arrayUnion(movieId),
                        });
                        $('#Addfavourite').text('Remove Favourite');
                        addFavBtn = $("#Addfavourite").text();
                    } else if (addFavBtn.localeCompare("Remove Favourite") == 0) {
                        db.collection("users").doc(user.uid).update({
                            "favouriteLists": firebase.firestore.FieldValue.arrayRemove(movieId),
                        });
                        $('#Addfavourite').text('Add Favourite');
                        addFavBtn = $("#Addfavourite").text();
                    }
                });
        };
    });
}

/* Hide log-in and show log-out buttons if user is logged in. */
export function logHeaderStatus() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            usersRef.doc(user.uid).get()
                .then(function () {
                    $("#logInBtn").hide();
                    $("#logOutBtn").show();
                }).catch(function (err) {
                    console.log(err);
                });
        }
    });
}


/** Submits a review to movies collection on post-review.html */
export function submitReview(movieID, submitBtn, message, errorMessage) {
    submitBtn.addEventListener("click", function (e) {
        e.preventDefault();
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                if (message.value !== "") {
                    db.collection("movies")
                        .add({
                            userID: user.uid,
                            imdbID: movieID,
                            userName: user.displayName,
                            message: message.value,
                            date: new Date()
                        })
                        .then(usercommentsRef => {
                            console.log("Document written!");
                        })
                        .catch(function (error) {
                            console.error('Error adding document: ', error);
                        });
                    errorMessage.classList.remove("show");
                    message.value = "";
                } else {
                    errorMessage.classList.add("show");
                }
            }
        });
    })
}


/** Displays reviews for specific movie on post-review.html */
export function displayReviews(movieID, dataArea) {
    let movies = db.collection("movies");
    let moviesQuery = movies.where("imdbID", "==", movieID);

    // indexes movies collection and orders reviews by date
    moviesQuery.orderBy("date")
        .onSnapshot(querySnapshot => {
            let messages = [];
            querySnapshot.forEach(chat => {
                messages.push(chat.data());
            });
            if (messages.length !== 0) {
                dataArea.innerHTML = "";
            } else {
                dataArea.innerHTML = "<p class='msg'>No Reviews Yet</p>";
            }
            for (let i = 0; i < messages.length; i++) {
                const createdOn = new Date(messages[i].date.seconds * 1000);

                // displays reviews
                dataArea.innerHTML += `
                                    <article style= "background-color:rgb(95, 15, 15);">
                                      <p class="review" style = "color: white">${messages[i].message}</p>
                                  <div class="float-right">
                                      <span style = "color: white" class="">
                                          ${messages[i].userName}
                                      </span>
                                      <span style = "color: white" class="">
                                          ${formatDate(createdOn)}
                                      </span>
                                  </div>    
                              </article>`;
            }
        });
}

// A function for formatting a date to DD Month YY - HH:mm
const formatDate = d => {
    // Months array to get the month in string format
    const months = new Array(
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    );
    // get the month
    const month = d.getMonth();
    // get the day
    const day = d.getDate();
    // get the year
    let year = d.getFullYear();
    // get the hours
    const hours = d.getHours();
    // get the minutes
    const minutes = ("0" + d.getMinutes()).slice(-2);
    //return the string "DD Month YY - HH:mm"
    return (
        day + " " + months[month] + " " + year + " - " + hours + ":" + minutes
    );
};

//get current user for reading user email.
export function getUserEmail() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection("users").doc(user.uid).get().then((s) => {
                $("#fullName").append(s.data().name);
                $("#email").append(user.email);
            });
        }
    });
}

//displays user profile when user is logged in
export function displayUserProfile() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var originalPhone;
            var originalAge;
            var originalName;
            db.collection("users").doc(user.uid).get().then((s) => {
                originalName = s.data().name;
                originalAge = s.data().age;
                originalPhone = s.data().phone;
                $('#name').attr("placeholder", originalName);
                $('#name').attr("value", originalName);
                $('#age').attr("placeholder", originalAge);
                $('#age').attr("value", originalAge);
                $('#phone').attr("placeholder", originalPhone);
                $('#phone').attr("value", originalPhone);
            });
        };
    });
}

//updates user profile information
export function saveUserProfile() {
    $("#saveBtn").click(function (event) {
        var n = document.getElementById('name');
        var age = document.getElementById('age');
        var phone = document.getElementById('phone');
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                db.collection("users").doc(user.uid).update({
                    "name": n.value,
                    "age": age.value,
                    "phone": phone.value,
                });
            }
        });
        alert("Changes Saved!");
    });
}

/* Displays the user's favourite movie list */
export function displayFavList() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var favList;

            // gets user's favourite movie list
            db.collection("users").doc(user.uid).get().then((s) => {
                favList = s.data().favouriteLists;
                favList.forEach(element => {

                    // gets movie information for each item on list
                    axios.get('https://www.omdbapi.com?i=' + element + '&apikey=6753c87c')
                        .then((response) => {
                            let movie = response.data;
                            $("#favTable").append(`
                                <tr id = "movie` + element + `" >
                                    <th><a class="link-light" id="` + element + `" style="cursor: pointer;">` + movie.Title + `<a></th>
                                    <th>` + movie.Released + `</th> 
                                    <th>` + movie.Genre + `</th>
                                    <th><button class="removeFav btn btn-danger " 
                                    onClick="setTimeout(function () { 
                                        location.reload();
                                      }, 400);" 
                                    value="` + element + `">X</button></th>
                                
                                </tr>
                            `);
                        });
                });
            });
        };
    });
}

/* User can delete the movie in favourite list and click the name to see the details on profile_favourite.html*/
export function favListDetails() {
    $(document).ready(() => {
        var el = document.getElementById('favTable');
        if (el) {
            el.addEventListener("click", function (event) {
                var movieId = $(el).val();
                if (event.target.value !== undefined) {
                    firebase.auth().onAuthStateChanged(function (user) {
                        if (user) {

                            // deletes specific movie from user's list
                            db.collection("users").doc(user.uid).update({
                                "favouriteLists": firebase.firestore.FieldValue.arrayRemove(event.target.value),
                            });
                        }
                    });
                    //if user click the name, redirected to details page
                } else if (event.target.id !== undefined && event.target.id.trim() != "") {
                    movieSelected(event.target.id);
                }
            });
        }
    });
}

//redirect to the detail page
function movieSelected(id) {
    sessionStorage.setItem('movieId', id);
    window.location = "movieresult.html?" + id;
    return false;
}