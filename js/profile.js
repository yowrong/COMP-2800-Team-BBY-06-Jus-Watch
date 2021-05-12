const { user } = require("firebase-functions/lib/providers/auth");

function getUser() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("user is signed in");
            db.collection("users")
                .doc(user.uid)
                .get()
                .then(function (doc) {
                    var n = doc.data().name;
                    console.log(n);
                    $("#username").text(n);
                })
        }
        else {
            console.log("no user is signed in");
        }
    })
}

function readFullName() {
    db.collection("users").doc(user.uid)
    .onSnapshot(function(doc) {
        console.log(doc.data()); //print the document fields of the user
        console.log(doc.data().name);
        //document.getElementById("fullName").innerText = snap.data().name;
        document.getElementById("fullName").innerText = doc(user.name);
    })
}
 
readFullName();

function readEMail() {
    db.collection("users").doc(user.uid)
    .onSnapshot(function(snap) {
        console.log(snap.data()); //print the document fields of the user
        console.log(snap.data().email);
        document.getElementById("email").innerText = snap.data().email;
    })
}
readEMail();