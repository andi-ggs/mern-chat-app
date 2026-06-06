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
    Container,
} from '@chakra-ui/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import {
    FaClock,
    FaCheckCircle,
    FaTrophy,
    FaStar,
    FaArrowLeft,
    FaArrowRight,
    FaBookOpen,
} from 'react-icons/fa';
import GradientText from '../animations/gradientText';
import UserProfileModal from '../appComponents/mischellaneous/UserProfileModal';
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
    MenuSeparator,
} from '../components/ui/menu';
import { Avatar } from '@chakra-ui/react';

const SECOND = 1_000;
const MINUTE = SECOND * 60;

const OPTION_STYLES = [
    { label: 'A', bg: '#EEF2FF', border: '#6366F1', hover: '#E0E7FF', text: '#4338CA' },
    { label: 'B', bg: '#EFF6FF', border: '#3B82F6', hover: '#DBEAFE', text: '#1D4ED8' },
    { label: 'C', bg: '#ECFDF5', border: '#10B981', hover: '#D1FAE5', text: '#047857' },
    { label: 'D', bg: '#FFFBEB', border: '#F59E0B', hover: '#FEF3C7', text: '#B45309' },
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
    };
}

const PageHeader = ({ user, onLogout }) => (
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
        </HStack>
        <GradientText
            colors={['#6366F1', '#8B5CF6', '#EC4899']}
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
                        <Avatar.Fallback name={user?.name} />
                        <Avatar.Image src={user?.pic} />
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
                <MenuItem bg="white" color="black" _hover={{ background: 'gray.100' }} onClick={onLogout}>
                    Logout
                </MenuItem>
            </MenuContent>
        </MenuRoot>
    </Box>
);

const QuizList = ({ quizzes, onSelectQuiz }) => (
    <Container maxW="1100px" px={4} pt={28} pb={16}>
        <Box textAlign="center" mb={12} p={{ base: 6, md: 10 }} borderRadius="2xl" bg="white" boxShadow="lg">
            <Icon as={FaBookOpen} boxSize={12} color="indigo.500" mb={5} />
            <Heading
                fontSize={{ base: '2xl', md: '4xl' }}
                fontWeight="bold"
                color="gray.800"
                mb={3}
                letterSpacing="-0.02em"
                lineHeight="1.2"
            >
                Rezolvă testele pentru Evaluarea Națională
            </Heading>
            <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.7" maxW="560px" mx="auto">
                Alege un quiz și testează-ți cunoștințele într-un format interactiv
            </Text>
        </Box>

        {quizzes.length === 0 ? (
            <Box textAlign="center" py={20} bg="white" borderRadius="2xl" boxShadow="md">
                <Text color="gray.500" fontSize="lg" lineHeight="1.6">
                    Nu există quiz-uri disponibile momentan.
                </Text>
            </Box>
        ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {quizzes.map((quiz) => (
                    <Card.Root
                        key={quiz._id}
                        bg="white"
                        borderRadius="2xl"
                        boxShadow="md"
                        overflow="hidden"
                        transition="all 0.25s ease"
                        _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                    >
                        <Box h="5px" bg="linear-gradient(90deg, #6366F1, #8B5CF6, #EC4899)" />
                        <Card.Body p={7}>
                            <VStack align="stretch" spacing={5}>
                                <Heading size="md" color="gray.800" lineClamp={2} lineHeight="1.4">
                                    {quiz.title}
                                </Heading>
                                <Text color="gray.600" fontSize="md" lineClamp={3} lineHeight="1.6">
                                    {quiz.description || 'Fără descriere'}
                                </Text>
                                <HStack justify="space-between">
                                    <Badge colorPalette="purple" variant="subtle" px={3} py={1} borderRadius="full" fontSize="sm">
                                        {quiz.questions?.length || '?'} întrebări
                                    </Badge>
                                    <Text fontSize="sm" color="gray.500">
                                        {quiz.createdBy?.name || 'Necunoscut'}
                                    </Text>
                                </HStack>
                                <Button
                                    w="100%"
                                    size="lg"
                                    h="52px"
                                    bg="linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"
                                    color="white"
                                    fontSize="md"
                                    fontWeight="semibold"
                                    _hover={{ bg: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
                                    borderRadius="xl"
                                    onClick={() => onSelectQuiz(quiz._id)}
                                >
                                    Începe testul
                                </Button>
                            </VStack>
                        </Card.Body>
                    </Card.Root>
                ))}
            </SimpleGrid>
        )}
    </Container>
);

const QuizProgressBar = ({ current, total }) => {
    const progress = ((current + 1) / total) * 100;

    return (
        <Box w="100%" bg="white" px={{ base: 4, md: 8 }} py={4} borderBottom="1px solid" borderColor="gray.100">
            <Flex justify="space-between" mb={3}>
                <Text fontSize="sm" fontWeight="semibold" color="gray.600" letterSpacing="0.02em">
                    Întrebarea {current + 1} din {total}
                </Text>
                <Text fontSize="sm" fontWeight="bold" color="indigo.600">
                    {Math.round(progress)}%
                </Text>
            </Flex>
            <Progress.Root value={progress} size="md" colorPalette="purple" borderRadius="full">
                <Progress.Track bg="gray.100" borderRadius="full" h="12px">
                    <Progress.Range
                        borderRadius="full"
                        bg="linear-gradient(90deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)"
                        transition="width 0.4s ease"
                    />
                </Progress.Track>
            </Progress.Root>
        </Box>
    );
};

const AnswerOption = ({ option, index, isSelected, onSelect, disabled }) => {
    const style = OPTION_STYLES[index] || OPTION_STYLES[0];

    return (
        <Button
            w="100%"
            h="auto"
            minH={{ base: '80px', md: '96px' }}
            p={{ base: 5, md: 6 }}
            justifyContent="flex-start"
            bg={isSelected ? style.hover : style.bg}
            border="3px solid"
            borderColor={isSelected ? style.border : 'transparent'}
            borderRadius="2xl"
            _hover={{ bg: style.hover, borderColor: style.border, transform: 'scale(1.02)' }}
            _active={{ transform: 'scale(0.98)' }}
            onClick={() => !disabled && onSelect(index)}
            transition="all 0.2s ease"
            boxShadow={isSelected ? 'lg' : 'sm'}
            disabled={disabled}
            variant="ghost"
        >
            <HStack spacing={5} w="100%">
                <Circle
                    size={{ base: '48px', md: '56px' }}
                    bg={style.border}
                    color="white"
                    fontWeight="bold"
                    fontSize={{ base: 'xl', md: '2xl' }}
                    flexShrink={0}
                >
                    {style.label}
                </Circle>
                <Text
                    fontSize={{ base: 'lg', md: 'xl' }}
                    fontWeight={isSelected ? 'semibold' : 'medium'}
                    color="gray.800"
                    textAlign="left"
                    flex={1}
                    lineHeight="1.5"
                >
                    {option.text}
                </Text>
                {isSelected && <Icon as={FaCheckCircle} color={style.border} boxSize={6} />}
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
            <Flex justify="center" align="center" minH="70vh" pt={20}>
                <VStack spacing={5}>
                    <Box
                        w="56px"
                        h="56px"
                        border="4px solid"
                        borderColor="indigo.200"
                        borderTopColor="indigo.500"
                        borderRadius="full"
                        animation="spin 0.8s linear infinite"
                        css={{ '@keyframes spin': { to: { transform: 'rotate(360deg)' } } }}
                    />
                    <Text color="gray.600" fontSize="lg" fontWeight="medium">
                        Se calculează rezultatul...
                    </Text>
                </VStack>
            </Flex>
        );
    }

    return (
        <Box minH="100vh" pt="64px" display="flex" flexDirection="column">
            <QuizProgressBar current={currentQuestion} total={totalQuestions} />

            <Flex
                flex="1"
                direction="column"
                align="center"
                justify="center"
                px={{ base: 4, md: 8 }}
                py={{ base: 6, md: 10 }}
                maxW="900px"
                mx="auto"
                w="100%"
            >
                <HStack justify="space-between" w="100%" mb={6}>
                    <Button
                        variant="ghost"
                        size="md"
                        color="gray.600"
                        onClick={onCancel}
                        _hover={{ bg: 'gray.100' }}
                        borderRadius="xl"
                    >
                        <Icon as={FaArrowLeft} mr={2} />
                        Înapoi
                    </Button>
                    <HStack bg="white" px={5} py={2.5} borderRadius="full" boxShadow="md" spacing={2}>
                        <Icon as={FaClock} color={minutes < 5 ? 'red.500' : 'indigo.500'} boxSize={4} />
                        <Text
                            fontWeight="bold"
                            fontSize="xl"
                            color={minutes < 5 ? 'red.500' : 'gray.700'}
                            fontFamily="mono"
                        >
                            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </Text>
                    </HStack>
                </HStack>

                <Box
                    w="100%"
                    textAlign="center"
                    mb={{ base: 8, md: 10 }}
                    key={currentQuestion}
                    animation="fadeIn 0.35s ease-out"
                    css={{
                        '@keyframes fadeIn': {
                            '0%': { opacity: 0, transform: 'translateY(12px)' },
                            '100%': { opacity: 1, transform: 'translateY(0)' },
                        },
                    }}
                >
                    <Badge colorPalette="purple" variant="subtle" mb={4} px={3} py={1} borderRadius="full" fontSize="sm">
                        {quiz.title}
                    </Badge>
                    <Heading
                        fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                        fontWeight="bold"
                        color="gray.800"
                        lineHeight="1.35"
                        letterSpacing="-0.02em"
                        px={{ base: 2, md: 4 }}
                    >
                        {question.questionText}
                    </Heading>
                </Box>

                <SimpleGrid
                    columns={{ base: 1, md: 2 }}
                    spacing={{ base: 4, md: 5 }}
                    w="100%"
                    mb={8}
                    key={`options-${currentQuestion}`}
                >
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
                </SimpleGrid>

                <HStack justify="space-between" w="100%" maxW="900px">
                    <Button
                        variant="outline"
                        borderColor="gray.300"
                        color="gray.600"
                        size="lg"
                        h="52px"
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
                        h="52px"
                        px={10}
                        fontSize="md"
                        fontWeight="semibold"
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
            </Flex>
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
                <Text fontSize="sm" color="gray.500" mt={1}>
                    scor obținut
                </Text>
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
        <Container maxW="600px" px={4} pt={28} pb={16}>
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
                <Card.Body p={{ base: 8, md: 10 }}>
                    <VStack spacing={8}>
                        <VStack spacing={3} textAlign="center">
                            <Icon
                                as={score >= 75 ? FaTrophy : FaStar}
                                boxSize={10}
                                color={score >= 75 ? 'amber.400' : 'indigo.400'}
                            />
                            <Heading size="xl" color="gray.800" lineHeight="1.3">
                                {encouragement.title}
                            </Heading>
                            <Text color="gray.600" fontSize="md" lineHeight="1.6">
                                {encouragement.subtitle}
                            </Text>
                            <Badge colorPalette="purple" variant="subtle" mt={1} px={3} py={1} borderRadius="full">
                                {quizTitle}
                            </Badge>
                        </VStack>

                        <AnimatedScore score={score} />

                        <SimpleGrid columns={2} spacing={5} w="100%">
                            <Box bg="green.50" p={5} borderRadius="2xl" textAlign="center">
                                <Icon as={FaCheckCircle} color="green.500" boxSize={6} mb={2} />
                                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                                    {correctCount}/{total}
                                </Text>
                                <Text fontSize="sm" color="gray.600" mt={1}>
                                    răspunsuri corecte
                                </Text>
                            </Box>
                            <Box bg="indigo.50" p={5} borderRadius="2xl" textAlign="center">
                                <Icon as={FaClock} color="indigo.500" boxSize={6} mb={2} />
                                <Text fontSize="2xl" fontWeight="bold" color="indigo.600">
                                    {formatDuration(durationSeconds)}
                                </Text>
                                <Text fontSize="sm" color="gray.600" mt={1}>
                                    timp petrecut
                                </Text>
                            </Box>
                        </SimpleGrid>

                        <VStack spacing={3} w="100%">
                            <Button
                                w="100%"
                                size="lg"
                                h="52px"
                                bg="linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"
                                color="white"
                                fontWeight="semibold"
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
                                    h="48px"
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
                                    h="48px"
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
        </Container>
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
            <PageHeader user={user} onLogout={logoutHandler} />

            {message && (
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    bg={messageType === 'success' ? 'green.100' : 'red.100'}
                    color={messageType === 'success' ? 'green.800' : 'red.800'}
                    p={4}
                    mt={20}
                    borderRadius="xl"
                    maxW="600px"
                    mx="auto"
                    fontSize="md"
                >
                    {message}
                </Flex>
            )}

            {phase === 'list' && <QuizList quizzes={quizzes} onSelectQuiz={handleSelectQuiz} />}
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
