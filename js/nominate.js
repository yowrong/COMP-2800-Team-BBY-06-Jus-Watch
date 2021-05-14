import { writeMovie } from "./firebase-queries.js";

// const db = firebase.firestore();
// const groupRef = db.collection("groups");

let string = decodeURIComponent(window.location.search);        // from "10b Lecture Javascript Relevant Bits-1"
let query = string.split("?");                                  // Projects 1800 lecture slides
let groupID = query[1];

const searchResultsDiv = document.getElementById('searchResults');

function searchOMDB(search) {
    // adapted from https://stackoverflow.com/questions/33237200/fetch-response-json-gives-responsedata-undefined

    fetch(`http://www.omdbapi.com/?s=${search}&apikey=6753c87c`)
    .then((response) => {
       return response.json() 
    })
    // returns array of search results
    .then((responseData) => { 

        let searchResults = responseData.Search;
        let titles = [];
        let years = [];
        let posters = [];
        let ids = [];

        // loop through search results and grab movie info
        searchResults.forEach(function(movie) {
            titles.push(movie.Title)
            years.push(movie.Year)
            posters.push(movie.Poster)
            ids.push(movie.imdbID)
        })

        renderSearchResults(titles, years, posters, ids, "group1", searchResultsDiv);               // need to update to 
                                                                                                    // include groupID
        
    })
  .catch(function(err) {
      console.log(err);
  })
}

// renders Cards of movies in search results in modal for nomination
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

/* accesses nominated movie's info from OMDB and writes to group's nominatedMovie collection */
function accessMovie(movieId) {
    let movieTitle = "";
    let movieDesc = "";
    let moviePic = "";
    let movieYear = "";
    let movieImdbId = movieId;
    
    fetch(`http://www.omdbapi.com/?i=${movieId}&apikey=6753c87c`)
    .then((response) => {
       return response.json() 
    })
    .then((responseData) => { 
        movieTitle = responseData.Title;
        movieYear = responseData.Year;
        movieDesc = responseData.Plot;
        moviePic = responseData.Poster;

        writeMovie(movieImdbId, movieTitle, movieYear, movieDesc, moviePic, groupID)
    })
  .catch(function(err) {
      console.log(err);
  })
}

$(searchResultsDiv).on("click", ".nominateBtn", function(e) {
    e.preventDefault();
    console.log(e.target.id);
    let movieId = e.target.id;

    accessMovie(movieId);

    setTimeout(function() {
        window.location.href = `/group-centre.html?${groupID}`
    }, 1000)
    

})

/* The basis for this function was provided by w3schools */
/* Handles the typeahead autocomplete search function */
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, precent default function*/
            e.preventDefault();
            
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

var movie;
var item;

/* Gets the list of products from the database. */
// var promise = db.collection("movies")
//     .get()
//     .then(function (querySnapshot) {
//         querySnapshot.forEach(function (doc) {
//             /* Casts the product list into an array. */
//             movie = Object.values(doc.data());
//             console.log(movie);
//         });
//     })
//     .catch(function (error) {
//         console.log("Error getting documents: ", error);
//     });

/* Run autocomplete once list is retrieved. */
// promise.then(function(){
//     autocomplete(document.getElementById("myInput"), movie);
// });

/* Locally stores the user's search term and redirects to the movie page */
function saveSearchFromUser() {
    document.getElementById("myBtn").addEventListener('click', function () {
        item = document.getElementById("myInput").value;

        // window.location.href = "moviedescription.html"

        localStorage.setItem("item", item);
        searchOMDB(item);

    });
}
saveSearchFromUser();

/* Retrieves the user's search term */
function displaySearch() {
    item = localStorage.getItem("item");
    console.log(item);
    $("#search-go-here").append('<p>' + item + '</p>');

}
displaySearch();

