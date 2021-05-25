document.body.addEventListener('onload', focus());
const entireDiv = document.getElementById('curtain');

showTime();

$("body").click(function () {
    window.location = "search.html";
    console.log('clicled');
})

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