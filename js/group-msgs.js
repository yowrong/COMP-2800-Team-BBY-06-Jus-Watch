import { displayMsgs, sendMsg } from "./firebase-queries.js";

let string = decodeURIComponent(window.location.search);        // from "10b Lecture Javascript Relevant Bits-1"
let query = string.split("?");                                  // Projects 1800 lecture slides
let groupID = query[1];

displayMsgs(groupID);

// // Function to keep overflow scrolling at bottom of div
// // Source: https://stackoverflow.com/questions/40903462/how-to-keep-a-scrollbar-always-bottom
// const messages = document.querySelector('#messages');
// messages.scrollTop = messages.scrollHeight - messages.clientHeight;

const msgToSend = document.getElementById("sendMsg");

sendBtn.addEventListener("click", function (event) {
    event.preventDefault();
    sendMsg(msgToSend);

    setTimeout(function() {
        $("#sendMsg").val('');
    }, 500);
});