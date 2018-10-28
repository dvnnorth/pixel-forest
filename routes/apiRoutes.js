const db = require('../models');
const sharp = require('sharp');
const request = require('request').defaults({
    encoding: null
});
const fs = require('fs');

// FTP Dependancies
var Client = require('ftp');

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
                        console.log('Error fetching user data:', error);
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

        let token = req.header('token');
        let userID = req.header('id');

        if (token) {
            checkAuth(token, res, function (decodedToken) {
                let uid = decodedToken.uid;
                fbAdmin.auth().getUser(uid);
                db.Posts.findOne({
                    where: {
                        id: req.params.id
                    }
                })
                    .then(function (post) {
                        res.statusCode = 200;
                        res.send(post.dataValues);
                    })
                    .catch(function (error) {
                        console.log('Error fetching user data:', error);
                        res.statusCode = 500;
                        res.send(error);
                    });
            });
        }
        else {
            res.statusCode = 401;
            res.send(new Error('Unauthorized'));
        }
    });


    // Create a new post
    app.post('/api/profile/post', function (req, res) {
        // Retrieve image and post data from request
        // Upload image to storage (encrypt?)
        // Get photo cloud storage location
        // Insert new post into posts table
        // Render/return new post page in response

        let token = req.header('token');
        let userID = req.header('id');
        let passedRes = res;

        if (token) {

            checkAuth(token, res, function (decodedToken) {
                let uid = decodedToken.uid;
                fbAdmin.auth().getUser(uid)
                    .then(function (userRecord) {

                        db.Posts.create(req.body)
                            .then(function (postEntry) {

                                /////////////////////////// sharp

                                // url of original file.  You can also choose to use a buffer and remove the requirement of the request library
                                let imgURL = postEntry.pictureUrl;

                                request.get(imgURL, function (err, res, inputBuffer) {
                                    sharp(inputBuffer)
                                        .resize(350, 350)
                                        .min()
                                        .crop(sharp.strategy.attention)
                                        .toFormat('jpeg')
                                        .toBuffer()
                                        .then(function (outputBuffer) {
                                            // outputBuffer contains JPEG image data no wider than 350 pixels and no higher
                                            // than 350 pixels regardless of the inputBuffer image dimensions
                                            let originalFN = imgURL.substring(imgURL.lastIndexOf('/') + 1);
                                            let thumbnailFN = originalFN
                                                .substring(0, originalFN.lastIndexOf('.')) + '_thumb' + originalFN.substring(originalFN.lastIndexOf('.'))
                                                .split('?')[0];


                                            uploadThumbNail(outputBuffer, thumbnailFN, passedRes, postEntry);
                                            // fs.writeFile(thumbnailFN, outputBuffer, 'binary', function (err) {
                                            //     if (err) throw err
                                            //     console.log('File saved.');
                                            // });
                                        });
                                });

                                ////////////////////////////
                            });
                    })
                    .catch(function (error) {
                        console.log('Error fetching user data:', error);
                    });
            });
        }
        else {
            res.statusCode = 401;
            res.send(new Error('Unauthorized'));
        }
    });

    app.post('/sharp', function (req, res) {
        var imgUrl = req.body.url;
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
                    })
                    .catch(function (err) {
                        // print the error details
                        console.log(err, req.body.email);
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
            });
    });

    // Update a post
    app.put('/api/profile/post/:id', function (req, res) {
        // Grab data to be updated
        // Update columns for post in posts table
        // render/return updated post page
        let token = req.header('token');
        let userID = req.header('id');

        if (token) {

            checkAuth(token, res, function (decodedToken) {
                let uid = decodedToken.uid;
                fbAdmin.auth().getUser(uid)
                    .then(function (userRecord) {
                        console.log(req.body);
                        db.Posts.update(
                            req.body,
                            {
                                where: {
                                    id: req.params.id
                                }
                            }
                        )
                            .then(function (updatedPost) {
                                res.statusCode = 200;
                                res.send(updatedPost);
                            });
                    })
                    .catch(function (error) {
                        console.log('Error fetching user data:', error);
                    });
            });
        }
        else {
            res.statusCode = 401;
            res.send(new Error('Unauthorized'));
        }
    });

    // Delete a post
    app.delete('/api/profile/post/:id', function (req, res) {
        // Get post ID from request
        // Delete image from hosting
        // Remove entry from table
        // Return 200 if successful
        // Or redirect to profile page with message?
        let token = req.header('token');
        let userID = req.header('id');

        if (token) {

            checkAuth(token, res, function (decodedToken) {
                let uid = decodedToken.uid;
                fbAdmin.auth().getUser(uid)
                    .then(function (userRecord) {
                        console.log(req.body);
                        db.Posts.destroy(
                            {
                                where: {
                                    id: req.params.id
                                }
                            }
                        )
                            .then(function () {
                                res.statusCode = 200;
                                res.send();
                            });
                    })
                    .catch(function (error) {
                        console.log('Error deleting post data', error);
                    });
            });
        }
        else {
            res.statusCode = 401;
            res.send(new Error('Unauthorized'));
        }
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
        let token = req.header('token');
        let userID = req.header('id');

        if (token) {

            checkAuth(token, res, function (decodedToken) {
                let uid = decodedToken.uid;
                fbAdmin.auth().getUser(uid)
                    .then(function (userRecord) {
                        console.log(req.body);
                        db.Users.destroy({
                            where: {
                                id: userID
                            }
                        })
                            .then(function () {
                                // Cascade not working, destroy manually
                                db.Posts.findAll({
                                    where: {
                                        UserId: userID
                                    }
                                })
                                    .then(function (posts) {
                                        console.log(posts);
                                        let ids = posts.map(function (post) { return post.id; });
                                        console.log(ids);
                                        db.Posts.destroy({
                                            where: {
                                                id: ids
                                            }
                                        }).then(function () {
                                            res.statusCode = 200;
                                            res.send();
                                        });
                                    });
                            });
                    })
                    .catch(function (error) {
                        console.log('Error fetching user data:', error);
                    });
            });
        }
        else {
            res.statusCode = 401;
            res.send(new Error('Unauthorized'));
        }
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

    // Uploads thumnail image to digitalocean server
    // images are viewable at http://142.93.206.185/img/${thumbnailFN}
    function uploadThumbNail(outputBuffer, thumbnailFN, res, postEntry) {
        let c = new Client();
        c.on('ready', function () {
            c.put(outputBuffer, thumbnailFN, function (err) {
                if (err) throw err;
                console.log('File viewable @ http://142.93.206.185/img/' + thumbnailFN);
                res.statusCode = 200;
                res.send(postEntry);
                c.end();
            });
        });
        // connect to localhost:21 as anonymous
        c.connect({
            'host': '142.93.206.185',
            'user': 'ftpuser',
            'password': 'G4L9vNsywt5KVFbe'
        });
    }
};