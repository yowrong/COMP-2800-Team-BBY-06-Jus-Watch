/* Adapted from https://codepen.io/alexisr/pen/dJmpdR */

//document.getElementById("starter").focus();
document.body.addEventListener('onload', focus());
// document.addEventListener('keydown', detectSpaceKey);

// const searchBtn = document.getElementById('myBtn');
// const search = document.getElementById('myInput');

// searchBtn.addEventListener('click', function(e) {
// 	e.preventDefault();
// 	if (search.value === "juswatch") {
// 		showTime();
// 	}

// })

// function detectSpaceKey(event)
// {
// 	if(event.keyCode == 13) {
// 		showTime();
// 	}
// }

// function showTime()
// {
// 	var curtain = document.getElementById("curtain");
// 	curtain.className = "open";
	
// 	var scene = document.getElementById("scene");
// 	scene.className = "expand";
	
// 	var starter = document.getElementById("starter");
// 	starter.className = "fade-out";
	
// 	setTimeout(function() {
//         starter.style.display = 'none';
//     }, 2000);
// }