const db = require('../models');

module.exports = function (app, firebase, fbAdmin) {

    // Create a new post
    app.post('/profile/post', function (req, res) {
        // Retrieve image and post data from request
        // Upload image to storage (encrypt?)
        // Get photo cloud storage location
        // Insert new post into posts table
        // Render/return new post page in response
    });

    // Create a new group:
    //Update users.groupOwner: true where email is /group/:email and grab the 
    //.then {create group with groupName & PhotoUrl} > example output: id:2
    //.then { create membership setting the userId column to users.id }
    //
    app.post('/group/:id', function (req, res) {
        // db.Groups.create({
        //     groupName:'Robin Williams Fans',
        //     groupPhoto: 'https://naqyr37xcg93tizq734pqsx1-wpengine.netdna-ssl.com/wp-content/uploads/2014/08/Robin-Williams.jpg',
        //     include:[
        //         {model:db.Members,
        //             include: [
        //                 {model:db.Users}
        //             ]}
        //     ]
        // }).then(function(newGroup){
        //     const resObj = newGroup.map(function(group){
        //         return Object.assign({},{

        //         })
        //     })
        // });
        // Retrieve group name and image
        // Upload image to storage
        // Get photo storage location
        // Insert new group data into groups table
        // render/return new group page
    });

    // Log-in user
    app.post('/login', function (req, res) {
        // Sign In User
        firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
            .then(function () {
                // If successful, get token then send token to client for session storage
                sendUser(res);
            })
            // Sign in errors
            .catch(function (error) {
                res.statusCode = 401;
                res.send(error);
            });
    });

    // Sign-up new user
    app.post('/login/signup', function (req, res) {
        firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
            .then(function () {
                
                console.log(req.body.email);
                //Creating userEmail, fullname and owner: false to mySQL
                db.Users.create({
                    email:req.body.email,
                    firstName:req.body.firstName,
                    lastName:req.body.lastName,
                    groupOwner:false
                }).then(function(dbUser){
                    
                    console.log('Inserted into MySQL: ');
                    console.log('dbuserId',dbUser.id);
                    console.log('sending id to client');
                    
                });
                sendUser(res);
            })
            .catch(function (error) {
                console.log('error309480398');
                res.statusCode = 401;
                res.send(error);
            });
    });

    // Log a user out
    app.post('/logout', function (req, res) {

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

    function sendUser(res) {
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
            .then(function (idToken) {
                res.statusCode = 200;
                res.send(idToken);
            }).catch(function (error) {
                console.log('error238948');
                res.statusCode = 401;
                res.send(error);
            });
    }
};