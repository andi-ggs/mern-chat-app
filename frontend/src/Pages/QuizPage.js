import React, { useState } from 'react';
import {
    Box,
    Button,
    Input,
    Textarea,
    VStack,
    HStack,
    Text,
    SimpleGrid,
    Heading,
    Container,
    Flex,
    Icon,
    Card,
} from '@chakra-ui/react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { FaPlus, FaTrash, FaClipboardList } from 'react-icons/fa';
import { QuizState } from '../context/quizProvider';
import GradientText from '../animations/gradientText';
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
    MenuSeparator,
} from '../components/ui/menu';
import { Avatar } from '@chakra-ui/react';
import UserProfileModal from '../appComponents/mischellaneous/UserProfileModal';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const EMPTY_QUESTION = {
    text: '',
    answers: ['', '', '', ''],
    correctAnswer: '',
};

const QuizPage = () => {
    const { user, quizzes, fetchQuizzes } = QuizState();
    const history = useHistory();
    const [showForm, setShowForm] = useState(false);
    const [quizTitle, setQuizTitle] = useState('');
    const [quizDescription, setQuizDescription] = useState('');
    const [questions, setQuestions] = useState([{ ...EMPTY_QUESTION }]);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(''), 5000);
    };

    const handleCreateQuiz = () => setShowForm(true);

    const saveQuiz = async () => {
        if (!quizTitle.trim()) {
            showMessage('Te rugăm să adaugi un titlu pentru quiz.', 'warning');
            return;
        }

        const hasEmptyQuestions = questions.some((q) => !q.text.trim());
        const hasEmptyAnswers = questions.some((q) => q.answers.some((a) => !a.trim()));
        const hasMissingCorrectAnswers = questions.some((q) => !q.correctAnswer);

        if (hasEmptyQuestions || hasEmptyAnswers || hasMissingCorrectAnswers) {
            showMessage('Te rugăm să completezi toate câmpurile pentru fiecare întrebare.', 'warning');
            return;
        }

        const formattedQuestions = questions.map((q) => ({
            questionText: q.text,
            options: q.answers.map((ans, index) => ({
                text: ans,
                isCorrect: q.correctAnswer === String(index),
            })),
        }));

        const quizData = {
            title: quizTitle,
            description: quizDescription,
            questions: formattedQuestions,
            createdBy: user._id,
        };

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };

            await axios.post('/api/quiz', quizData, config);

            showMessage('Quiz salvat cu succes!', 'success');
            setQuizTitle('');
            setQuizDescription('');
            setQuestions([{ ...EMPTY_QUESTION }]);
            setShowForm(false);
            fetchQuizzes();
        } catch (error) {
            showMessage('A apărut o eroare! Nu s-a putut salva quiz-ul.', 'error');
        }
    };

    const addQuestion = () => {
        setQuestions([...questions, { ...EMPTY_QUESTION }]);
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
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

    const resetForm = () => {
        setShowForm(false);
        setQuizTitle('');
        setQuizDescription('');
        setQuestions([{ ...EMPTY_QUESTION }]);
    };

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        history.push('/');
    };

    if (!user) {
        return (
            <Flex minH="100vh" align="center" justify="center" bg="gray.50">
                <Text fontSize="lg" color="gray.600">
                    Te rog autentifică-te pentru a accesa quizurile.
                </Text>
            </Flex>
        );
    }

    const inputStyles = {
        bg: 'white',
        borderColor: 'gray.200',
        color: 'gray.800',
        fontSize: 'md',
        _hover: { borderColor: 'indigo.300' },
        _focus: { borderColor: 'indigo.500', boxShadow: '0 0 0 1px var(--chakra-colors-indigo-500)' },
        _placeholder: { color: 'gray.400' },
    };

    return (
        <Box minH="100vh" bg="linear-gradient(160deg, #F8FAFC 0%, #EEF2FF 40%, #FDF2F8 100%)">
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="rgba(255, 255, 255, 0.92)"
                w="100%"
                px={{ base: 3, md: 5 }}
                py={3}
                borderBottom="1px solid"
                borderColor="gray.100"
                position="fixed"
                top="0"
                left="0"
                right="0"
                zIndex="1000"
                boxShadow="sm"
                backdropFilter="blur(12px)"
            >
                <HStack spacing={3}>
                    <Button
                        as="a"
                        href="/home"
                        size="sm"
                        bg="rgba(255, 182, 193, 0.9)"
                        _hover={{ bg: 'rgba(255, 182, 193, 1)' }}
                        color="white"
                        borderRadius="full"
                        fontWeight="medium"
                    >
                        Acasă
                    </Button>
                    <Button
                        as="a"
                        href="/chats"
                        size="sm"
                        bg="rgba(255, 182, 193, 0.9)"
                        _hover={{ bg: 'rgba(255, 182, 193, 1)' }}
                        color="white"
                        borderRadius="full"
                        fontWeight="medium"
                        display={{ base: 'none', sm: 'inline-flex' }}
                    >
                        Conversații
                    </Button>
                    <Button
                        as="a"
                        href="/solve-quizzes"
                        size="sm"
                        bg="linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"
                        _hover={{ bg: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
                        color="white"
                        borderRadius="full"
                        fontWeight="medium"
                    >
                        Rezolvă Quiz-uri
                    </Button>
                </HStack>
                <GradientText
                    colors={['#3A29FF', '#FF94B4', '#FF3232']}
                    animationSpeed={3}
                    showBorder={false}
                    className="custom-class"
                >
                    AskYourProf
                </GradientText>
                <MenuRoot closeOnSelect={false}>
                    <MenuTrigger asChild>
                        <Button size="lg" variant="ghost" _hover={{ bg: 'gray.100' }}>
                            <Avatar.Root>
                                <Avatar.Fallback name={user.name} />
                                <Avatar.Image src={user.pic} />
                            </Avatar.Root>
                            <i className="fa-solid fa-chevron-down" style={{ color: 'black' }} />
                        </Button>
                    </MenuTrigger>
                    <MenuContent bg="white">
                        <MenuItem bg="white" color="black" _hover={{ background: 'gray.100' }}>
                            <UserProfileModal user={user} />
                            Profilul meu
                        </MenuItem>
                        <MenuSeparator color="grey" />
                        <MenuItem bg="white" color="black" _hover={{ background: 'gray.100' }} onClick={logoutHandler}>
                            Logout
                        </MenuItem>
                    </MenuContent>
                </MenuRoot>
            </Box>

            <Container maxW="1100px" px={4} pt={28} pb={16}>
                {!showForm && (
                    <Flex direction="column" align="center" py={{ base: 12, md: 20 }}>
                        <Box textAlign="center" mb={10}>
                            <Icon as={FaClipboardList} boxSize={14} color="indigo.500" mb={5} />
                            <Heading
                                fontSize={{ base: '2xl', md: '4xl' }}
                                fontWeight="bold"
                                color="gray.800"
                                mb={3}
                                letterSpacing="-0.02em"
                            >
                                Creează quiz-uri pentru elevi
                            </Heading>
                            <Text color="gray.600" fontSize="lg" lineHeight="1.7" maxW="500px">
                                Construiește teste interactive cu întrebări multiple pentru pregătirea la Evaluarea Națională
                            </Text>
                        </Box>
                        <Button
                            onClick={handleCreateQuiz}
                            size="lg"
                            h="56px"
                            px={10}
                            fontSize="lg"
                            fontWeight="semibold"
                            bg="linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"
                            _hover={{ bg: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
                            color="white"
                            borderRadius="xl"
                            boxShadow="lg"
                        >
                            Creează Quiz Nou
                        </Button>
                    </Flex>
                )}

                {showForm && (
                    <Card.Root bg="white" borderRadius="2xl" boxShadow="xl" overflow="hidden">
                        <Box h="5px" bg="linear-gradient(90deg, #6366F1, #8B5CF6, #EC4899)" />
                        <Card.Body p={{ base: 6, md: 8 }}>
                            <VStack spacing={8} align="stretch">
                                {message && (
                                    <Box
                                        p={4}
                                        borderRadius="xl"
                                        bg={
                                            messageType === 'success'
                                                ? 'green.50'
                                                : messageType === 'warning'
                                                  ? 'orange.50'
                                                  : 'red.50'
                                        }
                                        color={
                                            messageType === 'success'
                                                ? 'green.800'
                                                : messageType === 'warning'
                                                  ? 'orange.800'
                                                  : 'red.800'
                                        }
                                        fontSize="md"
                                        lineHeight="1.5"
                                    >
                                        {message}
                                    </Box>
                                )}

                                <Box>
                                    <Text fontSize="md" fontWeight="semibold" color="gray.700" mb={2}>
                                        Titlul quiz-ului
                                    </Text>
                                    <Input
                                        placeholder="Introdu titlul quiz-ului"
                                        value={quizTitle}
                                        onChange={(e) => setQuizTitle(e.target.value)}
                                        size="lg"
                                        h="52px"
                                        {...inputStyles}
                                    />
                                </Box>

                                <Box>
                                    <Text fontSize="md" fontWeight="semibold" color="gray.700" mb={2}>
                                        Descrierea quiz-ului
                                    </Text>
                                    <Textarea
                                        placeholder="Introdu descrierea quiz-ului"
                                        value={quizDescription}
                                        onChange={(e) => setQuizDescription(e.target.value)}
                                        minH="100px"
                                        fontSize="md"
                                        lineHeight="1.6"
                                        {...inputStyles}
                                    />
                                </Box>

                                <Box>
                                    <Heading size="md" color="gray.800" mb={5}>
                                        Întrebări ({questions.length})
                                    </Heading>
                                    <VStack spacing={5} align="stretch">
                                        {questions.map((q, qIndex) => (
                                            <Box
                                                key={qIndex}
                                                p={{ base: 5, md: 6 }}
                                                borderWidth="1px"
                                                borderColor="gray.100"
                                                borderRadius="2xl"
                                                bg="gray.50"
                                            >
                                                <VStack spacing={5} align="stretch">
                                                    <HStack justify="space-between">
                                                        <Text fontSize="md" fontWeight="bold" color="gray.800">
                                                            Întrebarea {qIndex + 1}
                                                        </Text>
                                                        {questions.length > 1 && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                color="red.500"
                                                                onClick={() => removeQuestion(qIndex)}
                                                                _hover={{ bg: 'red.50' }}
                                                            >
                                                                <Icon as={FaTrash} mr={1} />
                                                                Șterge
                                                            </Button>
                                                        )}
                                                    </HStack>

                                                    <Input
                                                        placeholder="Textul întrebării"
                                                        value={q.text}
                                                        onChange={(e) => updateQuestion(qIndex, e.target.value)}
                                                        size="lg"
                                                        {...inputStyles}
                                                    />

                                                    <Text fontWeight="semibold" color="gray.700" fontSize="sm">
                                                        Răspunsuri (selectează răspunsul corect)
                                                    </Text>
                                                    <RadioGroup.Root
                                                        value={q.correctAnswer}
                                                        onValueChange={(value) => setCorrectAnswer(qIndex, value)}
                                                    >
                                                        <VStack spacing={3} align="stretch">
                                                            {q.answers.map((ans, aIndex) => (
                                                                <HStack key={aIndex} spacing={3}>
                                                                    <RadioGroup.Item
                                                                        value={String(aIndex)}
                                                                        style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            width: '22px',
                                                                            height: '22px',
                                                                            borderRadius: '50%',
                                                                            border: '2px solid #6366F1',
                                                                            backgroundColor:
                                                                                q.correctAnswer === String(aIndex)
                                                                                    ? '#6366F1'
                                                                                    : 'white',
                                                                            cursor: 'pointer',
                                                                            flexShrink: 0,
                                                                        }}
                                                                    >
                                                                        <RadioGroup.Indicator
                                                                            style={{
                                                                                display:
                                                                                    q.correctAnswer === String(aIndex)
                                                                                        ? 'flex'
                                                                                        : 'none',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                width: '100%',
                                                                                height: '100%',
                                                                            }}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    width: '10px',
                                                                                    height: '10px',
                                                                                    borderRadius: '50%',
                                                                                    backgroundColor: 'white',
                                                                                }}
                                                                            />
                                                                        </RadioGroup.Indicator>
                                                                    </RadioGroup.Item>
                                                                    <Input
                                                                        placeholder={`Răspuns ${aIndex + 1}`}
                                                                        value={ans}
                                                                        onChange={(e) =>
                                                                            updateAnswer(qIndex, aIndex, e.target.value)
                                                                        }
                                                                        flex={1}
                                                                        {...inputStyles}
                                                                    />
                                                                </HStack>
                                                            ))}
                                                        </VStack>
                                                    </RadioGroup.Root>
                                                </VStack>
                                            </Box>
                                        ))}
                                    </VStack>
                                </Box>

                                <HStack spacing={4} justify="center" flexWrap="wrap" pt={2}>
                                    <Button
                                        onClick={addQuestion}
                                        variant="outline"
                                        borderColor="indigo.300"
                                        color="indigo.600"
                                        borderRadius="xl"
                                        h="48px"
                                        _hover={{ bg: 'indigo.50' }}
                                    >
                                        <Icon as={FaPlus} mr={2} />
                                        Adaugă întrebare
                                    </Button>
                                    <Button
                                        onClick={resetForm}
                                        variant="outline"
                                        borderColor="gray.300"
                                        color="gray.600"
                                        borderRadius="xl"
                                        h="48px"
                                        _hover={{ bg: 'gray.50' }}
                                    >
                                        Anulează
                                    </Button>
                                    <Button
                                        onClick={saveQuiz}
                                        bg="linear-gradient(135deg, #10B981 0%, #059669 100%)"
                                        _hover={{ bg: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}
                                        color="white"
                                        borderRadius="xl"
                                        h="48px"
                                        px={8}
                                        fontWeight="semibold"
                                    >
                                        Salvează quiz
                                    </Button>
                                </HStack>
                            </VStack>
                        </Card.Body>
                    </Card.Root>
                )}

                {!showForm && quizzes.length > 0 && (
                    <Box mt={12}>
                        <Heading size="lg" color="gray.800" mb={6} letterSpacing="-0.01em">
                            Quizuri disponibile
                        </Heading>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                            {quizzes.map((quiz) => (
                                <Card.Root
                                    key={quiz._id}
                                    bg="white"
                                    borderRadius="2xl"
                                    boxShadow="md"
                                    overflow="hidden"
                                    transition="all 0.2s"
                                    _hover={{ boxShadow: 'xl', transform: 'translateY(-3px)' }}
                                >
                                    <Box h="4px" bg="linear-gradient(90deg, #6366F1, #8B5CF6)" />
                                    <Card.Body p={6}>
                                        <VStack align="stretch" spacing={4}>
                                            <Heading size="md" color="gray.800" lineHeight="1.4">
                                                {quiz.title}
                                            </Heading>
                                            <Text color="gray.600" fontSize="md" lineHeight="1.6">
                                                {quiz.description}
                                            </Text>
                                            <Button
                                                as="a"
                                                href="/solve-quizzes"
                                                bg="linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"
                                                _hover={{ bg: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
                                                color="white"
                                                borderRadius="xl"
                                                h="44px"
                                                fontWeight="semibold"
                                            >
                                                Rezolvă acum
                                            </Button>
                                        </VStack>
                                    </Card.Body>
                                </Card.Root>
                            ))}
                        </SimpleGrid>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default QuizPage;
