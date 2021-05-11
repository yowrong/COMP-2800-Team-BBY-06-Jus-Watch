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

export function displayMsgs(groupID) {
    firebase.auth().onAuthStateChanged(function(user) {
        groupRef.doc("group1").collection("groupMessages")
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
                }
            });
        });
    });
}

export function sendMsg(msgToSend) {
    firebase.auth().onAuthStateChanged(function(user) {
        usersRef.doc(user.uid).get()
        .then(function (doc) {
            const userName = doc.data().name;
            //Intl.DateTimeFormat() constructor from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
            const date = new Intl.DateTimeFormat("en", {
                dateStyle: "short",
                timeStyle: "medium"
            }).format(Date.now());
            groupsRef.doc("group1").collection("groupMessages").add({
                sentBy: userName,
                sentAt: date,
                message: msgToSend.value,
                uid: user.uid
            });
            // .then(() => {
            //     window.location.href = "schedule.html";
            // });
        })
    });
}