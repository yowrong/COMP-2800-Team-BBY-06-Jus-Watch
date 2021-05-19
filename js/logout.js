const logOutBtn = document.getElementById("logOutBtn");

logOutBtn.addEventListener("click", () => {
    firebase.auth().signOut().then(() => {
        console.log("You are logged out.");
    }).catch((err) => {
        console.log(err);
    });
});