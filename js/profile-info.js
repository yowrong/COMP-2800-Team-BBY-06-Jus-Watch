
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

var n = document.getElementById('name');
var age = document.getElementById('age');
var email = document.getElementById('email');
const db = firebase.firestore();
var addBtn = document.getElementById('saveBtn');
$(addBtn).click(function (event) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection('users').doc(user.uid).update({
                name:n.value,
                age: age.value,
                email: email.value,
            });
        }
    });
});


