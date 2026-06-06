import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from "./components/ui/provider"
import { BrowserRouter } from 'react-router-dom';
import ChatProvider from './context/chatProvider'
import QuizProvider from './context/quizProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <BrowserRouter>
    <ChatProvider>
      <QuizProvider>
      <Provider>
        <App />
      </Provider>
      </QuizProvider>
      </ChatProvider>
    </BrowserRouter>
);

