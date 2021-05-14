document.body.innerHTML =
    `<div>'
        <div id="group-list"></div>
    </div>`;

let groupSection = document.getElementById("group-list");
let name = ["Test Movie"];
let desc = ["Test Description"];
let id = ["Test ID"];

function renderWinningMovie(title, desc, year, id, pic, movies) {
    let movieCard = "";

        movieCard += `<div class="card winningMovie">
        <img src="${pic}" class="card-img-top" alt="${title}">
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">${desc}</p>
        </div>
        <div class="card-footer">
      <small class="text-muted">${year}</small>
    </div>
      </div>`;

    movies.innerHTML = movieCard;
    movieCenterTitle.innerText = "Movie of the Week"
}