var db = require('../models');

module.exports = function (app) {
    // Load home page
    app.get('/', function (req, res) {
        // Render and return home page
    });

    // Load login screen
    app.get('/login', function (req, res) {
        // Render and return login page
        res.render('login');
    });

    app.get('/login/signup', function (req, res) {
        res.render('signup');
    });

    // If user doesn't have access, send back 401 Unauthorized

    // Load profile page
    app.get('/profile', function (req, res) {
        // Render and return home page
    });

    // Load group page
    app.get('/group', function (req, res) {
        // Render and return home page
    });

    // Load post page
    app.get('/profile/post', function (req, res) {
        // Render and return home page
    });

    // Render 404 page for any unmatched routes
    app.get('*', function (req, res) {
        res.render('404');
    });
};
