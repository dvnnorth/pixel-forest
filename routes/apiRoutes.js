var db = require("../models");
var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyA6FqIL02M3IGmtfWPNFdXTV8Aw_FIY6ZQ",
    authDomain: "sweetpea-74522.firebaseapp.com",
    databaseURL: "https://sweetpea-74522.firebaseio.com",
    projectId: "sweetpea-74522",
    storageBucket: "sweetpea-74522.appspot.com",
    messagingSenderId: "1006334747003"
};
firebase.initializeApp(config);

var auth = firebase.auth();


module.exports = function (app) {
    // Get all examples
    app.get("/api/examples", function (req, res) {
        db.Example.findAll({}).then(function (dbExamples) {
            res.json(dbExamples);
        });
    });

    // Create a new example
    app.post("/api/examples", function (req, res) {
        db.Example.create(req.body).then(function (dbExample) {
            res.json(dbExample);
        });
    });
    // Delete an example by id
    app.delete("/api/examples/:id", function (req, res) {
        db.Example.destroy({ where: { id: req.params.id } }).then(function (dbExample) {
            res.json(dbExample);
        });
    });
    // Create a new example
    app.post("/login/signup", function (req, res) {
        console.log(req.body);
        //   pass info to authentication engine
        firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });

    });
};
