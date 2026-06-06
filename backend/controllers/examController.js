const Exam = require('../models/examModel');
const User = require('../models/userModel');
const path = require('path');

// POST /api/exams - create exam (teacher only)
const createExam = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Ensure the PDF path is relative to the server root and has correct format
    let pdf = null;
    if (req.file) {
      // Replace backslashes with forward slashes and ensure path starts correctly
      pdf = 'uploads/exams/' + path.basename(req.file.path);
      pdf = pdf.replace(/\\/g, '/');
      console.log('Storing PDF path:', pdf);
    }
    
    const userId = req.user._id;

    // Check if user is teacher
    const user = await User.findById(userId);
    if (!user || user.occupation !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can add exams.' });
    }
    if (!title || !description || !pdf) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const exam = new Exam({
      title,
      description,
      pdf,
      createdBy: userId
    });
    await exam.save();
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/exams - get all exams
const getExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate('createdBy', 'name email pic')
      .sort({ createdAt: -1 });
    
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/exams/:id - get a single exam by id
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('createdBy', 'name email pic');
    
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createExam, getExams, getExamById }; 