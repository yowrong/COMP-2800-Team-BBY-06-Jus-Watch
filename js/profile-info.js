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
