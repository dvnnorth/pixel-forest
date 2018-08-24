require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var firebase = require('firebase');
var fbAdmin = require('firebase-admin');

// Config and initialize Firebase obj
var firebaseConfig = {
    apiKey: "AIzaSyA6FqIL02M3IGmtfWPNFdXTV8Aw_FIY6ZQ",
    authDomain: "sweetpea-74522.firebaseapp.com",
    databaseURL: "https://sweetpea-74522.firebaseio.com",
    projectId: "sweetpea-74522",
    storageBucket: "sweetpea-74522.appspot.com",
    messagingSenderId: "1006334747003"
};
firebase.initializeApp(firebaseConfig);

// Config and initialize Firebase admin obj
var serviceAccount = require('./admin/sweetpea-74522-firebase-adminsdk-kenx4-d8e5fa70d6.json');

fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(serviceAccount),
    databaseURL: 'https://sweet-pea-43415.firebaseio.com'
});

var db = require('./models');

var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Handlebars
app.engine(
    'handlebars',
    exphbs({
        defaultLayout: 'main'
    })
);
app.set('view engine', 'handlebars');

// Routes
require('./routes/apiRoutes')(app, firebase, fbAdmin);
require('./routes/htmlRoutes')(app, firebase, fbAdmin);

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === 'test') {
    syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
    app.listen(PORT, function () {
        console.log(
            '==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.',
            PORT,
            PORT
        );
    });
});
module.exports = app;
