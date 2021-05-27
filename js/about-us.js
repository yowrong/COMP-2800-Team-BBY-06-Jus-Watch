/* Following code has been adopted from @JAGATHISH1123 on codepen.io */
 /* https://codepen.io/JAGATHISH1123/ */

var text = encodeURIComponent("This cool new app lets you search for movies, nominate and vote on them with your friends, and post reviews! Don't believe me? Jus'Watch!");
var url = "https://jus-watch.web.app";
var params = "menubar=no,toolbar=no,status=no,width=500,height=500";

var facebook = document.querySelector('.facebook');
var twitter = document.querySelector('.twitter');

facebook.addEventListener('click', function (e) {
    let shareUrl = `http://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(shareUrl, "New Window", params);
});

twitter.addEventListener('click', function (e) {
    let shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    window.open(shareUrl, "New Window", params);
});