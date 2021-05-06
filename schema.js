const group = {
    groupId: "",
    groupName: "",
    groupDescription: "",
    groupLink: "",  // groupID? or other sort of link
                    // once a user accesses the group link, they get added to groupMembers collection

    groupMembers = { // collection of members
        member1 = { // document of each member
            user: user.uid,
            userFirstName: "",
            userLastName: ""
        }
    },
    hostOnly: false, //only host can add/nominate movies, may be a "nice to have" feature
    groupMessages = {   // collection of messages
        message1 = {    // document of each message
            user: user.uid,
            userFirstName: "",
            movieTitle: "", //have an input section on messages for movie title?
            message: "",
            date: new firebase.firestore.Timestamp.fromDate(new Date())
        }   
    },
    nominatedMovies = {  // collection
        movie1 = {      // document of each movie
            movieTitle = "",        // pull information from a movie database??
            movieDescription = "",
            movieRating = "",
            moviePoster = "",
            numOfVotes = 0,
            chosen = false
        }
    },
    chosenMovie = "",
}

const movie = {
    
}