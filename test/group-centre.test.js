document.body.innerHTML =
    `<div>'
        <h3 id="movieCenterTitle"></h3>
        <div id="movieList"></div>
        <div id="group-name"></div>
        <div id="group-description"></div>
    </div>`;

let movieSection = document.getElementById("movieList");
let movieCenterTitle = document.getElementById("movieCenterTitle");
let groupName = document.getElementById('group-name');
let groupDesc = document.getElementById('group-description');
let title = "Test Movie";
let desc = "Test Description";
let id = "Test ID";
let year = "0000";
let pic = "www.testlink.com";

function renderWinningMovie(title, desc, year, id, pic, movieSection) {
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

    movieSection.innerHTML = movieCard;
    movieCenterTitle.innerText = "Movie of the Week"
}

test("Sets movieSection's innerHTML to display movie information", () => {
    renderWinningMovie(title, desc, year, id, pic, movieSection);

    expect(movieSection.innerHTML).toEqual(`<div class="card winningMovie">
    <img src="${pic}" class="card-img-top" alt="${title}">
    <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${desc}</p>
    </div>
    <div class="card-footer">
        <small class="text-muted">${year}</small>
    </div>
    </div>`);

    expect(movieCenterTitle.innerText).toEqual("Movie of the Week");
});
