const mongoose = require('mongoose');

const examSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  pdf: { type: String, required: true }, // store file path
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const Exam = mongoose.model('Exam', examSchema);
module.exports = Exam; 