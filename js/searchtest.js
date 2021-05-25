new_element = document.createElement("link");
new_element.setAttribute("rel", "stylesheet");
new_element.setAttribute("type", "text/css");
new_element.setAttribute("href", "./css/search.css");
document.body.appendChild(new_element);

$(document).ready(() => {
    $('#searchBar').on('submit', (e) => {
        let myInput = $('#myInput').val();
        if (myInput === 'juswatch') {
            window.location = 'easter.html';
        } else {
            getMovies(myInput);
        }
        e.preventDefault();
    });
    $('#search').on('click', (e) => {
        let myInput = $('#myInput').val();
        if (myInput === 'juswatch') {
            window.location = 'easter.html';
        } else {
            getMovies(myInput);
        }
        e.preventDefault();
    });
    $('#random').on('click', function (e) {
        e.preventDefault();
        getRandomMovie();
    })
});

function getMovies(myInput) {
    axios.get('http://www.omdbapi.com?s=' + myInput + '&apikey=6753c87c')
        .then((response) => {
            console.log(response);
            let movies = response.data.Search;
            let output = '';
            $.each(movies, (index, movie) => {
                output += `
            <a onclick="movieSelected('${movie.imdbID}')" class="nav-link text-white" href="#">
            <div class="movie_card" style="width: 18rem;margin: 0 auto;>
              <div class="card h-100">
                <img src="${movie.Poster}"  class="poster">
                <div class="card-body">
                <h5>${movie.Title}</h5>
                </div>
              </div>
            </div>
          </a>
          `;
            });

            $('#movies').html(output);
        })
        .catch((err) => {
            console.log(err);
        });
}

function movieSelected(id) {
    sessionStorage.setItem('movieId', id);
    window.location = "movieresult.html";
    // window.location.href = "/movieresult.html";
    return false;
}

function getMovie() {
    let movieId = sessionStorage.getItem('movieId');

    axios.get('http://www.omdbapi.com?i=' + movieId + '&apikey=6753c87c')
        .then((response) => {
            console.log(response);
            let movie = response.data;

            let output = `
          <div class="row">
            <div class="col-md-4">
              <img src="${movie.Poster}" class="thumbnail">
            </div>
            <div class="col-md-8">
              <h2  style = "color: white">${movie.Title}</h2>
              <ul class="list-group">
                <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
                <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
                <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
                <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
                <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
                <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
                <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
              </ul>
            </div>
          </div>
          <div class="row">
            <div class="well">
              <h3 style = "color: white" >Plot</h3>
              <p style = "color: white">${movie.Plot}</p>
              <hr>
              <a href="post-review.html" target="_blank" class="btn btn-primary">Leave a Command</a>
              <a href="profile_favorite.html" class="btn btn-primary">Favorite</a>
            </div>
          </div>
        `;

            $('#movie').html(output);

        })
        .catch((err) => {
            console.log(err);
        });
}

/* Uses the OMDB API to randomly generate a movie suggestion */
// function getRandomMovie() {
//     let movieID = "tt";
//     let imdbID = "" + Math.floor(Math.random() * 100000);

//     while (imdbID.length < 7) {
//         let num = 0 /*Math.floor(Math.random() * 5)*/;
//         imdbID = num + imdbID;
//     }

//     console.log(movieID + imdbID);

//     // Continuously fetch until a satisfactory movie is generated
//     // Source: https://stackoverflow.com/questions/45008330/how-can-i-use-fetch-in-while-loop
//     axios.get('http://www.omdbapi.com?i=' + movieID + imdbID + '&apikey=6753c87c')
//         .then((response) => {

//             console.log(response);

//             let movie = response.data;
            
//             if (movie.Error) {
                
//                 getRandomMovie();

//             } else {
//                 // let numVotes = parseInt(movie.imdbVotes);
//                 // console.log(numVotes);

//                 if (movie.Rated === "X" || movie.Plot === "N/A" || movie.Poster === "N/A" /*|| numVotes < 1000 || isNaN(numVotes)*/) {

//                     getRandomMovie();

//                 } else {
                
//                     let output = `
//                         <div class="row">
//                             <div class="col-md-4">
//                                 <img src="${movie.Poster}" class="thumbnail">
//                             </div>
//                             <div class="col-md-8">
//                                 <h2 style = "color: white">${movie.Title}</h2>
//                                     <ul class="list-group">
//                                     <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
//                                     <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
//                                     <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
//                                     <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
//                                     <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
//                                     <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
//                                     <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
//                                 </ul>
//                             </div>
//                             </div>
//                             <div class="row">
//                             <div class="well">
//                                 <h3 style = "color: white" >Plot</h3>
//                                 <p style = "color: white">${movie.Plot}</p>
//                                 <hr>
//                                 <a href="post-review.html" target="_blank" class="btn btn-primary">Leave a Command</a>
//                                 <a href="profile_favorite.html" class="btn btn-primary">Favorite</a>
//                             </div>
//                         </div>`;

//                     $('#movie').html(output);
//                 }
//             }
//         }).catch((err) => {
//             console.log(err);
//         });
// }

 /* https://code.tutsplus.com/tutorials/parsing-a-csv-file-with-javascript--cms-25626 */
function getRandomMovie() {
    $.ajax({
        url: 'https://raw.githubusercontent.com/peetck/IMDB-Top1000-Movies/master/IMDB-Movie-Data.csv',
        dataType: 'text',
      }).done(successFunction);
    
      function successFunction(data) {
        var movie = [];
        let randomMovie = "";
    
    
        let movieRow = data.split(/\r?\n|\r/);
        for (let i = 1; i < movieRow.length; i++) {
          let movieItems = movieRow[i].split(',');
          movie.push(movieItems[1]);
    
        }
        let number = Math.floor(Math.random() * 1000)
    
        randomMovie = movie[number];
    
       
    
        getOMDBInfo(randomMovie);
          
      }
    
      function getOMDBInfo(randomMovie) {
        axios.get('https://www.omdbapi.com?t=' + randomMovie + '&apikey=6753c87c')
        .then((response) => {
    
          let movie = response.data;
    
          console.log("omdb call:" + movie.Title);

                              let output = `
                        <div class="row">
                            <div class="col-md-4">
                                <img src="${movie.Poster}" class="thumbnail">
                            </div>
                            <div class="col-md-8">
                                <h2 style = "color: white">${movie.Title}</h2>
                                    <ul class="list-group">
                                    <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
                                    <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
                                    <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
                                    <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
                                    <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
                                    <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
                                    <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
                                </ul>
                            </div>
                            </div>
                            <div class="row">
                            <div class="well">
                                <h3 style = "color: white" >Plot</h3>
                                <p style = "color: white">${movie.Plot}</p>
                                <hr>
                                <a href="post-review.html" target="_blank" class="btn btn-primary">Leave a Command</a>
                                <a href="profile_favorite.html" class="btn btn-primary">Favorite</a>
                            </div>
                        </div>`;

                    $('#movie').html(output);
                })
        .catch((err) => {
            console.log(err);
        });
    }
}