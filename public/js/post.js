// Initialize Firebase
var config = {
    apiKey: "AIzaSyA6FqIL02M3IGmtfWPNFdXTV8Aw_FIY6ZQ",
    authDomain: "sweetpea-74522.firebaseapp.com",
    databaseURL: "https://sweetpea-74522.firebaseio.com",
    projectId: "sweetpea-74522",
    storageBucket: "sweetpea-74522.appspot.com",
    messagingSenderId: "1006334747003"
};
firebase.initializeApp(config);


// Global Variables
let $imgs = '';
let downloadURLs = [];
var loginEndpoint = window.location.protocol + '//' + window.location.host + '/login';


// Handle waiting to upload each file using promise
function uploadImageAsPromise(imageFile) {
    //return new Promise(function (resolve, reject) {
    let fName = imageFile.name;

    let fExtension = imageFile.name.split('?', 1);
    fExtension = fExtension[0].toString();
    fExtension = fExtension.substr(fExtension.length - 4);

    fName = generateUUID();
    let fileName = fName + fExtension;

    var storageRef = firebase.storage().ref(fileName);

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

                $('#postSubmit').removeClass('d-none');
                $('#postSubmit').on('click', function (event) {
                    event.preventDefault();
                    if (sessionStorage.getItem('token')) {
                        var postData = {
                            pictureUrl: downloadURL,
                            title: $('#postTitle').val().trim(),
                            body: $('#postBody').val().trim(),
                            UserId: sessionStorage.getItem('id')
                        };
                        console.log(postData);
                        $.ajax({
                            method: 'POST',
                            url: '/api/profile/post',
                            async: true,
                            headers: {
                                token: sessionStorage.getItem('token'),
                                id: sessionStorage.getItem('id')
                            },
                            data: postData
                        })
                            .then(function (response) {

                                console.log(response);
                                window.location.replace('/profile');

                            })
                            .fail(function () {
                                window.location.replace(loginEndpoint);
                            });
                    }
                    else {
                        window.location.replace(loginEndpoint);
                    }
                });

                // downloadURLs.push(downloadURL);

                // downloadURLs.forEach(element => {
                //     let fExtension = element.split('?', 1);
                //     fExtension = fExtension[0].toString();
                //     fExtension = fExtension.substr(fExtension.length - 3);

                //     if (fExtension == 'pdf') {
                //         $imgs += '<img src="assets/img/pdficon.png" class="img-thumbnail" height="100" width="100">';
                //     } else {
                //         $imgs += `<img src="${element}" class="img-thumbnail" height="100" width="100">`;
                //     }

                // });
                // console.log(downloadURLs);
                $('#preview').html($imgs);
                // downloadURLs = [];
            });
        });
    return fileName;
    //});
}

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}


// Listen for file selection
$(document).on('change', '#fileButton', function (e) {
    // Get files
    // for (var i = 0; i < e.target.files.length; i++) {
    //     var imageFile = e.target.files[i];
    var imageFile = e.target.files[0];
    uploadImageAsPromise(imageFile);

});