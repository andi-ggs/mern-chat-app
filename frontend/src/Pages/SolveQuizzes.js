import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    Heading,
    Text,
    Button,
    Card,
    HStack,
    Badge,
    Flex,
    Accordion,
    Span,
    useDisclosure
} from '@chakra-ui/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import GradientText from '../animations/gradientText';
import UserProfileModal from '../appComponents/mischellaneous/UserProfileModal';
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
    MenuSeparator,
} from "../components/ui/menu";
import { Avatar } from '@chakra-ui/react';
import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog";

const SECOND = 1_000;
const MINUTE = SECOND * 60;

function useTimer(deadline, interval = SECOND) {
    const [timespan, setTimespan] = useState(new Date(deadline) - Date.now());
  
    useEffect(() => {
      // Actualizează imediat timpul rămas
      const updateTimespan = () => setTimespan(new Date(deadline) - Date.now());
      updateTimespan(); // Actualizare imediată
  
      const intervalId = setInterval(() => {
        setTimespan((_timespan) => Math.max(_timespan - interval, 0)); // Asigură-te că timpul nu scade sub 0
      }, interval);
  
      return () => {
        clearInterval(intervalId);
      };
    }, [deadline, interval]);
  
    return {
      minutes: Math.floor((timespan / MINUTE) % 60),
      seconds: Math.floor((timespan / SECOND) % 60),
      isExpired: timespan <= 0, // Verifică dacă timpul a expirat
    };
  }

const QuizList = ({ quizzes, onSelectQuiz }) => {
    return (
        <>
            <Box
                d="flex"
                justifyContent="center"
                alignItems="center"
                p={8}
                bgGradient="linear(to-r, #FFB6C1, #87CEEB)"
                w="100%"
                maxW="800px"
                m="40px auto 0 auto"
                borderRadius="2xl"
                boxShadow="2xl"
                textAlign="center"
                transition="all 0.3s ease-in-out"
                _hover={{ transform: 'scale(1.02)' }}
                animation="fadeIn 0.5s ease-in-out"
                sx={{
                    '@keyframes fadeIn': {
                        '0%': { opacity: 0, transform: 'translateY(20px)' },
                        '100%': { opacity: 1, transform: 'translateY(0)' }
                    }
                }}
                mt={20}
            >
                <VStack spacing={6}>
                    <Heading
                        fontSize="4xl"
                        fontWeight="bold"
                        fontFamily="work sans"
                        color="white"
                        textShadow="2px 2px 4px rgba(0,0,0,0.2)"
                    >
                        Rezolvă testele pentru Evaluarea Națională! 
                    </Heading>
                </VStack>
            </Box>
            <Box bg="white" borderRadius="lg" boxShadow="md" p={8} mt={4} width="1200px" maxW="98vw" mx="auto">
                <Accordion.Root collapsible>
                    {quizzes.map((quiz, index) => (
                        <Accordion.Item key={quiz._id} value={quiz._id}>
                            <Accordion.ItemTrigger>
                                <Span fontSize="xl" color="black" fontWeight="bold" textAlign="left">{quiz.title}</Span>
                                <Accordion.ItemIndicator />
                            </Accordion.ItemTrigger>
                            <Accordion.ItemContent>
                                <Accordion.ItemBody color="black">Descriere: {quiz.description}</Accordion.ItemBody>
                                <Text color="gray.600" fontSize="md" mb={2}>
                                    Autor: {quiz.createdBy?.name || 'Necunoscut'}
                                </Text>
                                <Button
                                    bg="lightblue"
                                    color="white"
                                    _hover={{ bg: "lightblue.100" }}
                                    _active={{ bg: "white", color: "lightblue", border: "2px solid lightblue" }}
                                    _focus={{ boxShadow: "none" }}
                                    mb={4}
                                    onClick={() => onSelectQuiz(quiz._id)}
                                    w="fit-content"
                                >
                                    Rezolva acum!
                                </Button>
                            </Accordion.ItemContent>
                        </Accordion.Item>
                    ))}
                </Accordion.Root>
            </Box>
        </>
    );
};

const QuizSolver = ({ quiz, onSubmit, deadline }) => {
    const [answers, setAnswers] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const history = useHistory();

    const { minutes, seconds, isExpired } = useTimer(deadline);

    const handleAnswer = (answer) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = answer;
        setAnswers(newAnswers);

        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            calculateCorrectAnswers(newAnswers); // Calculăm răspunsurile corecte
        }
    };

    const calculateCorrectAnswers = (submittedAnswers) => {
        let correct = 0;
        quiz.questions.forEach((question, index) => {
            if (question.correctAnswer === submittedAnswers[index]) {
                correct++;
            }
        });
        setCorrectAnswers(correct);
    };

    const handleSubmit = () => {
        onSubmit(answers); // Trimitem răspunsurile
    };

    const optionLabels = ["a", "b", "c", "d"];

    if (isExpired) {
        onSubmit(answers);
        return <Text fontSize="2xl" color="red.500">Timpul a expirat!</Text>;
    }

    return (
        <VStack spacing={8} width="800px" maxW="800px" p={20} bgGradient="linear(to-r, teal.500, green.500)" borderRadius="lg" boxShadow="xl" mt={20}>
            <Heading size="5xl" color="teal.600" fontWeight="bold" textAlign="center">{quiz.title}</Heading>
            <Text fontSize="4xl" fontWeight="bold" color="teal.400">
                Întrebarea {currentQuestion + 1} din {quiz.questions.length}
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="red.500">
                Timp rămas: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </Text>
            <Card.Root width="600px" maxW="800px" bg="white" borderRadius="xl" boxShadow="md">
                <Card.Body>
                    <VStack spacing={4}>
                        <Text fontSize="lg" color="gray.700">{quiz.questions[currentQuestion].questionText}</Text>
                        <VStack width="100%" spacing={2}>
                            {quiz.questions[currentQuestion].options.map((option, index) => (
                                <Button
                                    key={index}
                                    width="100%"
                                    variant="solid"
                                    colorScheme="teal"
                                    onClick={() => handleAnswer(option.text)}
                                    _hover={{ bg: "teal.600" }}
                                    transition="all 0.2s"
                                >
                                    {`${optionLabels[index]}. ${option.text}`}
                                </Button>
                            ))}
                        </VStack>
                    </VStack>
                </Card.Body>
            </Card.Root>
            <DialogRoot>
                <VStack spacing={4} mt={4}>
                    <Button
                        bg="gray.300"
                        color="black"
                        _hover={{ bg: "gray.400" }}
                        _active={{ bg: "gray.500" }}
                        onClick={() => history.push("/home")}
                        w="150px"
                    >
                        Cancel
                    </Button>
                    <DialogTrigger asChild>
                        <Button
                            bg="green.300"
                            color="white"
                            _hover={{ bg: "green.400" }}
                            _active={{ bg: "green.500" }}
                            w="150px"
                        >
                            Submit
                        </Button>
                    </DialogTrigger>
                </VStack>
                <DialogContent
                bg="white" /* Fundal alb */
                color="black" /* Text negru */
                borderRadius="lg" /* Colțuri rotunjite */
                boxShadow="xl" /* Umbră */
                maxW="500px" /* Lățime maximă */
                mx="auto" /* Centrare orizontală */
                mt="20vh" /* Centrare verticală */>
                    <DialogHeader>
                        <DialogTitle>Rezultatul Quiz-ului</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <Text fontSize="lg" fontWeight="bold">
                            Ai răspuns corect la {correctAnswers} din {quiz.questions.length} întrebări!
                        </Text>
                    </DialogBody>
                    <DialogFooter>
                        <DialogCloseTrigger asChild>
                            <Button colorScheme="green" onClick={() => history.push("/home")}>
                                OK
                            </Button>
                        </DialogCloseTrigger>
                    </DialogFooter>
                </DialogContent>
            </DialogRoot>
        </VStack>
    );
};

  const SolveQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [quizData, setQuizData] = useState(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem("userInfo"));

    // Calculăm deadline-ul o singură dată
    const [deadline] = useState(new Date(Date.now() + 60 * 60 * 1000 + 3 * 1000));

    useEffect(() => {
        if (!user) {
            history.push("/");
            return;
        }

        const fetchQuizzes = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                const response = await axios.get('/api/quiz', config);
                setQuizzes(response.data);
            } catch (error) {
                setMessage("Failed to fetch quizzes");
                setMessageType("error");
                setTimeout(() => setMessage(""), 5000);
            }
        };

        fetchQuizzes();
    }, [user, history]);

    const handleSelectQuiz = async (quizId) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const response = await axios.get(`/api/quiz/${quizId}`, config);
            setQuizData(response.data);
            setSelectedQuiz(quizId);
        } catch (error) {
            setMessage("Failed to load quiz");
            setMessageType("error");
            setTimeout(() => setMessage(""), 5000);
        }
    };

    const handleSubmit = async (answers) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const response = await axios.post(`/api/quiz/${selectedQuiz}/submit`, {
                answers
            }, config);

            setMessage(`Quiz submitted successfully! Your score: ${response.data.score.toFixed(1)}%`);
            setMessageType("success");
            setTimeout(() => setMessage(""), 5000);

            // Navigate back to quiz list
            setSelectedQuiz(null);
            setQuizData(null);
        } catch (error) {
            setMessage("Failed to submit quiz");
            setMessageType("error");
            setTimeout(() => setMessage(""), 5000);
        }
    };

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    };

    return (
        <Box p={8} bgGradient="linear(to-r, #FFB6C1, #87CEEB)" minH="100vh">
            {/* Header */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="rgba(255, 255, 255, 0.8)"
                w="100%"
                p="10px"
                borderBottom="1px solid rgba(226, 232, 240, 0.5)"
                position="fixed"
                top="0"
                left="0"
                right="0"
                zIndex="1000"
                boxShadow="md"
                backdropFilter="blur(10px)"
            >
                <HStack spacing={4}>
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
                        Vezi conversații
                    </Button>
                </HStack>
                <Box flex="0" display="flex" justifyContent="center">
                    <GradientText
                        colors={["#FFB6C1", "#87CEEB", "#98FB98"]}
                        animationSpeed={3}
                        showBorder={false}
                        className="custom-class">
                        AskYourProf
                    </GradientText>
                </Box>
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
            {message && (
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    bg={messageType === "warning" ? "yellow.100" : messageType === "success" ? "green.100" : "red.100"}
                    color={messageType === "warning" ? "yellow.800" : messageType === "success" ? "green.800" : "red.800"}
                    p="4"
                    mt="8"
                    borderRadius="md"
                    width="100%"
                >
                    {message}
                </Flex>
            )}
            {!selectedQuiz ? (
                <QuizList quizzes={quizzes} onSelectQuiz={handleSelectQuiz} />
            ) : (
                quizData && <QuizSolver quiz={quizData} onSubmit={handleSubmit} deadline={deadline} />
            )}
        </Box>
    );
};

export default SolveQuizzes;
