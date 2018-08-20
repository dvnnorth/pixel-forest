require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var firebase = require('firebase');
var fbAdmin = require('firebase-admin');

// Config and initialize Firebase obj
var firebaseConfig = {
    apiKey: "AIzaSyC-UJaQ-ItnQxwUJdeHq6a8rTf_b3SbQR0",
    authDomain: "sweet-pea-43415.firebaseapp.com",
    databaseURL: "https://sweet-pea-43415.firebaseio.com",
    projectId: "sweet-pea-43415",
    storageBucket: "sweet-pea-43415.appspot.com",
    messagingSenderId: "817762189617"
};
firebase.initializeApp(firebaseConfig);

// Config and initialize Firebase admin obj
var serviceAccount = require('./admin/sweet-pea-43415-firebase-adminsdk-bsj7n-36bf6cfda5.json');

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
