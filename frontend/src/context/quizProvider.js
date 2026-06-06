import { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const QuizContext = createContext();

const QuizProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [quizzes, setQuizzes] = useState([]); // Stocăm quizurile aici
    const [selectedQuiz, setSelectedQuiz] = useState(null); // Quiz-ul selectat de utilizator
    const [userQuizzes, setUserQuizzes] = useState([]); // Quizurile la care utilizatorul a participat
    const history = useHistory();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        setUser(userInfo);

        if (!userInfo) {
            history.push('/'); // Dacă utilizatorul nu este logat, îl redirecționezi pe pagina principală
        }
    }, [history]);

    // Funcție pentru a încarca quizurile disponibile
    const fetchQuizzes = async () => {
        try {
            // Aici poți pune logica pentru a face fetch de quizuri dintr-o API
            const response = await fetch('/api/quiz');
            const data = await response.json();
            setQuizzes(data); // Setează quizurile disponibile
        } catch (error) {
            console.error('Eroare la încărcarea quizurilor:', error);
        }
    };

    // Funcție pentru a adăuga quizul selectat
    const selectQuiz = (quiz) => {
        setSelectedQuiz(quiz);
    };

    // Funcție pentru a salva quizurile la care a participat utilizatorul
    const addUserQuiz = (quiz) => {
        setUserQuizzes([...userQuizzes, quiz]);
    };

    return (
        <QuizContext.Provider value={{
            user,
            setUser,
            quizzes,
            setQuizzes,
            selectedQuiz,
            selectQuiz,
            userQuizzes,
            addUserQuiz,
            fetchQuizzes
        }}>
            {children}
        </QuizContext.Provider>
    );
};

export const QuizState = () => {
    return useContext(QuizContext);
};

export default QuizProvider;
