import { getGroup } from "./firebase-queries.js";

// retrieves group ID from URL
let string = decodeURIComponent(window.location.search);        // from "10b Lecture Javascript Relevant Bits-1"
let query = string.split("?");                                  // Projects 1800 lecture slides
let groupID = query[1];
const inviteMsg = document.getElementById("inviteMsg");

getGroup(groupID, inviteMsg);