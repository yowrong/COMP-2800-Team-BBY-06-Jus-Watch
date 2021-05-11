function getUser(){
    firebase.auth().onAuthStateChanged(function (user) {
        if (user){
            console.log ("user is signed in");
            db.collection("users")
            .doc(user.uid)
            .get()
            .then(function(doc){
                var n = doc.data().full_name;
                console.log(n);
                $("#username").text(n);
            })
        }
        else {
            console.log ("no user is signed in");
        }
    })
}
function readFullName() {
    db.collection("users").doc("kma6w6uPsaMdFPmi4C6gCicJD6w2")
    .onSnapshot(function(snap) {
        console.log(snap.data()); //print the document fields of the user
        console.log(snap.data().full_name);
        document.getElementById("fullName").innerText = snap.data().full_name;
    })
}
 
readFullName();

function readEMail() {
    db.collection("users").doc("")
    .onSnapshot(function(snap) {
        console.log(snap.data()); //print the document fields of the user
        console.log(snap.data().email);
        document.getElementById("email").innerText = snap.data().email;
    })
}
readEMail();