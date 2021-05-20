import { displayGroupMsgs } from "./firebase-queries.js";

let string = decodeURIComponent(window.location.search);        // from "10b Lecture Javascript Relevant Bits-1"
let query = string.split("?");                                  // Projects 1800 lecture slides
let groupID = query[1];
let groupMsgs = document.getElementById("group-msgs");

displayGroupMsgs(groupMsgs);