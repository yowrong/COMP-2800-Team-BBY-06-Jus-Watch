//---------------------------------------------------------------------
// Your web app's Firebase configuration;
// Specifies which firebase project your application is connected with.
//---------------------------------------------------------------------

var firebaseConfig = {
    apiKey: "AIzaSyBKFYVvWiU38IHUNQxgZHam8M68cC7Q8OQ",
    authDomain: "jus-watch.firebaseapp.com",
    projectId: "jus-watch",
    storageBucket: "jus-watch.appspot.com",
    messagingSenderId: "793273634117",
    appId: "1:793273634117:web:7c8d0589a9b2bef101c22c",
    measurementId: "G-M53J0E72DL"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

// Create the Firestore database object
// Henceforce, any reference to the database can be made with "db"
const db = firebase.firestore(); 