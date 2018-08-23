const sharp = require('sharp');
const fs = require('fs');
const request = require('request').defaults({
    encoding: null
});

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

            console.log(thumbnailFN);

            fs.writeFile(thumbnailFN, outputBuffer, 'binary', function (err) {
                if (err) throw err
                console.log('File saved.');
            });
        });
});
