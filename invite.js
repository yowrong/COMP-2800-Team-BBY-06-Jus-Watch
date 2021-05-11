// retrieves group ID from URL
let string = decodeURIComponent(window.location.search);        // from "10b Lecture Javascript Relevant Bits-1"
let query = string.split("?");                                  // Projects 1800 lecture slides
let groupID = query[1];



const db = firebase.firestore();
const usersRef = db.collection("users");
const inviteMsg = document.getElementById("inviteMsg");
const groupRef = db.collection("groups");
const share = document.getElementById("shareLink");


// gets group ID, name, and description from invite URL
function getGroup(groupID, inviteMsg) {
  groupRef.doc(groupID).get()
  .then(function(doc) {
    let id = doc.data().groupId;
    let name = doc.data().groupName;
    let desc = doc.data().groupDescription;

    addUser(id, name, desc, inviteMsg);

    console.log("get group:", id + name + desc + inviteMsg)

  })
}

getGroup(groupID, inviteMsg);


// adds user info to groupMember subcollection within specific group collection
// also adds group info to user's document
function addUser(groupID, groupName, groupDesc, inviteSection) {
    firebase.auth().onAuthStateChanged((user) => {

      // user must be logged in
        if (user) {
          console.log(user.uid);
          console.log(user.displayName);
          let userFName = user.displayName.split(' ')[0];
          let userLName = user.displayName.split(' ')[1];

          inviteSection.innerHTML = `<h3>Welcome!</h3>
          <a href="./group_main.html?${groupID}" <button type="button" class="btn btn-primary">
          Click to enter your Group's Page!
          </button>`;

          // adds user info to groupMember subcollection
          groupRef.doc("group1").collection("groupMembers").get()                       // to change "group1" to groupID
          .then(member => {
            
            // if not yet a member, creates a new user document under groupMember collection
              if (!member.exists) {
                groupRef.doc("group1").collection("groupMembers").doc(user.uid).set({
                  userId: user.uid,
                  userFirstName: userFName,
                  userLastName: userLName
                })
              }
          });

          // adds group info to user's document
          usersRef.doc(user.uid).update({
            groupId: firebase.firestore.FieldValue.arrayUnion(groupID),
            groupName: firebase.firestore.FieldValue.arrayUnion(groupName),
            groupDescription: firebase.firestore.FieldValue.arrayUnion(groupDesc)

          })

        } else {
          inviteSection.innerHTML = "<h3>Please Log in first!</h3>"
        }
      });
}


/*********MOVE TO MAIN GROUP PAGE **************/
function shareLink(groupID) {
  share.setAttribute("value", `https://www.JusWatch.com/group_main.html?${groupID}`);
}
shareLink(groupID);

