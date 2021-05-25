import { getGroupforGroupCentre, getNumOfMembers, showGroupMembers, endVoting, leaveGroup } from "./firebase-queries.js";

let string = decodeURIComponent(window.location.search); // from "10b Lecture Javascript Relevant Bits-1"
let query = string.split("?"); // Projects 1800 lecture slides
let groupID = query[1];

const share = document.getElementById("shareLink");
const groupName = document.getElementById('group-name');
const groupDesc = document.getElementById('group-description');
const voteBtn = document.getElementById('voteBtn');
const nominateBtn = document.getElementById('nominateBtn');
const chatBtn = document.getElementById('chatBtn');
const movieSection = document.getElementById('movieList');
const movieCenterTitle = document.getElementById('movieCenterTitle');
const groupInfo = document.getElementById('groupInfo');
const resetBtn = document.getElementById('resetBtn');
const endVoteBtn = document.getElementById('endVoteBtn');
const leaveBtn = document.getElementById('leaveBtn');
const copyBtn = document.getElementById('copyBtn');

//https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line
function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

showGroupMembers(groupID, groupInfo);

getNumOfMembers(groupID, movieSection, movieCenterTitle, resetBtn);

endVoting(groupID, endVoteBtn);

leaveGroup(groupID, leaveBtn);

getGroupforGroupCentre(groupID, movieSection, groupName, groupDesc)

/* Generates correct links for the buttons */
function shareLink(groupID) {
    share.setAttribute("value", `https://jus-watch.web.app/invite.html?${groupID}`); // *** need to change to hosted link         
    nominateBtn.addEventListener("click", function (e) {
        e.preventDefault;
        window.location.href = `nominate.html?${groupID}`;
    })
    voteBtn.addEventListener("click", function (e) {
        e.preventDefault;
        window.location.href = `vote.html?${groupID}`;
    })
    chatBtn.addEventListener("click", function (e) {
        e.preventDefault;
        window.location.href = `group-msgs.html?${groupID}`;
    })
}

shareLink(groupID);

/* Copies group invite link to clipboard */
/* Adapted from https://www.w3schools.com/howto/howto_js_copy_clipboard.asp */
copyBtn.addEventListener('click', function() {
    share.select();
    share.setSelectionRange(0, 9999);
    document.execCommand('copy');
    alert("Link copied!");
});
