function readOMDB() {
    // adapted from https://stackoverflow.com/questions/33237200/fetch-response-json-gives-responsedata-undefined

    fetch('http://www.omdbapi.com/?i=tt3896198&apikey=6753c87c')
    .then((response) => {
       return response.json() 
    })
    .then((responseData) => { 
        console.log(responseData.Title);
        console.log(responseData.Year);
        console.log(responseData.Ratings[0].Value);
    })
  .catch(function(err) {
      console.log(err);
  })
}
readOMDB();