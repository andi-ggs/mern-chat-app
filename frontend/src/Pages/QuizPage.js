import React, { useEffect, useState } from 'react';
import { Box, Button, Input, Textarea, VStack, HStack, Text, SimpleGrid } from '@chakra-ui/react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { QuizState } from '../context/quizProvider';
import GradientText from '../animations/gradientText';
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
    MenuSeparator,
} from "../components/ui/menu";
import { Avatar } from '@chakra-ui/react';
import UserProfileModal from '../appComponents/mischellaneous/UserProfileModal';
import { useHistory } from 'react-router-dom';
import axios from 'axios';


const QuizPage = () => {
    const { user, quizzes, fetchQuizzes, selectQuiz, selectedQuiz } = QuizState();
    const history = useHistory();
    const [showForm, setShowForm] = useState(false);
    const [quizTitle, setQuizTitle] = useState('');
    const [quizDescription, setQuizDescription] = useState('');
    const [questions, setQuestions] = useState([{
        text: '',
        answers: ['', '', '', ''],
        correctAnswer: ''
    }]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    // useEffect(() => {
    // // Încarcă quizurile doar dacă utilizatorul este logat
    // if (user) {
    //   fetchQuizzes(); // Încarcă quizurile
    // }
    // }, [user, fetchQuizzes]);
    const handleCreateQuiz = () => setShowForm(true);

    const saveQuiz = async () => {
        // Validate quiz title
        if (!quizTitle.trim()) {
            setMessage("Te rugăm să adaugi un titlu pentru quiz.");
            setMessageType("warning");
            setTimeout(() => setMessage(""), 5000);
            return;
        }

        // Validate questions
        const hasEmptyQuestions = questions.some(q => !q.text.trim());
        const hasEmptyAnswers = questions.some(q => q.answers.some(a => !a.trim()));
        const hasMissingCorrectAnswers = questions.some(q => !q.correctAnswer);

        if (hasEmptyQuestions || hasEmptyAnswers || hasMissingCorrectAnswers) {
            setMessage("Te rugăm să completezi toate câmpurile pentru fiecare întrebare.");
            setMessageType("warning");
            setTimeout(() => setMessage(""), 5000);
            return;
        }

        const formattedQuestions = questions.map(q => ({
            questionText: q.text,
            options: q.answers.map((ans, index) => ({
                text: ans,
                isCorrect: q.correctAnswer === String(index)
            }))
        }));

        const quizData = {
            title: quizTitle,
            description: quizDescription,
            questions: formattedQuestions,
            createdBy: user._id
        };

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post("/api/quiz", quizData, config);
            
            setMessage("Quiz salvat cu succes!");
            setMessageType("success");
            setTimeout(() => setMessage(""), 5000);

            // Reset form
            setQuizTitle("");
            setQuizDescription("");
            setQuestions([{
                text: '',
                answers: ['', '', '', ''],
                correctAnswer: ''
            }]);
            setShowForm(false);
            
            // Refresh quizzes list
            fetchQuizzes();
        } catch (error) {
            setMessage("A apărut o eroare! Nu s-a putut salva quiz-ul.");
            setMessageType("error");
            setTimeout(() => setMessage(""), 5000);
        }
    };

    const addQuestion = () => {
        setQuestions([...questions, {
            text: '',
            answers: ['', '', '', ''],
            correctAnswer: ''
        }]);
    };

    const removeQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    const updateQuestion = (index, text) => {
        const newQuestions = [...questions];
        newQuestions[index].text = text;
        setQuestions(newQuestions);
    };

    const updateAnswer = (qIndex, aIndex, text) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].answers[aIndex] = text;
        setQuestions(newQuestions);
    };

    const setCorrectAnswer = (qIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctAnswer = value;
        setQuestions(newQuestions);
    };

    if (!user) {
        return <div>Te rog autentifică-te pentru a accesa quizurile.</div>;
    }

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    };

    return (
        <Box display="flex" flexDirection="column" minH="0vh" bg="transparent" mt={40}>
            {/* Header */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="rgba(255, 255, 255, 0.9)"
                w="100%"
                p="10px"
                borderBottom="1px solid rgba(226, 232, 240, 0.5)"
                position="fixed"
                top="0"
                left="0"
                right="0"
                zIndex="1000"
                boxShadow="sm"
                backdropFilter="blur(10px)"
            >
                <HStack spacing={4} ml={0}>
                    <Button
                        as="a"
                        href="/home"
                        colorScheme="pink"
                        size="md"
                        bg="rgba(255, 182, 193, 0.9)"
                        _hover={{ bg: "rgba(255, 182, 193, 1)" }}
                        color="white"
                        boxShadow="lg"
                        borderRadius="full"
                        backdropFilter="blur(5px)"
                    >
                        Înapoi la pagina principală
                    </Button>
                    <Button
                        as="a"
                        href="/chats"
                        colorScheme="pink"
                        size="md"
                        bg="rgba(255, 182, 193, 0.9)"
                        _hover={{ bg: "rgba(255, 182, 193, 1)" }}
                        color="white"
                        boxShadow="lg"
                        borderRadius="full"
                        backdropFilter="blur(5px)"
                    >
                        Vezi Conversații
                    </Button>
                </HStack>
                <Box flex="0" display="flex" justifyContent="center">
                    <GradientText
                        colors={["#3A29FF", "#FF94B4", "#FF3232"]}
                        animationSpeed={3}
                        showBorder={false}
                        className="custom-class">
                        AskYourProf
                    </GradientText>
                </Box>
                <Box>
                    <MenuRoot closeOnSelect={false}>
                        <MenuTrigger asChild>
                            <Button size="lg"
                                variant="ghost"
                                _hover={{ bg: 'gray.300' }}
                                _active={{ bg: 'gray.300' }}
                                _focus={{ bg: 'gray.300' }}
                                _expanded={{ bg: 'gray.300' }}>
                                <Avatar.Root>
                                    <Avatar.Fallback name={user.name} />
                                    <Avatar.Image src={user.pic} />
                                </Avatar.Root>
                                <i className="fa-solid fa-chevron-down" style={{ color: 'black' }}></i>
                            </Button>
                        </MenuTrigger>
                        <MenuContent bg="white">
                            <MenuItem
                                bg="white"
                                color="black"
                                _hover={{ background: 'gray.300' }}
                            >
                                <UserProfileModal user={user} />
                                Profilul meu
                            </MenuItem>
                            <MenuSeparator color="grey" />
                            <MenuItem
                                bg="white"
                                color="black"
                                _hover={{ background: 'gray.300' }}
                                onClick={logoutHandler}
                            >Logout</MenuItem>
                        </MenuContent>
                    </MenuRoot>
                </Box>
            </Box>

            {!showForm && (
                <Box 
                    height="90vh" 
                    width="100%" 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center"
                >
                    <Button 
                        onClick={handleCreateQuiz}
                        size="lg"
                        fontSize="2xl"
                        py={8}
                        px={12}
                        colorScheme="pink"
                        bg="rgba(255, 182, 193, 0.9)"
                        _hover={{ bg: "rgba(255, 182, 193, 1)" }}
                        color="white"
                        boxShadow="lg"
                        borderRadius="full"
                        backdropFilter="blur(5px)"
                    >
                        Creează Quiz Nou
                    </Button>
                </Box>
            )}

            {/* Quiz Form */}
            {showForm && (
                <Box 
                    w="200%" 
                    display="flex" 
                    justifyContent="center"
                    alignItems="center"
                    position="relative"
                    left="50%"
                    transform="translateX(-50%)"
                >
                    <Box 
                        p={6} 
                        borderWidth={2} 
                        borderRadius="lg"
                        bg="rgba(255, 255, 255, 0.95)"
                        boxShadow="xl"
                        w="200%"
                        maxW="1200px"
                        maxH="80vh"
                        display="flex"
                        flexDirection="column"
                        position="relative"
                        backdropFilter="blur(10px)"
                    >
                        <VStack spacing={6} align="stretch" h="full">
                            {message && (
                                <Box 
                                    p={3} 
                                    mb={2}
                                    borderRadius="md" 
                                    bg={messageType === "success" ? "rgba(72, 187, 120, 0.2)" : "rgba(245, 101, 101, 0.2)"}
                                    color={messageType === "success" ? "green.800" : "red.800"}
                                    boxShadow="sm"
                                    backdropFilter="blur(5px)"
                                >
                                    {message}
                                </Box>
                            )}
                            
                            <Box flex="0 0 auto">
                                <Text fontSize="xl" fontWeight="bold" color="black" mb={2}>
                                    Titlul Quiz-ului
                                </Text>
                                <Input 
                                    placeholder="Introdu titlul quiz-ului" 
                                    value={quizTitle} 
                                    onChange={(e) => setQuizTitle(e.target.value)}
                                    size="lg"
                                    bg="rgba(255, 255, 255, 0.9)"
                                    borderColor="rgba(226, 232, 240, 0.5)"
                                    _hover={{ borderColor: "rgba(58, 41, 255, 0.5)" }}
                                    _focus={{ borderColor: "rgba(58, 41, 255, 0.8)", boxShadow: "0 0 0 1px rgba(58, 41, 255, 0.8)" }}
                                    color="black"
                                    _placeholder={{ color: "gray.400" }}
                                    backdropFilter="blur(5px)"
                                />
                            </Box>

                            <Box flex="0 0 auto">
                                <Text fontSize="xl" fontWeight="bold" color="black" mb={2}>
                                    Descrierea Quiz-ului
                                </Text>
                                <Textarea 
                                    placeholder="Introdu descrierea quiz-ului" 
                                    value={quizDescription} 
                                    onChange={(e) => setQuizDescription(e.target.value)}
                                    bg="white"
                                    borderColor="gray.200"
                                    _hover={{ borderColor: "blue.300" }}
                                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px blue.400" }}
                                    color="black"
                                    _placeholder={{ color: "gray.400" }}
                                    sx={{
                                        "&::placeholder": {
                                            color: "gray.400"
                                        },
                                        "&:focus": {
                                            borderColor: "blue.400",
                                            boxShadow: "0 0 0 1px blue.400"
                                        },
                                        "&:hover": {
                                            borderColor: "blue.300"
                                        },
                                        "caret-color": "black"
                                    }}
                                />
                            </Box>
                            
                            {/* Questions Section */}
                            <Box 
                                flex="1"
                                overflowY="auto" 
                                maxH="calc(80vh - 400px)"
                                pr={4}
                                mb={16}
                                css={{
                                    '&::-webkit-scrollbar': {
                                        width: '8px',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        background: '#f1f1f1',
                                        borderRadius: '4px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        background: '#4299e1',
                                        borderRadius: '4px',
                                    },
                                    '&::-webkit-scrollbar-thumb:hover': {
                                        background: '#3182ce',
                                    }
                                }}
                            >
                                <VStack spacing={4} align="stretch">
                                    {questions.map((q, qIndex) => (
                                        <Box 
                                            key={qIndex} 
                                            p={6} 
                                            borderWidth={1} 
                                            borderRadius="lg"
                                            bg="white"
                                            boxShadow="md"
                                            _hover={{ boxShadow: "lg" }}
                                            transition="all 0.2s"
                                        >
                                            <VStack spacing={4} align="stretch">
                                                <HStack justify="space-between">
                                                    <Text fontSize="lg" fontWeight="bold" color="black">
                                                        Întrebarea {qIndex + 1}
                                                    </Text>
                                                    {questions.length > 1 && (
                                                        <Button 
                                                            size="sm" 
                                                            colorScheme="red" 
                                                            onClick={() => removeQuestion(qIndex)}
                                                            bg="red.400"
                                                            _hover={{ bg: "red.500" }}
                                                            color="white"
                                                        >
                                                            Șterge
                                                        </Button>
                                                    )}
                                                </HStack>
                                                
                                                <Input 
                                                    placeholder="Textul întrebării" 
                                                    value={q.text} 
                                                    onChange={(e) => updateQuestion(qIndex, e.target.value)}
                                                    bg="white"
                                                    borderColor="gray.200"
                                                    _hover={{ borderColor: "blue.300" }}
                                                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px blue.400" }}
                                                    color="black"
                                                    _placeholder={{ color: "gray.400" }}
                                                    sx={{
                                                        "&::placeholder": {
                                                            color: "gray.400"
                                                        },
                                                        "&:focus": {
                                                            borderColor: "blue.400",
                                                            boxShadow: "0 0 0 1px blue.400"
                                                        },
                                                        "&:hover": {
                                                            borderColor: "blue.300"
                                                        },
                                                        "caret-color": "black"
                                                    }}
                                                />
                                                
                                                <Text fontWeight="medium" color="black">Răspunsuri:</Text>
                                                <RadioGroup.Root 
                                                    value={q.correctAnswer} 
                                                    onValueChange={(value) => setCorrectAnswer(qIndex, value)}
                                                    className="flex flex-col gap-3"
                                                >
                                                    {q.answers.map((ans, aIndex) => (
                                                        <HStack key={aIndex} spacing={3}>
                                                            <RadioGroup.Item 
                                                                value={String(aIndex)}
                                                                className="w-5 h-5 rounded-full border-2 border-blue-400 data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400 cursor-pointer"
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    borderRadius: '50%',
                                                                    border: '2px solid #4299e1',
                                                                    backgroundColor: q.correctAnswer === String(aIndex) ? '#4299e1' : 'white'
                                                                }}
                                                            >
                                                                <RadioGroup.Indicator 
                                                                    className="flex items-center justify-center w-full h-full relative"
                                                                    style={{
                                                                        display: q.correctAnswer === String(aIndex) ? 'flex' : 'none',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        width: '100%',
                                                                        height: '100%'
                                                                    }}
                                                                >
                                                                    <div style={{
                                                                        width: '10px',
                                                                        height: '10px',
                                                                        borderRadius: '50%',
                                                                        backgroundColor: 'white'
                                                                    }} />
                                                                </RadioGroup.Indicator>
                                                            </RadioGroup.Item>
                                                            <Input 
                                                                placeholder={`Răspuns ${aIndex + 1}`} 
                                                                value={ans} 
                                                                onChange={(e) => updateAnswer(qIndex, aIndex, e.target.value)}
                                                                bg="white"
                                                                borderColor="gray.200"
                                                                _hover={{ borderColor: "blue.300" }}
                                                                _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px blue.400" }}
                                                                color="black"
                                                                _placeholder={{ color: "gray.400" }}
                                                                sx={{
                                                                    "&::placeholder": {
                                                                        color: "gray.400"
                                                                    },
                                                                    "&:focus": {
                                                                        borderColor: "blue.400",
                                                                        boxShadow: "0 0 0 1px blue.400"
                                                                    },
                                                                    "&:hover": {
                                                                        borderColor: "blue.300"
                                                                    },
                                                                    "caret-color": "black"
                                                                }}
                                                            />
                                                        </HStack>
                                                    ))}
                                                </RadioGroup.Root>
                                            </VStack>
                                        </Box>
                                    ))}
                                </VStack>
                            </Box>

                            {/* Fixed Button Section */}
                            <Box
                                position="absolute"
                                bottom={0}
                                left={0}
                                right={0}
                                p={6}
                                bg="rgba(255, 255, 255, 0.95)"
                                borderTop="1px solid"
                                borderColor="rgba(226, 232, 240, 0.5)"
                                zIndex={2}
                                display="flex"
                                justifyContent="center"
                                backdropFilter="blur(10px)"
                            >
                                <HStack spacing={4}>
                                    <Button 
                                        onClick={addQuestion}
                                        bg="rgba(58, 41, 255, 0.9)"
                                        _hover={{ bg: "rgba(58, 41, 255, 1)" }}
                                        color="white"
                                        boxShadow="md"
                                        backdropFilter="blur(5px)"
                                    >
                                        Adaugă Întrebare
                                    </Button>
                                    <Button 
                                        colorScheme="red" 
                                        onClick={() => {
                                            setShowForm(false);
                                            setQuizTitle("");
                                            setQuizDescription("");
                                            setQuestions([{
                                                text: '',
                                                answers: ['', '', '', ''],
                                                correctAnswer: ''
                                            }]);
                                        }}
                                        bg="rgba(255, 50, 50, 0.9)"
                                        _hover={{ bg: "rgba(255, 50, 50, 1)" }}
                                        color="white"
                                        boxShadow="md"
                                        backdropFilter="blur(5px)"
                                    >
                                        Anulează
                                    </Button>
                                    <Button 
                                        colorScheme="green" 
                                        onClick={saveQuiz}
                                        bg="rgba(72, 187, 120, 0.9)"
                                        _hover={{ bg: "rgba(72, 187, 120, 1)" }}
                                        color="white"
                                        boxShadow="md"
                                        backdropFilter="blur(5px)"
                                    >
                                        Salvează Quiz
                                    </Button>
                                </HStack>
                            </Box>
                        </VStack>
                    </Box>
                </Box>
            )}

            {!showForm && quizzes.length > 0 && (
                <Box mt={8}>
                    <Text fontSize="2xl" fontWeight="bold" color="black" mb={6}>
                        Quizuri Disponibile
                    </Text>
                    <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                        {quizzes.map((quiz) => (
                            <Box 
                                key={quiz._id} 
                                p={6} 
                                borderWidth={1} 
                                borderRadius="lg"
                                bg="white"
                                boxShadow="md"
                                _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
                                transition="all 0.2s"
                            >
                                <VStack align="stretch" spacing={4}>
                                    <Text fontSize="xl" fontWeight="bold" color="black">
                                        {quiz.title}
                                    </Text>
                                    <Text color="black">
                                        {quiz.description}
                                    </Text>
                                    <Button 
                                        colorScheme="blue" 
                                        onClick={() => selectQuiz(quiz)}
                                        bg="blue.400"
                                        _hover={{ bg: "blue.500" }}
                                        color="white"
                                        boxShadow="md"
                                    >
                                        Vezi Detalii
                                    </Button>
                                </VStack>
                            </Box>
                        ))}
                    </SimpleGrid>
                </Box>
            )}
        </Box>
    );
};
export default QuizPage
