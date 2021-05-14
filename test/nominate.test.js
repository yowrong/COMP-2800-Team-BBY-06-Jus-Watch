// import { expect } from "@jest/globals";
const { expect } = require("@jest/globals");
const fetch = require("node-fetch");

document.body.innerHTML =
    `<div>'
        <div id="searchResults"></div>
    </div>`;

let searchResultsDiv = document.getElementById('searchResults');
let search = "batman";
let titles = [];
let years = [];
let posters = [];
let ids = [];

function searchOMDB(search) {
    // adapted from https://stackoverflow.com/questions/33237200/fetch-response-json-gives-responsedata-undefined

    fetch(`http://www.omdbapi.com/?s=${search}&apikey=6753c87c`)
    .then((response) => {
       return response.json() 
    })
    // returns array of search results
    .then((responseData) => { 

        let searchResults = responseData.Search;

        // loop through search results and grab movie info
        searchResults.forEach(function(movie) {
            titles.push(movie.Title)
            years.push(movie.Year)
            posters.push(movie.Poster)
            ids.push(movie.imdbID)
        })

        // Jest assertions
        expect(titles).toEqual(['Batman Begins', 'Batman v Superman: Dawn of Justice', 'Batman', 'Batman Returns', 'Batman Forever', 'Batman & Robin', 'The Lego Batman Movie', 'Batman: The Animated Series', 'Batman: Under the Red Hood', 'Batman: The Dark Knight Returns, Part 1']);
        expect(years).toEqual(['2005', '2016', '1989', '1992', '1995', '1997', '2017', '1992–1995', '2010', '2012']);
        expect(posters).toEqual(['https://m.media-amazon.com/images/M/MV5BOTY4YjI2N2MtYmFlMC00ZjcyLTg3YjEtMDQyM2ZjYzQ5YWFkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
            'https://m.media-amazon.com/images/M/MV5BYThjYzcyYzItNTVjNy00NDk0LTgwMWQtYjMwNmNlNWJhMzMyXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
            'https://m.media-amazon.com/images/M/MV5BMTYwNjAyODIyMF5BMl5BanBnXkFtZTYwNDMwMDk2._V1_SX300.jpg',
            'https://m.media-amazon.com/images/M/MV5BOGZmYzVkMmItM2NiOS00MDI3LWI4ZWQtMTg0YWZkODRkMmViXkEyXkFqcGdeQXVyODY0NzcxNw@@._V1_SX300.jpg',
            'https://m.media-amazon.com/images/M/MV5BNDdjYmFiYWEtYzBhZS00YTZkLWFlODgtY2I5MDE0NzZmMDljXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
            'https://m.media-amazon.com/images/M/MV5BMGQ5YTM1NmMtYmIxYy00N2VmLWJhZTYtN2EwYTY3MWFhOTczXkEyXkFqcGdeQXVyNTA2NTI0MTY@._V1_SX300.jpg',
            'https://m.media-amazon.com/images/M/MV5BMTcyNTEyOTY0M15BMl5BanBnXkFtZTgwOTAyNzU3MDI@._V1_SX300.jpg',
            'https://m.media-amazon.com/images/M/MV5BOTM3MTRkZjQtYjBkMy00YWE1LTkxOTQtNDQyNGY0YjYzNzAzXkEyXkFqcGdeQXVyOTgwMzk1MTA@._V1_SX300.jpg',
            'https://m.media-amazon.com/images/M/MV5BNmY4ZDZjY2UtOWFiYy00MjhjLThmMjctOTQ2NjYxZGRjYmNlL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg',
            'https://m.media-amazon.com/images/M/MV5BMzIxMDkxNDM2M15BMl5BanBnXkFtZTcwMDA5ODY1OQ@@._V1_SX300.jpg']);
        expect(ids).toEqual(['tt0372784', 'tt2975590', 'tt0096895', 'tt0103776', 'tt0112462', 'tt0118688', 'tt4116284', 'tt0103359', 'tt1569923', 'tt2313197']);
        // renderSearchResults(titles, years, posters, ids, "group1", searchResultsDiv);               // need to update to 
                                                                                                    // include groupID

    })
    .catch(function(err) {
        console.log(err);
    })
}

let title = ['Test Movie'];
let year = ['0000'];
let poster = ['www.testlink.com'];
let movieId = ['TestId'];
let groupId = 'TestGroup';

function renderSearchResults(title, year, poster, movieId, groupId, searchResultsDiv) {
    let card = "";

    for (let i = 0; i < movieId.length; i++) {
        card += `<div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
            <div class="col-md-4">
                <img src="${poster[i]}" alt="${title[i]}" style="max-width: 100%">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${title[i]}</h5>
                    <p class="card-text">${year[i]}</p>
                    <p class="card-text">
                        <a href="group_centre.html?${groupId}">
                            <button type="button" class="btn btn-primary btn-lg nominateBtn" id="${movieId[i]}">Nominate</button>
                        </a>
                    </p>
                </div>
            </div>
        </div>
        </div>`

    }
    searchResultsDiv.innerHTML = card;
}


test("Search results from OMDB API", () => {
    searchOMDB(search);
})

test("Sets searchResultsDiv's innerHTML to display movie information", () => {
    renderSearchResults(title, year, poster, movieId, groupId, searchResultsDiv);

    expect(searchResultsDiv.innerHTML).toEqual(`<div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
            <div class="col-md-4">
                <img src="www.testlink.com" alt="Test Movie" style="max-width: 100%">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">Test Movie</h5>
                    <p class="card-text">0000</p>
                    <p class="card-text">
                        <a href="group_centre.html?TestGroup">
                            <button type="button" class="btn btn-primary btn-lg nominateBtn" id="TestId">Nominate</button>
                        </a>
                    </p>
                </div>
            </div>
        </div>
        </div>`);
});