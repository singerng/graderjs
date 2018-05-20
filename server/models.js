const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Types = mongoose.Schema.Types;

const problemSchema = new mongoose.Schema({
  name: { type: Types.String, required: true },
  text: { type: Types.String, required: true },
  testCases: [{
    sample: { type: Types.Boolean, default: false },
    input: Types.String,
    output: Types.String
  }]
});
const Problem = mongoose.model('Problem', problemSchema);


const submissionSchema = new mongoose.Schema({
  code: Types.String,
  date: { type: Types.Date, default: Date.now },
  problem: { type: Types.ObjectId, ref: Problem },
  testCases: [{
    correct: Types.Boolean,
    message: Types.String,
    time: Types.Number
  }],
  correct: Types.Number,
  total: Types.Number,
  done: Types.Boolean
});
const Submission = mongoose.model('Submission', submissionSchema);

module.exports = {
  Problem: Problem,
  Submission: Submission
};
