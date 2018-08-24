const db = require('../models');

module.exports = function (app, firebase, fbAdmin) {

    // Get a post verifying that the viewer has access to see the user's pictures
    app.post('/api/profile/post/:id',function (req, res) {
        // check if the viewer email in the view table is linked to the userid that profile belongs to:

        //Client needs to send userEmail from the profile page so userId can be retrieved 
        const userEmail = req.body.userEmail;
        //Client needs to send viewerEmail from the profile page to check if viewerEmail exists in the viewer table and its User.idFk = User.idPk(users table)
        const viewerEmail = req.body.viewerEmail;
        // Get a post from the database, return the object needed to insert the post into the modal
        //Store postId from the route variable.
        const postId = req.params.id;
        //find a user record where the id = userEmail THEN store the id as userId, find one viewer record where email = viewerEmail and userId = userId.Fk;
        db.Users.findOne({where:{email:userEmail}})
            .then(function(dbUser){
                const userId = dbUser.id;
                console.log(userId);
                db.Viewers.findOne({where:{email:viewerEmail,UserId:userId}}).then(function(access){
                    if(access){
                        console.log('found a record matching viewerEmail with UserId');
                        console.log(access.id);
                        //get all the post where userId = userId.fk
                        // app.get('/')
                        db.Posts.findOne({
                            where: {id:postId},
                        }).then(function(post){
                            console.log('Post Title: ',post.title);
                            console.log('Pic Url: ',post.pictureUrl);
                            res.send(post.title);
                        }); 
                    }else{
                        console.log('Record not found for viewerEmail access granted by UserId');
                        res.send('You need to request access from the profile owner to view pictures');
                    }
                });
            });
    });


    // Create a new post
    app.post('/api/profile/post', function (req, res) {
        // Retrieve image from firebase url and post data to mysql from request
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
                        lastName: req.body.lastName || req.body.email,
                        groupOwner: false
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
                    lastName: req.body.lastName,
                    groupOwner: false
                };
                // Create user entry in database
                db.Users.create(newUser, {
                    include: [db.Members, db.Posts]
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
        const newData = {title:req.body.title,body:req.body.body,pictureUrl:req.body.url};
        //Grab postId from the client 
        const postId = req.body.postId;
        // Update columns for post in posts table
        db.Posts.update(newData,{
            where:{id:postId},
        }).then(function(updatedPost){
            if(updatedPost){
                console.log('Updated Post Successfully');
                //refreshing the page to display the updated post
                res.status(200);
                res.redirect('/');
            }else {
                res.status(500);
                res.send('something went wrong! Post update was unsuccessfull!');
            }
        });
        // render/return updated post page
    });

    // Delete a post
    app.delete('/api/profile/post', function (req, res) {
        // Get post ID from request
        const postId = req.body.postId;
        // Delete image from hosting
        //Need Devin's help deleting the image from hosting
        // Remove entry from table
        db.Posts.destroy({where: {id:postId}}).then(function(deletedPost){
            if(deletedPost){
                res.status(200);
                res.redirect('/');
            }else {
                res.status(500);
                res.send('Error occured while trying to delete the post. Please try again.');
            }
        });
    });

    // Delete account
    app.delete('/api/profile', function (req, res) {
        // After front end handles confirmation
        // Get profile information from request
        const userEmail = req.body.email;
        db.Users.destroy({where:{email:userEmail}}).then(function(deletedUser){
            if(deletedUser){
                res.status(200);
                res.redirect('/login/signup');
            }else {
                res.send('Error deleting your profile.');
            }
        });
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
};