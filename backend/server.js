const express = require('express');
const { chats } = require('./data/data');
const dotenv = require('dotenv');
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const {notFound, errorHandler } = require('./middleware/errorMiddleware')
const quizRoutes = require('./routes/quizRoutes');
const examRoutes = require('./routes/examRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const path = require('path');

dotenv.config();
connectDB();
const app = express()

app.use(express.json());

app.get('/',(req,res)=>{
    res.send('API is running....successfully')
});

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)
app.use('/api/quiz', quizRoutes)
app.use('/api/exams', examRoutes)
app.use('/api/recommendations', recommendationRoutes)

// Explicitly log the static file path for debugging
const uploadsPath = path.join(__dirname, 'uploads');
console.log('Serving static files from:', uploadsPath);
// Serve uploaded files - make sure path is correct
app.use('/uploads', express.static(uploadsPath));

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

const server = app.listen(5000,console.log(`Server is running on port ${PORT}`));

const io = require('socket.io')(server, {
    pingTimeout:60000,
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log('User joined room' + room);

    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    socket.on("new message", (newMessageReceiver) => {
        var chat = newMessageReceiver.chat;
        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if (user._id == newMessageReceiver.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceiver);
        });
    });
});