var db = require('../models');

module.exports = function (app, firebase, fbAdmin) {

    /* HTML Route handling for secure pages works like this:
        1) Get request is made to route
        2) If a token doesn't exist in the header, render and send the redirect page
        3) Redirect page script will check for header in sessionStorage
        4a) If the header exists, make a get request with header,
            4ai) If the user has a session, then you'll receive the html to render
            4aii) If the user does not have a valid session, do error handling 
        4b) If the header doesn't exist, redirect to /login */

    // Load home page
    app.get('/', function (req, res) {
        // Render and return home page
        res.render('home');
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
        // Check if a token was sent with request. If not, then render 'redirect' which will handle pulling actual page
        // if the token is stored in sessionStorage, or will redirect to login if not

        let token = req.header('token');

        if (token) {
            checkAuth(token, res, function (decodedToken) {
                let uid = decodedToken.uid;
                fbAdmin.auth().getUser(uid)
                    .then(function (userRecord) {
                        // See the UserRecord reference doc for the contents of userRecord.
                        console.log('Successfully fetched user data:', userRecord.toJSON());
                        // Here we need to query the group to populate the page

                        // Query for posts to build the page

                        // db.Users.findOne({

                        // });

                        // db.Members.findAll({
                        //     where: {
                        //         user
                        //     },
                        //     include: [db.Users]
                        // })
                        //     .then(function (data) {
                        //         console.log(data);
                        //     });

                        // Render the group page with the needed information
                        res.statusCode = 200;
                        res.render('profile', { email: userRecord.email });
                    })
                    .catch(function (error) {
                        console.log("Error fetching user data:", error);
                    });
            }, function (error) {
                // On auth failure
                res.render('redirect');
            });
        }
        else {
            res.render('redirect');
        }
    });

    // Load group page
    app.get('/group', function (req, res) {
        let token = req.header('token');

        let requestedGroupID = req.header('groupID');

        if (token) {
            checkAuth(token, res, function (decodedToken) {
                // On successful auth verification
            }, function (error) {
                res.render('redirect');
            });
        }
        else {
            res.render('redirect');
        }
    });

    // Load post page
    app.get('/profile/post', function (req, res) {

        let token = req.header('token');

        let requestedPostID = req.header('postID');

        if (token) {
            checkAuth(token, res, function (decodedToken) {
                // On successful auth verification
            }, function (error) {
                res.render('redirect');
            });
        }
        else {
            res.render('redirect');
        }
    });

    // Render 404 page for any unmatched routes
    app.get('*', function (req, res) {
        res.render('404');
    });

    // This helper function provides the authorization functionality with firebase to verify if a user is properly authenticated
    // It verifies that the token is valid and that there is a current session and then either runs onSuccess callback (passing the decoded token)
    // if successful, or onFailure callback (if provided) if there is an error
    function checkAuth(token, res, onSuccess, onFailure) {
        fbAdmin.auth().verifyIdToken(token)
            .then(function (decodedToken) {
                onSuccess(decodedToken);
            }).catch(function (error) {
                if (onFailure) onFailure(error);
                res.statusCode = 401;
                res.send(error);
            });
    }
};