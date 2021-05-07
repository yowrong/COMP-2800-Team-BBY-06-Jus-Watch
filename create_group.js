const db = firebase.firestore();
groupRef = db.collection("groups");

const groupName = document.getElementById("groupName");
const groupDesc = document.getElementById("groupDescription");


function createGroup(name, desc) {
    groupRef.add({
        groupName: name.value,
        groupDescription: desc.value
    })
    .then((doc) => {
        console.log("Group written:", doc.id);
    })
    .catch((error) => {
        console.log(error);
    });
}
createGroup(groupName, groupDesc);
