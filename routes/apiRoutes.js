const db = require('../models');

module.exports = function (app, firebase, fbAdmin) {

    app.get('/api/profile/content', function (req, res) {
        let token = req.header('token');
        let userID = req.header('id');

        if (token) {
            checkAuth(token, res, function (decodedToken) {
                let uid = decodedToken.uid;
                fbAdmin.auth().getUser(uid)
                    .then(function (userRecord) {
                        db.Users.findOne({
                            where: {
                                id: userID
                            }
                        })
                            .then(function (user) {
                                db.Posts.findAll(
                                    {
                                        where: {
                                            UserId: user.id
                                        }
                                    },
                                    {
                                        include: [db.Users]
                                    }
                                )
                                    .then(function (posts) {
                                        res.send(posts);
                                    });
                            });
                    })
                    .catch(function (error) {
                        console.log("Error fetching user data:", error);
                    });
            });
        }
        else {
            res.statusCode = 401;
            res.send(new Error('Unauthorized'));
        }
    });

    // Get a post
    app.get('/api/profile/post/:id', function (req, res) {
        // Get a post from the database, return the object needed to insert the post into the modal
    });


    // Create a new post
    app.post('/api/profile/post', function (req, res) {
        // Retrieve image and post data from request
        // Upload image to storage (encrypt?)
        // Get photo cloud storage location
        // Insert new post into posts table
        // Render/return new post page in response
    });

    // Log-in user
    app.post('/api/login', function (req, res) {
        // Sign In User
        firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
            .then(function () {
                console.log('user email: ', req.body.email);
                let uid = firebase.auth().currentUser.uid;
                // If successful, get token then send token to client for session storage
                db.Users.findOrCreate({
                    where: {
                        email: req.body.email
                    },
                    defaults: {
                        email: req.body.email,
                        firstName: req.body.firstName || req.body.email,
                        lastName: req.body.lastName || req.body.email
                    }
                })
                    .then(function (result) {
                        let dbUser = result[0];
                        let created = result[1];
                        if (created) console.log('Created new user entry');
                        sendUser(res, dbUser.id);
                    });
            })
            // Sign in errors
            .catch(function (error) {
                console.log('firebase error');
                res.statusCode = 401;
                res.send(error);
            });
    });

    // Sign-up new user
    app.post('/api/login/signup', function (req, res) {
        // Create user
        firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
            // On successful creation
            .then(function () {
                let newUser = {
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName
                };
                // Create user entry in database
                db.Users.create(newUser, {
                    include: [db.Posts]
                })
                    .then(function (dbUser) {
                        // Call send user to send the token in the response, front end code handles redirect
                        console.log('dbUser: ', dbUser);
                        sendUser(res, dbUser.id);
                        // Log users object
                        console.log('First Name: ', dbUser.firstName, 'Last Name', dbUser.lastName,
                            'Email: ', dbUser.email);
                    });
            })
            // If creation fails
            .catch(function (error) {
                res.statusCode = 401;
                res.send(error);
            })
    });

    // Share a profile
    app.post('/api/share', function (req, res) {
        // Create a new Viewer
        // Generate and send email to Viewer
    });

    // Log a user out
    app.post('/api/logout', function (req, res) {

    });

    // Update a post
    app.put('/api/profile/post', function (req, res) {
        // Grab data to be updated
        // Update columns for post in posts table
        // render/return updated post page
    });

    // Delete a post
    app.delete('/api/profile/post', function (req, res) {
        // Get post ID from request
        // Delete image from hosting
        // Remove entry from table
        // Return 200 if successful
        // Or redirect to profile page with message?
    });

    // Delete account
    app.delete('/api/profile', function (req, res) {
        // After front end handles confirmation
        // Get profile information from request
        // Delete all posts associated with profile
        //   Same procedure as post delete route for 
        //   all relevant posts
        // Delete group associated with profile
        // Delete profile
        // Return 200 if successful
    });

    function sendUser(res, userID) {
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
            .then(function (idToken) {
                res.statusCode = 200;
                res.send({
                    id: userID,
                    token: idToken
                });
            }).catch(function (error) {
                res.statusCode = 401;
                res.send(error);
            });
    }

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