$(function () {
    var firebaseConfig = {
        apiKey: "AIzaSyA6FqIL02M3IGmtfWPNFdXTV8Aw_FIY6ZQ",
        authDomain: "sweetpea-74522.firebaseapp.com",
        databaseURL: "https://sweetpea-74522.firebaseio.com",
        projectId: "sweetpea-74522",
        storageBucket: "sweetpea-74522.appspot.com",
        messagingSenderId: "1006334747003"
    };
    firebase.initializeApp(firebaseConfig);

    console.log('It worked: ', $);
    let loginEndpoint = window.location.protocol + '//' + window.location.host + '/login';
    if (sessionStorage.getItem('token')) {
        $.ajax({
            method: 'GET',
            url: '/api/profile/content',
            async: true,
            headers: {
                token: sessionStorage.getItem('token'),
                id: sessionStorage.getItem('id')
            }
        })
            .then(function (response) {
                // Render the page
                // Execute page scripts
                

                $('body').prepend('<h1>IT WORKED</h1>');

                $('#postSubmit').on('click', function (event) {
                    event.preventDefault();
                    
                });



            })
            .fail(function () {
                window.location.replace(loginEndpoint);
            });
    }
    else {
        window.location.replace(loginEndpoint);
    }
});