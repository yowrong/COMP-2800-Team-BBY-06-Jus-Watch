document.body.innerHTML =
    `<div>'
        <div id="movieList"></div>
    </div>`;

let title = ["Test Movie"];
let desc = ["Test Description"];
let year = ["0000"];
let id = ["Test Id"];
let pic = ["www.testlink.com"];
let movies = document.getElementById("movieList");


function renderMovies(title, desc, year, id, pic, movies) {
    let movieCard = `<div class="card-group">`;

    for (let i = 0; i < id.length; i++) {
        movieCard += `<div class="card">
        <img src="${pic[i]}" class="card-img-top" alt="${title[i]}">
        <div class="card-body">
            <h5 class="card-title">${title[i]}</h5>
            <p class="card-text">${desc[i]}</p>
            <p class="card-text"><small class="text-muted">${year[i]}</small></p>
            <input type="checkbox" class="btn-check" id="${id[i]}" autocomplete="off">
            <label class="btn btn-outline-primary" for="${id[i]}">Vote</label><br>
        </div>
        </div>`;
    }
    movieCard += "</div>";
    movies.innerHTML = movieCard;
}

test("Sets movie's innerHTML to display movie cards", () => {
    renderMovies(title, desc, year, id, pic, movies);

    expect(movies.innerHTML).toEqual(`<div class="card-group"><div class="card">
        <img src="${pic[0]}" class="card-img-top" alt="${title[0]}">
        <div class="card-body">
            <h5 class="card-title">${title[0]}</h5>
            <p class="card-text">${desc[0]}</p>
            <p class="card-text"><small class="text-muted">${year[0]}</small></p>
            <input type="checkbox" class="btn-check" id="${id[0]}" autocomplete="off">
            <label class="btn btn-outline-primary" for="${id[0]}">Vote</label><br>
        </div>
        </div></div>`);
});