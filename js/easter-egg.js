document.body.addEventListener('onload', focus());
const entireDiv = document.getElementById('curtain');

showTime();

/* Clicking on screen to stop animation */
$("body").click(function () {
    window.location = "search.html";
    console.log('clicled');
})

/* Trigger movie curtain animation */
// Adapted from https://codepen.io/alexisr/pen/dJmpdR
function showTime() {
    var curtain = document.getElementById("curtain");
    curtain.className = "open";

    var scene = document.getElementById("scene");
    scene.className = "expand";

    var starter = document.getElementById("starter");
    starter.className = "fade-out";

    setTimeout(function () {
        starter.style.display = 'none';
    }, 2000);
}