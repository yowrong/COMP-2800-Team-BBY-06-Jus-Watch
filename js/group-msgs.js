import { displayMsgs, sendMsg } from "./firebase-queries.js";

let string = decodeURIComponent(window.location.search);        // from "10b Lecture Javascript Relevant Bits-1"
let query = string.split("?");                                  // Projects 1800 lecture slides
let groupID = query[1];

displayMsgs(groupID);

const msgToSend = document.getElementById("sendMsg");

sendBtn.addEventListener("click", function (event) {
    event.preventDefault();
    sendMsg(msgToSend, groupID);

    // Set display to bottom of messages when a new message is sent
    // Source: https://stackoverflow.com/questions/270612/scroll-to-bottom-of-div
    let msgWindow = document.getElementById("messages");
    msgWindow.scrollTop = msgWindow.scrollHeight;

    setTimeout(function() {
        $("#sendMsg").val('');
    }, 500);
});