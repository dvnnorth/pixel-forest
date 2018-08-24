// Sharp Dependancies
const sharp = require('sharp');
const fs = require('fs');
const request = require('request').defaults({
    encoding: null
});

// FTP Dependancies
var Client = require('ftp');


// url of original file.  You can also choose to use a buffer and remove the requirement of the request library
let imgURL = 'https://1.bp.blogspot.com/-0QZgHITwMWM/UOWhfvkeKAI/AAAAAAAAQhc/pi_5JqXUtV0/s1600/Innocent+Babies+Wallpapers+01.jpg';

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
            let thumbnailFN = originalFN.substring(0, originalFN.lastIndexOf('.')) + '_thumb' + originalFN.substring(originalFN.lastIndexOf('.'));

            uploadThumbNail(outputBuffer, thumbnailFN);
            // fs.writeFile(thumbnailFN, outputBuffer, 'binary', function (err) {
            //     if (err) throw err
            //     console.log('File saved.');
            // });
        });
});

// Uploads thumnail image to digitalocean server
// images are viewable at http://142.93.206.185/img/${thumbnailFN}
function uploadThumbNail(outputBuffer, thumbnailFN) {
    let c = new Client();
    c.on('ready', function () {
        c.put(outputBuffer, thumbnailFN, function (err) {
            if (err) throw err;
            console.log('File viewable @ http://142.93.206.185/img/' + thumbnailFN);
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