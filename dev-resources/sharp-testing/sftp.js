var Client = require('ftp');
var fs = require('fs');

var c = new Client();
c.on('ready', function() {
  c.put('sharp.js', 'sharp-remote.js', function(err) {
    if (err) throw err;
    c.end();
  });
});
// connect to localhost:21 as anonymous
c.connect({
    'host': '142.93.206.185',
    'user': 'ftpuser',
    'password': 'G4L9vNsywt5KVFbe'
});

// var c = new Client();
// c.on('ready', function () {
//     c.list(function (err, list) {
//         if (err) throw err;
//         console.dir(list);
//         c.end();
//     });
// });
// // connect to localhost:21 as anonymous
// c.connect({
//     'host': '142.93.206.185',
//     'user': 'ftpuser',
//     'password': 'G4L9vNsywt5KVFbe'
// });