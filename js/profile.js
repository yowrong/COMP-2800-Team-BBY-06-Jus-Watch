var db = firebase.firestore(); 
// const { user } = require("firebase-functions/lib/providers/auth");
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

//get current user for reading user email.
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        db.collection("users").doc(user.uid).get().then((s) => {
            $("#fullName").append(s.data().name);
            $("#email").append(user.email);
        });
    }
});