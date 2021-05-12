const db = firebase.firestore();
const usersRef = db.collection("users");
const groupRef = db.collection("groups");

export function createUser() {
    firebase.auth().onAuthStateChanged(function(user) {
        usersRef.doc(user.uid).get()
        .then((docSnapshot) => {
            if(!docSnapshot.exists) {
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
            groupRef.doc("group1").collection("groupMessages").add({
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

// takes values inputted on create_group page and writes to Firestore
export function createGroup(name, desc) {
    // writes to group collection
    groupRef.add({
        groupName: name.value,
        groupDescription: desc.value,
        chosenMovie: "",
    })
    .then((doc) => {
        // writes group information to users collection
        usersRef.doc("Bjak8WiHFRY52ScuYiVfgcDPmps1").set({
            groupId: firebase.firestore.FieldValue.arrayUnion(doc.id),              // from Firebase website, adds to array
            groupName: firebase.firestore.FieldValue.arrayUnion(name.value),
            groupDescription: firebase.firestore.FieldValue.arrayUnion(desc.value)
        }, { merge: true });
    })
    .catch((error) => {
        console.log(error);
    });
}

// gets group information from user logged-in, and displays
export function displayGroups(groupSection) {
    usersRef.doc("Bjak8WiHFRY52ScuYiVfgcDPmps1").get()
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
        console.log("groups: " + groupId + " " + groupName + " " + groupDesc);
    })
}

// renders a "Group" card for each group the user is in
function renderGroups(id, name, desc, groupSection) {
    let groupCard = "";
    for (let i = 0; i < id.length; i++) {

        // Bootstrap card template, "Enter Group" button redirects to Group Center page
        groupCard += `<div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
          <div class="col-md-4">
            <!-- <img src="..." alt="..."> -->
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${name[i]}</h5>
              <p class="card-text">${desc[i]}</p>
              <a href="./index.html?${id[i]}">
              <button id="${id[i]}" type="button" class="btn btn-primary btn-lg enter">Enter Group</button>
              </a>
            </div>
          </div>
        </div>
      </div>`;
    groupSection.innerHTML = groupCard;
    }
}