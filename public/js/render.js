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
            .then(function (content) {
                // Render the page
                // Execute page scripts


                $('body').prepend('<h1>IT WORKED</h1>');

                $('#postSubmit').on('click', function (event) {
                    event.preventDefault();

                });
                // Global Variables
                let fbDB = firebase.database();
                let $imgs = '';
                let downloadURLs = [];



                // Handle waiting to upload each file using promise
                function uploadImageAsPromise(imageFile) {
                    return new Promise(function (resolve, reject) {
                        var storageRef = firebase.storage().ref(imageFile.name);

                        // Upload file
                        var task = storageRef.put(imageFile);

                        // Update progress bar
                        task.on('state_changed',
                            function progress(snapshot) {
                                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                console.log('Upload is ' + progress + '% done');
                            },
                            function error(err) {

                            },
                            function () {
                                task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                                    downloadURLs.push(downloadURL);

                                    downloadURLs.forEach(element => {

                                        let fExtension = element.split('?', 1);
                                        fExtension = fExtension[0].toString();
                                        fExtension = fExtension.substr(fExtension.length - 3);

                                        if (fExtension == 'pdf') {
                                            $imgs += '<img src="assets/img/pdficon.png" class="img-thumbnail" height="100" width="100">';
                                        } else {
                                            $imgs += `<img src="${element}" class="img-thumbnail" height="100" width="100">`;
                                        }

                                    });
                                    console.log(downloadURLs)
                                    $('#preview').html($imgs);
                                    downloadURLs = [];
                                });
                            });
                    });
                }

                // Listen for file selection
                $(document).on('change', '#fileButton', function (e) {
                    // Get files
                    for (var i = 0; i < e.target.files.length; i++) {
                        var imageFile = e.target.files[i];

                        uploadImageAsPromise(imageFile);
                    }
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