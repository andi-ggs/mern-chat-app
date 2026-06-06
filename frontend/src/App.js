import './App.css';
import { Box } from '@chakra-ui/react';
import { Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage';
import Home from './Pages/Home'
import QuizPage from './Pages/QuizPage';
import SolveQuizzes from './Pages/SolveQuizzes';
import UploadExam from './Pages/UploadExam';
import ViewExams from './Pages/ViewExams';
import ViewPdf from './Pages/ViewPdf';


function App() {
  return (
    <Box
      minH="100vh"
      bgImage="url('/subtle-prism.png')" // put your image in public/images/
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
    <div className="App">
      <Route path='/' component={Homepage} exact/>
      <Route path='/chats' component={ChatPage}/>
      <Route path='/home' component={Home}/>
      <Route path='/quiz' component={QuizPage}/>
      <Route path='/solve-quizzes' component={SolveQuizzes}/>
      <Route path="/upload-exam" component={UploadExam} />
      <Route path="/view-exams" component={ViewExams} />
      <Route path="/view-exam/:examId" component={ViewPdf} />
    </div>
    </Box>
  );
}

export default App;
