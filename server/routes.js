const express = require('express');
const busboy = require('connect-busboy');
const models = require('./models');

const router = express.Router();

// router.post('/submit', (req, res) => {
//   // var fstream;
//   req.pipe(req.busboy);
//   req.busboy.on('file', function (fieldname, file, filename) {
//     console.log("Uploading: " + filename);
//
//     //Path where image will be uploaded
//     // fstream = fs.createWriteStream(__dirname + '/img/' + filename);
//     // file.pipe(fstream);
//     // fstream.on('close', function () {
//     //   console.log("Upload Finished of " + filename);
//     //   res.redirect('back');           //where to go next
//     // });
//   });
// });

router.post('/problems', (req, res) => {
  const problem = new models.Problem(req.body);
  problem.save((err, problem) => {
    if (err) {
      res.status(500).send({ });
      return;
    }
    console.log(problem);
    res.status(200).send({ id: problem._id })
  });
});

router.get('/problems/:id', (req, res) => {
  models.Problem.findById(req.params.id, (err, problem) => {
    console.log(err, problem);
    if (err) {
      res.status(404).send({ });
      return;
    }
    res.status(200).send({ name: problem.name, text: problem.text });
  });
});

router.get('/submissions/:id', (req, res) => {
  models.Submission.find({ problem: req.params.id }, (err, submissions) => {
    if (err) res.status(404).send({});
    res.send(submissions);
  })
});

module.exports = router;