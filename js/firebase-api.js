// Firebase configuration from https://console.firebase.google.com/u/3/project/jus-watch/overview
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBKFYVvWiU38IHUNQxgZHam8M68cC7Q8OQ",
    authDomain: "jus-watch.firebaseapp.com",
    projectId: "jus-watch",
    storageBucket: "jus-watch.appspot.com",
    messagingSenderId: "793273634117",
    appId: "1:793273634117:web:7c8d0589a9b2bef101c22c",
    // measurementId: "G-M53J0E72DL"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();


function firebaseAuthUI() {
    // Firebase authentication configuration and pre-built sign-in widget from https://firebase.google.com/docs/auth/web/firebaseui
    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    var uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function (authResult, redirectUrl) {
                // User successfully signed in.
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.
                return true;
            },
            uiShown: function () {
                // The widget is rendered.
                // Hide the loader.
                document.getElementById('loader').style.display = 'none';
            }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        signInSuccessUrl: 'main.html',
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            //firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
            //firebase.auth.GithubAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            //firebase.auth.PhoneAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        // tosUrl: '<your-tos-url>',
        // Privacy policy url.
        // privacyPolicyUrl: '<your-privacy-policy-url>'
    };
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);
}

export { firebaseConfig, firebaseAuthUI };
// module.exports = firebaseAuthUI;