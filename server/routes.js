const express = require('express');
const busboy = require('connect-busboy');
const models = require('./models');
const spawn = require('child_process').spawn;
const fs = require('fs');
const tmp = require('tmp');

const router = express.Router();


router.post("/problems/submit/:id", (req, res) => {
  models.Problem.findById(req.params.id, (err, problem) => {
    if (err) {
      res.status(404).send({ });
      return;
    }
    const code = req.body['code'];

    const submission = new models.Submission({
      code: req.body['code'],
      problem: problem._id,
      correct: 0,
      total: problem.testCases.length
    });
    submission.save().then(submission => {
      console.log("saved");

      const promise = Promise.resolve();
      for (let testCase of problem.testCases) {
        promise.then(() => {
          const intmp = tmp.fileSync();
          const outmp = tmp.fileSync();
          const codetmp = tmp.fileSync();

          fs.writeSync(intmp.fd, testCase.input);
          fs.writeSync(outmp.fd, testCase.output);
          fs.writeSync(codetmp.fd, code);

          // add a current loading test case
          submission.testCases.push({
            correct: true
          });
          console.log(submission);
          submission.save().then(submission => {
            console.log("spawning");
            let pythonProcess = spawn('python', ["../pygrader/pygrader/__init__.py", problem.name, "py", intmp.name, outmp.name, codetmp.name]);

            console.log("spawned");
            pythonProcess.stdout.on('data', function (data) {
              const result = JSON.parse(data.toString());

              console.log("setting testcase");
              submission.testCases[submission.testCases.length-1] = {
                correct: result.correct,
                message: result.message,
                time: result.time
              };

              if (result.correct) submission.correct++;

              if (testCase == problem.testCases[problem.testCases.length - 1]) {
                submission.done = true;
              }
              console.log("here saving");

              submission.save().then(() => Promise.resolve());
            });
          });
        });
      }

      res.send({ });
    }).catch(() => {
      res.status(500).send({ });
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
  models.Submission.find({ problem: req.params.id }).sort('-date').exec((err, submissions) => {
    if (err) {
      res.status(404).send({ });
      return;
    }
    res.send(submissions);
  })
});

module.exports = router;