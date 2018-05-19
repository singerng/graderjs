const mongoose = require('mongoose');
const Types = mongoose.Schema.Types;

const problemSchema = new mongoose.Schema({
  name: { type: Types.String, required: true },
  text: { type: Types.String, required: true },
  cases: [{
    sample: { type: Types.Boolean, default: false },
    input: Types.String,
    output: Types.String
  }]
});
const Problem = mongoose.model('Problem', problemSchema);


const submissionSchema = new mongoose.Schema({
  code: String,
  date: { type: Types.Date, default: Date.now },
  problem: { type: Types.ObjectId, ref: Problem },
  cases: [{
    correct: Types.Boolean,
    desc: Types.String
  }],
  done: Types.Boolean
});
const Submission = mongoose.model('Submission', submissionSchema);

module.exports = {
  Problem: Problem,
  Submission: Submission
};
