const express = require('express');
const busboy = require('connect-busboy');
const models = require('./models');
const spawn = require('child_process').spawn;
const fs = require('fs');
const tmp = require('tmp');

const router = express.Router();

router.post("/problems/submit/:id", (req, res) => {
  console.log(req.params.id);
  models.Problem.findById(req.params.id, (err, problem) => {
    if (err) {
      res.status(404).send({ });
      return;
    }
    const code = req.body['code'];

    const intmp = tmp.fileSync();
    const outmp = tmp.fileSync();
    const codetmp = tmp.fileSync();
    console.log("setup temp files");

    fs.writeSync(intmp.fd, problem.testCases[0].input);
    fs.writeSync(outmp.fd, problem.testCases[0].output);
    fs.writeSync(codetmp.fd, code);
    console.log("wrote to temp files");

    let pythonProcess = spawn('python', ["../pygrader/pygrader/__init__.py", problem.name, "py", intmp.name, outmp.name, codetmp.name]);
    console.log("spawned python");

    pythonProcess.stdout.on('data', function(data) {
      result = JSON.parse(data.toString());
      console.log(result);
    });
  });
});

router.post("/problems", (req, res) => {
  const problem = new models.Problem(req.body);
  problem.save((err, problem) => {
    if (err) {
      res.status(500).send({ });
      return;
    }
    res.send({ id: problem._id })
  });
});


router.post("/problems/:id", (req, res) => {
  models.Problem.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, problem) => {
    if (err) {
      console.log(err);
      res.status(404).send({ });
      return;
    }
    res.send({ id: problem._id });
  });
});

router.get("/problems/:id", (req, res) => {
  models.Problem.findById(req.params.id, (err, problem) => {
    if (err) {
      res.status(404).send({ });
      return;
    }
    res.send(problem);
  });
});

router.get("/problems/submissions/:id", (req, res) => {
  models.Submission.find({ problem: req.params.id }, (err, submissions) => {
    if (err) {
      res.status(404).send({ });
      return;
    }
    res.send(submissions);
  })
});

module.exports = router;