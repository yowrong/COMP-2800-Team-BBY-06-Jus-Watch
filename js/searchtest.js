$(document).ready(() => {
    $('#searchBar').on('submit', (e) => {
      let myInput = $('#myInput').val();
      getMovies(myInput);
      e.preventDefault();
    });
  });
  
  function getMovies(myInput) {
    axios.get('http://www.omdbapi.com?s=' + myInput + '&apikey=6753c87c')
      .then((response) => {
        console.log(response);
        let movies = response.data.Search;
        let output = '';
        $.each(movies, (index, movie) => {
          output += `
            <div class="card" style="width: 18rem;" style="mergin-top: 2rem";>
              <div class="card h-100">
                <img src="${movie.Poster}"  class="card-img-top">
                <div class="card-body">
                <h5>${movie.Title}</h5>
                <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
                </div>
              </div>
            </div>
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
              <h2>${movie.Title}</h2>
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
              <h3>Plot</h3>
              ${movie.Plot}
              <hr>
              <a href="post-review.html" target="_blank" class="btn btn-primary">Leave a Command</a>
              <a href="index.html" class="btn btn-primary">Favorite</a>
            </div>
          </div>
        `;
  
        $('#movie').html(output);
        
      })
      .catch((err) => {
        console.log(err);
      });
  }