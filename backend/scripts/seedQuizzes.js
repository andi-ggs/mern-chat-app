const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Quiz = require('../models/quizModel');
const User = require('../models/userModel');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const QUIZ_FILES = [
    'quizzes_algebra.json',
    'quizzes_geo_plana.json',
    'quizzes_geo_spatiu.json',
];

const DUMMY_TEACHER = {
    name: 'Profesor Demo',
    email: 'profesor@askyourprof.ro',
    password: 'password123',
    occupation: 'teacher',
};

const loadQuizzesFromFile = (filename) => {
    const filePath = path.join(__dirname, '../data', filename);

    if (!fs.existsSync(filePath)) {
        console.warn(`⚠ Fișierul ${filename} nu a fost găsit. Se omite.`);
        return [];
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
        throw new Error(`Format invalid în ${filename}: se așteaptă un array de quiz-uri.`);
    }

    return parsed;
};

const findOrCreateTeacher = async () => {
    let teacher = await User.findOne({ occupation: 'teacher' });

    if (teacher) {
        console.log(`Profesor găsit: ${teacher.email}`);
        return teacher;
    }

    teacher = await User.create(DUMMY_TEACHER);
    console.log(`Profesor dummy creat: ${teacher.email}`);
    return teacher;
};

const seedQuizzes = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI lipsește din fișierul .env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectat la MongoDB');

    const teacher = await findOrCreateTeacher();

    const allQuizzes = QUIZ_FILES.flatMap(loadQuizzesFromFile);

    if (allQuizzes.length === 0) {
        console.log('Nu există quiz-uri de inserat.');
        await mongoose.connection.close();
        process.exit(0);
    }

    const quizzesToInsert = allQuizzes.map(({ title, description, questions }) => ({
        title,
        description,
        questions,
        createdBy: teacher._id,
    }));

    const inserted = await Quiz.insertMany(quizzesToInsert);

    console.log(`✅ Succes! Au fost inserate ${inserted.length} quiz-uri în colecția Quiz.`);
    await mongoose.connection.close();
    process.exit(0);
};

seedQuizzes().catch(async (error) => {
    console.error('❌ Eroare la popularea quiz-urilor:', error.message);
    await mongoose.connection.close();
    process.exit(1);
});
