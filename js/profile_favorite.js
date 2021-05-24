const db = firebase.firestore();
//read the favourite list in firestore and append in the table
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var favList;
        db.collection("users").doc(user.uid).get().then((s) => {
            favList = s.data().favouriteLists;
            favList.forEach(element => {
                axios.get('http://www.omdbapi.com?i=' + element + '&apikey=6753c87c')
                    .then((response) => {
                        let movie = response.data;
                        $("#favTable").append(`
                            <tr id = "movie` + element+`" >
                                <th><a class="link-light" id="`+ element + `" style="cursor: pointer;">` + movie.Title + `<a></th>
                                <th>` + movie.Released + `</th> 
                                <th>` + movie.Genre + `</th>
                                <th><button class="removeFav btn btn-danger " 
                                onClick="setTimeout(function () { 
                                    location.reload();
                                  }, 400);" 
                                value="`+ element + `">X</button></th>
                            
                            </tr>
                        `);
                    });
                console.log(element);
            });
        });
    };
});

//user can delete the movie in favourite list and click the name to see the details
$(document).ready(() => {
    var el = document.getElementById('favTable');
    if (el) {
        el.addEventListener("click", function (event) {
            var movieId = $(el).val();
            if(event.target.value!==undefined) {
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        db.collection("users").doc(user.uid).update({
                            "favouriteLists": firebase.firestore.FieldValue.arrayRemove(event.target.value),
                        });
                    }
                });
                //if user click the name
            } else if(event.target.id!==undefined && event.target.id.trim() != "") {
                movieSelected(event.target.id);
            }       
        });
    }
});

//redirect to the detail page
function movieSelected(id) {
    sessionStorage.setItem('movieId', id);
    window.location = "movieresult.html?" + id;
    return false;
}