const express = require('express');
const busboy = require('connect-busboy');

const router = express.Router();

router.post('/submit', (req, res) => {
  // var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    console.log("Uploading: " + filename);

    //Path where image will be uploaded
    // fstream = fs.createWriteStream(__dirname + '/img/' + filename);
    // file.pipe(fstream);
    // fstream.on('close', function () {
    //   console.log("Upload Finished of " + filename);
    //   res.redirect('back');           //where to go next
    // });
  });
});

module.exports = router;