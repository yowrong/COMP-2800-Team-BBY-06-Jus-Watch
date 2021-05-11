import { displayMsgs, sendMsg } from "./firebase-queries.js";

displayMsgs();

const msgToSend = document.getElementById("sendMsg");

sendBtn.addEventListener("click", function (event) {
    event.preventDefault();
    sendMsg(msgToSend);
});