import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    Box,
    VStack,
    HStack,
    Heading,
    Text,
    Button,
    Card,
    Badge,
    Flex,
    Progress,
    SimpleGrid,
    Icon,
    Circle,
} from '@chakra-ui/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaTrophy, FaStar, FaArrowLeft, FaArrowRight, FaBookOpen } from 'react-icons/fa';
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

const SECOND = 1_000;
const MINUTE = SECOND * 60;

const OPTION_STYLES = [
    { label: 'A', bg: 'rgba(99, 102, 241, 0.12)', border: '#6366F1', hover: 'rgba(99, 102, 241, 0.22)' },
    { label: 'B', bg: 'rgba(59, 130, 246, 0.12)', border: '#3B82F6', hover: 'rgba(59, 130, 246, 0.22)' },
    { label: 'C', bg: 'rgba(16, 185, 129, 0.12)', border: '#10B981', hover: 'rgba(16, 185, 129, 0.22)' },
    { label: 'D', bg: 'rgba(245, 158, 11, 0.12)', border: '#F59E0B', hover: 'rgba(245, 158, 11, 0.22)' },
];

const getEncouragementMessage = (score) => {
    if (score >= 90) return { title: 'Excelent!', subtitle: 'Performanță remarcabilă! Ești pe drumul cel bun.' };
    if (score >= 75) return { title: 'Foarte bine!', subtitle: 'Ai o înțelegere solidă a materiei. Continuă așa!' };
    if (score >= 60) return { title: 'Bun progres!', subtitle: 'Mai ai de lucru, dar ești pe direcția corectă.' };
    if (score >= 40) return { title: 'Mai exersează!', subtitle: 'Fiecare test te aduce mai aproape de succes.' };
    return { title: 'Nu renunța!', subtitle: 'Repetiția este cheia. Încearcă din nou și vei vedea progresul.' };
};

function useTimer(deadline, interval = SECOND) {
    const [timespan, setTimespan] = useState(new Date(deadline) - Date.now());

    useEffect(() => {
        const updateTimespan = () => setTimespan(new Date(deadline) - Date.now());
        updateTimespan();

        const intervalId = setInterval(() => {
            setTimespan((prev) => Math.max(prev - interval, 0));
        }, interval);

        return () => clearInterval(intervalId);
    }, [deadline, interval]);

    return {
        minutes: Math.floor((timespan / MINUTE) % 60),
        seconds: Math.floor((timespan / SECOND) % 60),
        isExpired: timespan <= 0,
        totalSeconds: Math.max(0, Math.floor(timespan / SECOND)),
    };
}

const QuizProgressBar = ({ current, total }) => {
    const progress = ((current + 1) / total) * 100;

    return (
        <Box w="100%">
            <Flex justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="semibold" color="gray.600">
                    Întrebarea {current + 1} din {total}
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="indigo.500">
                    {Math.round(progress)}%
                </Text>
            </Flex>
            <Progress.Root value={progress} size="md" colorPalette="purple" borderRadius="full">
                <Progress.Track bg="gray.100" borderRadius="full" h="10px">
                    <Progress.Range
                        borderRadius="full"
                        bg="linear-gradient(90deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)"
                        transition="width 0.4s ease"
                    />
                </Progress.Track>
            </Progress.Root>
            <HStack mt={2} spacing={1} justify="center">
                {Array.from({ length: total }).map((_, i) => (
                    <Box
                        key={i}
                        w={i === current ? '24px' : '8px'}
                        h="8px"
                        borderRadius="full"
                        bg={i < current ? 'green.400' : i === current ? 'indigo.500' : 'gray.200'}
                        transition="all 0.3s ease"
                    />
                ))}
            </HStack>
        </Box>
    );
};

const QuizList = ({ quizzes, onSelectQuiz }) => (
    <Box maxW="1100px" mx="auto" px={4} pt={24} pb={12}>
        <Box
            textAlign="center"
            mb={10}
            p={8}
            borderRadius="2xl"
            bg="rgba(255, 255, 255, 0.85)"
            boxShadow="xl"
            backdropFilter="blur(12px)"
            animation="fadeInUp 0.5s ease-out"
            css={{
                '@keyframes fadeInUp': {
                    '0%': { opacity: 0, transform: 'translateY(24px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
            }}
        >
            <Icon as={FaBookOpen} boxSize={10} color="indigo.500" mb={4} />
            <Heading fontSize={{ base: '2xl', md: '4xl' }} fontWeight="bold" color="gray.800" mb={2}>
                Rezolvă testele pentru Evaluarea Națională
            </Heading>
            <Text color="gray.600" fontSize="lg">
                Alege un quiz și testează-ți cunoștințele
            </Text>
        </Box>

        {quizzes.length === 0 ? (
            <Box textAlign="center" py={16} bg="white" borderRadius="xl" boxShadow="md">
                <Text color="gray.500" fontSize="lg">Nu există quiz-uri disponibile momentan.</Text>
            </Box>
        ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {quizzes.map((quiz, index) => (
                    <Card.Root
                        key={quiz._id}
                        bg="white"
                        borderRadius="xl"
                        boxShadow="md"
                        overflow="hidden"
                        transition="all 0.25s ease"
                        _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                        animation={`fadeInUp 0.5s ease-out ${index * 0.08}s both`}
                        css={{
                            '@keyframes fadeInUp': {
                                '0%': { opacity: 0, transform: 'translateY(20px)' },
                                '100%': { opacity: 1, transform: 'translateY(0)' },
                            },
                        }}
                    >
                        <Box h="4px" bg="linear-gradient(90deg, #6366F1, #8B5CF6, #EC4899)" />
                        <Card.Body p={6}>
                            <VStack align="stretch" spacing={4}>
                                <Heading size="md" color="gray.800" lineClamp={2}>
                                    {quiz.title}
                                </Heading>
                                <Text color="gray.600" fontSize="sm" lineClamp={3}>
                                    {quiz.description || 'Fără descriere'}
                                </Text>
                                <HStack justify="space-between">
                                    <Badge colorPalette="purple" variant="subtle" px={2} py={1} borderRadius="md">
                                        {quiz.questions?.length || '?'} întrebări
                                    </Badge>
                                    <Text fontSize="xs" color="gray.500">
                                        {quiz.createdBy?.name || 'Necunoscut'}
                                    </Text>
                                </HStack>
                                <Button
                                    w="100%"
                                    size="lg"
                                    bg="linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"
                                    color="white"
                                    _hover={{ bg: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', transform: 'scale(1.02)' }}
                                    _active={{ transform: 'scale(0.98)' }}
                                    borderRadius="xl"
                                    onClick={() => onSelectQuiz(quiz._id)}
                                    transition="all 0.2s"
                                >
                                    Începe testul
                                </Button>
                            </VStack>
                        </Card.Body>
                    </Card.Root>
                ))}
            </SimpleGrid>
        )}
    </Box>
);

const AnswerOption = ({ option, index, isSelected, onSelect, disabled }) => {
    const style = OPTION_STYLES[index] || OPTION_STYLES[0];

    return (
        <Button
            w="100%"
            h="auto"
            minH="64px"
            p={4}
            justifyContent="flex-start"
            bg={isSelected ? style.hover : style.bg}
            border="2px solid"
            borderColor={isSelected ? style.border : 'transparent'}
            borderRadius="xl"
            _hover={{ bg: style.hover, borderColor: style.border, transform: 'translateX(4px)' }}
            _active={{ transform: 'scale(0.98)' }}
            onClick={() => !disabled && onSelect(index)}
            transition="all 0.2s ease"
            boxShadow={isSelected ? 'md' : 'sm'}
            disabled={disabled}
            variant="ghost"
        >
            <HStack spacing={4} w="100%">
                <Circle
                    size="40px"
                    bg={style.border}
                    color="white"
                    fontWeight="bold"
                    fontSize="lg"
                    flexShrink={0}
                >
                    {style.label}
                </Circle>
                <Text
                    fontSize={{ base: 'md', md: 'lg' }}
                    fontWeight={isSelected ? 'semibold' : 'medium'}
                    color="gray.800"
                    textAlign="left"
                    flex={1}
                >
                    {option.text}
                </Text>
                {isSelected && <Icon as={FaCheckCircle} color={style.border} boxSize={5} />}
            </HStack>
        </Button>
    );
};

const QuizSolver = ({ quiz, onComplete, onCancel, deadline }) => {
    const totalQuestions = quiz.questions.length;
    const [answers, setAnswers] = useState(() => new Array(totalQuestions).fill(null));
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const startTimeRef = useRef(Date.now());
    const hasSubmittedRef = useRef(false);

    const { minutes, seconds, isExpired } = useTimer(deadline);
    const question = quiz.questions[currentQuestion];
    const selectedIndex = answers[currentQuestion];
    const isLastQuestion = currentQuestion === totalQuestions - 1;

    const calculateScore = useCallback((finalAnswers) => {
        let correct = 0;
        quiz.questions.forEach((q, i) => {
            if (finalAnswers[i] !== null && q.options[finalAnswers[i]]?.isCorrect) {
                correct++;
            }
        });
        const score = Math.round((correct / totalQuestions) * 100);
        return { correct, score };
    }, [quiz.questions, totalQuestions]);

    const finishQuiz = useCallback(async (finalAnswers) => {
        if (hasSubmittedRef.current || isSubmitting) return;
        hasSubmittedRef.current = true;
        setIsSubmitting(true);

        const { correct, score } = calculateScore(finalAnswers);
        const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

        await onComplete({
            answers: finalAnswers,
            score,
            durationSeconds,
            correctCount: correct,
        });
    }, [calculateScore, onComplete, isSubmitting]);

    useEffect(() => {
        if (isExpired && !hasSubmittedRef.current) {
            finishQuiz(answers);
        }
    }, [isExpired, answers, finishQuiz]);

    const handleSelectOption = (optionIndex) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = optionIndex;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (selectedIndex === null) return;
        if (isLastQuestion) {
            finishQuiz(answers);
        } else {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
        }
    };

    if (isSubmitting) {
        return (
            <Flex justify="center" align="center" minH="60vh" pt={24}>
                <VStack spacing={4}>
                    <Box
                        w="48px"
                        h="48px"
                        border="4px solid"
                        borderColor="indigo.200"
                        borderTopColor="indigo.500"
                        borderRadius="full"
                        animation="spin 0.8s linear infinite"
                        css={{ '@keyframes spin': { to: { transform: 'rotate(360deg)' } } }}
                    />
                    <Text color="gray.600" fontWeight="medium">Se calculează rezultatul...</Text>
                </VStack>
            </Flex>
        );
    }

    return (
        <Box maxW="720px" mx="auto" px={4} pt={24} pb={12}>
            <VStack spacing={6} align="stretch">
                <HStack justify="space-between" align="center">
                    <Button
                        variant="ghost"
                        size="sm"
                        color="gray.600"
                        onClick={onCancel}
                        _hover={{ bg: 'gray.100' }}
                    >
                        <Icon as={FaArrowLeft} mr={2} />
                        Înapoi
                    </Button>
                    <HStack
                        bg="white"
                        px={4}
                        py={2}
                        borderRadius="full"
                        boxShadow="md"
                        spacing={2}
                    >
                        <Icon as={FaClock} color={minutes < 5 ? 'red.500' : 'indigo.500'} />
                        <Text
                            fontWeight="bold"
                            fontSize="lg"
                            color={minutes < 5 ? 'red.500' : 'gray.700'}
                            fontFamily="mono"
                        >
                            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </Text>
                    </HStack>
                </HStack>

                <QuizProgressBar current={currentQuestion} total={totalQuestions} />

                <Card.Root
                    bg="white"
                    borderRadius="2xl"
                    boxShadow="xl"
                    overflow="hidden"
                    animation="slideIn 0.35s ease-out"
                    css={{
                        '@keyframes slideIn': {
                            '0%': { opacity: 0, transform: 'translateX(20px)' },
                            '100%': { opacity: 1, transform: 'translateX(0)' },
                        },
                    }}
                    key={currentQuestion}
                >
                    <Box h="3px" bg="linear-gradient(90deg, #6366F1, #8B5CF6)" />
                    <Card.Body p={{ base: 6, md: 8 }}>
                        <VStack spacing={6} align="stretch">
                            <Text
                                fontSize={{ base: 'lg', md: 'xl' }}
                                fontWeight="semibold"
                                color="gray.800"
                                lineHeight="tall"
                            >
                                {question.questionText}
                            </Text>

                            <VStack spacing={3} align="stretch">
                                {question.options.map((option, index) => (
                                    <AnswerOption
                                        key={index}
                                        option={option}
                                        index={index}
                                        isSelected={selectedIndex === index}
                                        onSelect={handleSelectOption}
                                        disabled={isExpired}
                                    />
                                ))}
                            </VStack>
                        </VStack>
                    </Card.Body>
                </Card.Root>

                <HStack justify="space-between" pt={2}>
                    <Button
                        variant="outline"
                        borderColor="gray.300"
                        color="gray.600"
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        borderRadius="xl"
                        _hover={{ bg: 'gray.50' }}
                    >
                        <Icon as={FaArrowLeft} mr={2} />
                        Anterior
                    </Button>
                    <Button
                        bg="linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"
                        color="white"
                        size="lg"
                        px={8}
                        borderRadius="xl"
                        onClick={handleNext}
                        disabled={selectedIndex === null || isExpired}
                        _hover={{ bg: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
                        _disabled={{ opacity: 0.5, cursor: 'not-allowed' }}
                    >
                        {isLastQuestion ? 'Finalizează testul' : 'Următoarea'}
                        {!isLastQuestion && <Icon as={FaArrowRight} ml={2} />}
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};

const AnimatedScore = ({ score }) => {
    const [displayScore, setDisplayScore] = useState(0);

    useEffect(() => {
        let frame;
        const duration = 1200;
        const start = performance.now();

        const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayScore(Math.round(eased * score));
            if (progress < 1) frame = requestAnimationFrame(animate);
        };

        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [score]);

    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (displayScore / 100) * circumference;

    return (
        <Box position="relative" w="220px" h="220px" mx="auto">
            <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="110" cy="110" r="90" fill="none" stroke="#E5E7EB" strokeWidth="12" />
                <circle
                    cx="110"
                    cy="110"
                    r="90"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 0.1s ease' }}
                />
                <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                </defs>
            </svg>
            <Flex
                position="absolute"
                top="0"
                left="0"
                w="100%"
                h="100%"
                direction="column"
                align="center"
                justify="center"
            >
                <Text fontSize="5xl" fontWeight="bold" color="gray.800" lineHeight="1">
                    {displayScore}%
                </Text>
                <Text fontSize="sm" color="gray.500" mt={1}>scor obținut</Text>
            </Flex>
        </Box>
    );
};

const QuizResults = ({ result, quizTitle, onRetry, onBackToList, onHome }) => {
    const { score, correctCount, total, durationSeconds } = result;
    const encouragement = getEncouragementMessage(score);

    const formatDuration = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return m > 0 ? `${m} min ${s} sec` : `${s} sec`;
    };

    return (
        <Box maxW="600px" mx="auto" px={4} pt={24} pb={12}>
            <Card.Root
                bg="white"
                borderRadius="2xl"
                boxShadow="2xl"
                overflow="hidden"
                animation="scaleIn 0.5s ease-out"
                css={{
                    '@keyframes scaleIn': {
                        '0%': { opacity: 0, transform: 'scale(0.9)' },
                        '100%': { opacity: 1, transform: 'scale(1)' },
                    },
                }}
            >
                <Box h="6px" bg="linear-gradient(90deg, #6366F1, #8B5CF6, #EC4899, #F59E0B)" />
                <Card.Body p={{ base: 6, md: 10 }}>
                    <VStack spacing={8}>
                        <VStack spacing={2} textAlign="center">
                            <Icon
                                as={score >= 75 ? FaTrophy : FaStar}
                                boxSize={8}
                                color={score >= 75 ? 'amber.400' : 'indigo.400'}
                                animation="bounce 1s ease infinite"
                                css={{
                                    '@keyframes bounce': {
                                        '0%, 100%': { transform: 'translateY(0)' },
                                        '50%': { transform: 'translateY(-6px)' },
                                    },
                                }}
                            />
                            <Heading size="xl" color="gray.800">{encouragement.title}</Heading>
                            <Text color="gray.600" fontSize="md">{encouragement.subtitle}</Text>
                            <Badge colorPalette="purple" variant="subtle" mt={1}>
                                {quizTitle}
                            </Badge>
                        </VStack>

                        <AnimatedScore score={score} />

                        <SimpleGrid columns={2} spacing={4} w="100%">
                            <Box bg="green.50" p={4} borderRadius="xl" textAlign="center">
                                <Icon as={FaCheckCircle} color="green.500" boxSize={5} mb={1} />
                                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                                    {correctCount}/{total}
                                </Text>
                                <Text fontSize="sm" color="gray.600">răspunsuri corecte</Text>
                            </Box>
                            <Box bg="indigo.50" p={4} borderRadius="xl" textAlign="center">
                                <Icon as={FaClock} color="indigo.500" boxSize={5} mb={1} />
                                <Text fontSize="2xl" fontWeight="bold" color="indigo.600">
                                    {formatDuration(durationSeconds)}
                                </Text>
                                <Text fontSize="sm" color="gray.600">timp petrecut</Text>
                            </Box>
                        </SimpleGrid>

                        <VStack spacing={3} w="100%">
                            <Button
                                w="100%"
                                size="lg"
                                bg="linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"
                                color="white"
                                borderRadius="xl"
                                onClick={onRetry}
                                _hover={{ bg: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
                            >
                                Rezolvă din nou
                            </Button>
                            <HStack w="100%" spacing={3}>
                                <Button
                                    flex={1}
                                    variant="outline"
                                    borderColor="gray.300"
                                    borderRadius="xl"
                                    onClick={onBackToList}
                                    _hover={{ bg: 'gray.50' }}
                                >
                                    Alte quiz-uri
                                </Button>
                                <Button
                                    flex={1}
                                    variant="ghost"
                                    color="gray.600"
                                    borderRadius="xl"
                                    onClick={onHome}
                                    _hover={{ bg: 'gray.100' }}
                                >
                                    Acasă
                                </Button>
                            </HStack>
                        </VStack>
                    </VStack>
                </Card.Body>
            </Card.Root>
        </Box>
    );
};

const SolveQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [quizData, setQuizData] = useState(null);
    const [phase, setPhase] = useState('list');
    const [resultData, setResultData] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('userInfo'));

    const [sessionKey, setSessionKey] = useState(0);
    const deadline = useMemo(
        () => new Date(Date.now() + 60 * 60 * 1000),
        [sessionKey]
    );

    useEffect(() => {
        if (!user) {
            history.push('/');
            return;
        }

        const fetchQuizzes = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const response = await axios.get('/api/quiz', config);
                setQuizzes(response.data);
            } catch (error) {
                setMessage('Nu s-au putut încărca quiz-urile.');
                setMessageType('error');
                setTimeout(() => setMessage(''), 5000);
            }
        };

        fetchQuizzes();
    }, [user, history]);

    const handleSelectQuiz = async (quizId) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const response = await axios.get(`/api/quiz/${quizId}`, config);
            setQuizData(response.data);
            setSelectedQuiz(quizId);
            setPhase('solving');
            setResultData(null);
            setSessionKey((k) => k + 1);
        } catch (error) {
            setMessage('Nu s-a putut încărca quiz-ul.');
            setMessageType('error');
            setTimeout(() => setMessage(''), 5000);
        }
    };

    const handleQuizComplete = async ({ answers, score, durationSeconds, correctCount }) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };

            await axios.post('/api/quiz/submit', {
                quizId: selectedQuiz,
                answers,
                score,
                durationSeconds,
            }, config);

            setResultData({
                score,
                correctCount,
                total: quizData.questions.length,
                durationSeconds,
            });
            setPhase('results');
        } catch (error) {
            setMessage('Nu s-a putut trimite rezultatul. Încearcă din nou.');
            setMessageType('error');
            setTimeout(() => setMessage(''), 5000);
            setPhase('solving');
        }
    };

    const handleRetry = () => {
        setPhase('solving');
        setResultData(null);
        setSessionKey((k) => k + 1);
    };

    const handleBackToList = () => {
        setSelectedQuiz(null);
        setQuizData(null);
        setPhase('list');
        setResultData(null);
    };

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        history.push('/');
    };

    return (
        <Box minH="100vh" bg="linear-gradient(160deg, #F8FAFC 0%, #EEF2FF 40%, #FDF2F8 100%)">
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
                <HStack spacing={4}>
                    <Button
                        as="a"
                        href="/home"
                        colorScheme="pink"
                        size="md"
                        bg="rgba(255, 182, 193, 0.9)"
                        _hover={{ bg: 'rgba(255, 182, 193, 1)' }}
                        color="white"
                        boxShadow="lg"
                        borderRadius="full"
                    >
                        Înapoi la pagina principală
                    </Button>
                    <Button
                        as="a"
                        href="/chats"
                        colorScheme="pink"
                        size="md"
                        bg="rgba(255, 182, 193, 0.9)"
                        _hover={{ bg: 'rgba(255, 182, 193, 1)' }}
                        color="white"
                        boxShadow="lg"
                        borderRadius="full"
                    >
                        Vezi conversații
                    </Button>
                </HStack>
                <Box flex="0" display="flex" justifyContent="center">
                    <GradientText
                        colors={['#6366F1', '#8B5CF6', '#EC4899']}
                        animationSpeed={3}
                        showBorder={false}
                        className="custom-class"
                    >
                        AskYourProf
                    </GradientText>
                </Box>
                <MenuRoot closeOnSelect={false}>
                    <MenuTrigger asChild>
                        <Button
                            size="lg"
                            variant="ghost"
                            _hover={{ bg: 'gray.300' }}
                            _active={{ bg: 'gray.300' }}
                            _focus={{ bg: 'gray.300' }}
                            _expanded={{ bg: 'gray.300' }}
                        >
                            <Avatar.Root>
                                <Avatar.Fallback name={user?.name} />
                                <Avatar.Image src={user?.pic} />
                            </Avatar.Root>
                            <i className="fa-solid fa-chevron-down" style={{ color: 'black' }}></i>
                        </Button>
                    </MenuTrigger>
                    <MenuContent bg="white">
                        <MenuItem bg="white" color="black" _hover={{ background: 'gray.300' }}>
                            <UserProfileModal user={user} />
                            Profilul meu
                        </MenuItem>
                        <MenuSeparator color="grey" />
                        <MenuItem
                            bg="white"
                            color="black"
                            _hover={{ background: 'gray.300' }}
                            onClick={logoutHandler}
                        >
                            Logout
                        </MenuItem>
                    </MenuContent>
                </MenuRoot>
            </Box>

            {message && (
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    bg={messageType === 'success' ? 'green.100' : 'red.100'}
                    color={messageType === 'success' ? 'green.800' : 'red.800'}
                    p="4"
                    mt="16"
                    borderRadius="md"
                    maxW="600px"
                    mx="auto"
                >
                    {message}
                </Flex>
            )}

            {phase === 'list' && (
                <QuizList quizzes={quizzes} onSelectQuiz={handleSelectQuiz} />
            )}
            {phase === 'solving' && quizData && (
                <QuizSolver
                    key={`${selectedQuiz}-${sessionKey}`}
                    quiz={quizData}
                    onComplete={handleQuizComplete}
                    onCancel={handleBackToList}
                    deadline={deadline}
                />
            )}
            {phase === 'results' && resultData && (
                <QuizResults
                    result={resultData}
                    quizTitle={quizData?.title}
                    onRetry={handleRetry}
                    onBackToList={handleBackToList}
                    onHome={() => history.push('/home')}
                />
            )}
        </Box>
    );
};

export default SolveQuizzes;
