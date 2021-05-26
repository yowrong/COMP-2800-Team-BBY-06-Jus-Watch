import { createUser, welcomeUser } from "./firebase-queries.js";

createUser();

setTimeout(function () {
    welcomeUser();
}, 3000);
