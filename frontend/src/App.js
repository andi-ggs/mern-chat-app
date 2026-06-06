import './App.css';
import { Box } from '@chakra-ui/react';
import { Route, useLocation } from 'react-router-dom';
import SideDrawer, { NAVBAR_HEIGHT } from './appComponents/mischellaneous/SideDrawer';
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage';
import Home from './Pages/Home';
import QuizPage from './Pages/QuizPage';
import SolveQuizzes from './Pages/SolveQuizzes';
import UploadExam from './Pages/UploadExam';
import ViewExams from './Pages/ViewExams';
import ViewPdf from './Pages/ViewPdf';

const AUTH_ROUTE_PREFIXES = [
  '/home',
  '/chats',
  '/quiz',
  '/solve-quizzes',
  '/upload-exam',
  '/view-exams',
  '/view-exam',
];

const isAuthenticatedRoute = (pathname) =>
  AUTH_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

function App() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const showNavbar = Boolean(user) && isAuthenticatedRoute(location.pathname);

  return (
    <Box
      minH="100vh"
      bgImage="url('/subtle-prism.png')"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgAttachment="fixed"
    >
      {showNavbar && <SideDrawer />}

      <Box
        as="main"
        className="App"
        w="100%"
        minH="100vh"
        pt={showNavbar ? `${NAVBAR_HEIGHT}px` : 0}
      >
        <Route path="/" component={Homepage} exact />
        <Route path="/chats" component={ChatPage} />
        <Route path="/home" component={Home} />
        <Route path="/quiz" component={QuizPage} />
        <Route path="/solve-quizzes" component={SolveQuizzes} />
        <Route path="/upload-exam" component={UploadExam} />
        <Route path="/view-exams" component={ViewExams} />
        <Route path="/view-exam/:examId" component={ViewPdf} />
      </Box>
    </Box>
  );
}

export default App;
