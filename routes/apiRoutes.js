const db = require('../models');
const firebase = require('../config/firebase');

module.exports = function (app) {
    // Create a new post
    app.post('/profile/post', function (req, res) {
        // Retrieve image and post data from request
        // Upload image to storage (encrypt?)
        // Get photo cloud storage location
        // Insert new post into posts table
        // Render/return new post page in response
    });

    // Create a new group
    app.post('/group', function (req, res) {
        // Retrieve group name and image
        // Upload image to storage
        // Get photo storage location
        // Insert new group data into groups table
        // render/return new group page
    });

    // Log-in user
    app.post('/login', function (req, res) {
        firebase.auth();
    });

    // Sign-up new user
    app.post('/login/signup', function (req, res) {
        firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
            .catch(function (error) {
                // Handle Errors here.
                console.log(error);
                res.statusCode = 401;
                res.send(error);
            })
    });

    // Update a post
    app.put('/profile/post', function (req, res) {
        // Grab data to be updated
        // Update columns for post in posts table
        // render/return updated post page
    });

    // Edit group permissions
    app.put('/group', function (req, res) {

    });

    // Delete a post
    app.delete('/profile/post', function (req, res) {
        // Get post ID from request
        // Delete image from hosting
        // Remove entry from table
        // Return 200 if successful
        // Or redirect to profile page with message?
    });

    // Delete account
    app.delete('/profile', function (req, res) {
        // After front end handles confirmation
        // Get profile information from request
        // Delete all posts associated with profile
        //   Same procedure as post delete route for 
        //   all relevant posts
        // Delete group associated with profile
        // Delete profile
        // Return 200 if successful
    });
};