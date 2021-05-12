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

var fn = document.getElementById('firstName');
var ln = document.getElementById('lastName');
var age = document.getElementById('age');
var contactEmail = document.getElementById('email');
var address = document.getElementById('address');
const db = firebase.firestore();
var addBtn = document.getElementById('saveBtn');
$(addBtn).click(function (event) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.collection('users').doc(user.uid).update({
                FirstName: fn.value,
                LastName: ln.value,
                name:fn.value + ' ' + ln.value,
                age: age.value,
                contactEmail: contactEmail.value,
                address: address.value,
            });
        }
    });
});


