const db = firebase.firestore();
const usersRef = db.collection("users");
const groupRef = db.collection("groups");
const groupsRef = db.collection("groups");

export function createUser() {
    firebase.auth().onAuthStateChanged(function(user) {
        usersRef.doc(user.uid).get()
        .then((docSnapshot) => {
            if(!docSnapshot.exists) {
                usersRef.doc(user.uid).set({
                    name: user.displayName,
                    email: user.email,
                    uid: user.uid
                });
            }
        });
    });
}

export function displayMsgs() {
    groupRef.doc("group1").collection("groupMessages").get()
    .then(querySnapshot => {
        querySnapshot.forEach(doc => {
            let msg = `<h3>${doc.data().sentBy}</h3><p>${doc.data().message}</p><aside>${doc.data().sentAt}</aside>`;
            $("#messages").append(msg);
            console.log(doc.id, " => ", doc.data());
        });
    });
}

export function sendMsg(msgToSend) {
    firebase.auth().onAuthStateChanged(function(user) {
        usersRef.doc(user.uid).get()
        .then(function (doc) {
            const userName = doc.data().name;
            groupsRef.doc("group1").collection("groupMessages").add({
                sentBy: userName,
                sentAt: Date.now(),
                message: msgToSend.value
            });
            // .then(() => {
            //     window.location.href = "schedule.html";
            // });
        })
    });
}