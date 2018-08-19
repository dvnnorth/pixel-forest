const firebase = require('firebase');

// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyA6FqIL02M3IGmtfWPNFdXTV8Aw_FIY6ZQ',
    authDomain: 'sweetpea-74522.firebaseapp.com',
    databaseURL: 'https://sweetpea-74522.firebaseio.com',
    projectId: 'sweetpea-74522',
    storageBucket: 'sweetpea-74522.appspot.com',
    messagingSenderId: '1006334747003'
};
firebase.initializeApp(firebaseConfig);

module.exports = firebase;