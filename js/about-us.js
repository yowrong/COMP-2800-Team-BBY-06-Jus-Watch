/* Following code has been adopted from https://codepen.io/JAGATHISH1123/embed/OJPyGve?default-tab=&theme-id= */

var text = encodeURIComponent("This cool new app lets you search for movies, nominate and vote on them with your friends, and post reviews! Don't believe me? Jus'Watch!");
var url = "https://jus-watch.web.app";
var hash_tags = "movies,social,app";
var params = "menubar=no,toolbar=no,status=no,width=570,height=570";

var facebook = document.querySelector('.facebook');
var twitter = document.querySelector('.twitter');

facebook.addEventListener('click', function (e) {
    let shareUrl = `http://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(shareUrl, "New Window", params);
});

twitter.addEventListener('click', function (e) {
    let shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=${hash_tags}`;
    window.open(shareUrl, "New Window", params);
});