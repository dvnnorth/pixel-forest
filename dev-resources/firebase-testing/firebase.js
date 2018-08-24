// Initialize Firebase
var config = {
    apiKey: 'AIzaSyA5HknkMo8e56CNztoVH6jp86m9sr59xZA',
    authDomain: 'homeinventory-3125f.firebaseapp.com',
    databaseURL: 'https://homeinventory-3125f.firebaseio.com',
    projectId: 'homeinventory-3125f',
    storageBucket: 'homeinventory-3125f.appspot.com',
    messagingSenderId: '714473599175'
};
firebase.initializeApp(config);


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