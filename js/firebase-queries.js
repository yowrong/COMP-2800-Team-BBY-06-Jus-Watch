const db = firebase.firestore();
const usersRef = db.collection("users");

export function createUser() {
    firebase.auth().onAuthStateChanged(function(user) {
        usersRef.doc(user.uid).get()
        .then((docSnapshot) => {
            if(!docSnapshot.exists) {
                usersRef.doc(user.uid).set({
                    name: user.displayName,
                    email: user.email,
                    uid: user.uid,
                    groupDescription: "",
                    groupId: "",
                    groupName: ""
                });
            }
        });
    });
}