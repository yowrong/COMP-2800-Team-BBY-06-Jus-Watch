//document.getElementById("starter").focus();
document.body.addEventListener('onload', focus());
// document.addEventListener('keydown', detectSpaceKey);
const entireDiv = document.getElementById('curtain');
// const openDiv = document.getElementsByClassName('open');

showTime();


$("body").click(function () {
    window.location = "search.html";
    console.log('clicled');
})

// function detectSpaceKey(event)
// {
// 	if(event.keyCode == 13) {
// 		showTime();
// 	}
// }

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