import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Badge,
  SimpleGrid,
  Card,
  Icon,
  Progress,
  Flex,
} from '@chakra-ui/react';
import { FaStar, FaBookOpen, FaMagic } from 'react-icons/fa';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Skeleton, SkeletonText } from '../ui/skeleton';
import { Alert } from '../ui/alert';

const POPULAR_FALLBACK = [
  { quizId: 'q_algebra_1', title: 'Ecuații simple', difficulty: 'ușor', score: 0.9 },
  { quizId: 'q_geom_1', title: 'Arii și perimetre', difficulty: 'ușor', score: 0.85 },
  { quizId: 'q_algebra_2', title: 'Sisteme de ecuații', difficulty: 'mediu', score: 0.8 },
];

const DIFFICULTY_STYLES = {
  ușor: { colorPalette: 'green', label: 'Ușor' },
  mediu: { colorPalette: 'orange', label: 'Mediu' },
  greu: { colorPalette: 'red', label: 'Greu' },
};

const getDifficultyStyle = (difficulty) => {
  const key = difficulty?.toLowerCase();
  return DIFFICULTY_STYLES[key] || { colorPalette: 'gray', label: difficulty || 'Nespecificat' };
};

const RecommendationSkeleton = () => (
  <Card.Root
    bg="rgba(255, 255, 255, 0.65)"
    backdropFilter="blur(16px)"
    borderRadius="2xl"
    border="1px solid rgba(255, 255, 255, 0.5)"
    boxShadow="0 8px 32px rgba(135, 206, 235, 0.15)"
    overflow="hidden"
  >
    <Card.Body p={6}>
      <VStack align="stretch" gap={4}>
        <Skeleton height="6" width="70%" borderRadius="lg" />
        <HStack gap={2}>
          <Skeleton height="5" width="60px" borderRadius="full" />
          <Skeleton height="5" width="80px" borderRadius="full" />
        </HStack>
        <Skeleton height="2" width="100%" borderRadius="full" />
        <SkeletonText noOfLines={1} gap={2} />
        <Skeleton height="10" width="100%" borderRadius="full" />
      </VStack>
    </Card.Body>
  </Card.Root>
);

const RecommendationCard = ({ recommendation, index, onSolve }) => {
  const { title, difficulty, score } = recommendation;
  const diffStyle = getDifficultyStyle(difficulty);
  const relevancePercent = Math.round((score ?? 0) * 100);

  return (
    <Card.Root
      bg="rgba(255, 255, 255, 0.7)"
      backdropFilter="blur(16px)"
      borderRadius="2xl"
      border="1px solid rgba(255, 255, 255, 0.6)"
      boxShadow="0 8px 32px rgba(255, 182, 193, 0.18)"
      overflow="hidden"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        transform: 'translateY(-6px)',
        boxShadow: '0 16px 48px rgba(135, 206, 235, 0.28)',
        borderColor: 'rgba(255, 182, 193, 0.5)',
      }}
      animation="slideUp 0.5s ease-out forwards"
      style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}
      sx={{
        '@keyframes slideUp': {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box
        h="4px"
        bgGradient="linear(to-r, #FFB6C1, #87CEEB, #98FB98)"
        bgSize="200% 100%"
        animation="shimmer 3s ease infinite"
        sx={{
          '@keyframes shimmer': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        }}
      />
      <Card.Body p={{ base: 5, md: 6 }}>
        <VStack align="stretch" gap={4}>
          <HStack justify="space-between" align="flex-start">
            <Heading
              size="md"
              fontFamily="work sans"
              color="gray.800"
              lineHeight="1.3"
              flex={1}
            >
              {title || 'Quiz recomandat'}
            </Heading>
            <Box
              bg="rgba(255, 182, 193, 0.2)"
              borderRadius="full"
              p={2}
              flexShrink={0}
            >
              <Icon as={FaBookOpen} color="pink.400" boxSize={4} />
            </Box>
          </HStack>

          <HStack gap={2} flexWrap="wrap">
            <Badge
              colorPalette={diffStyle.colorPalette}
              variant="subtle"
              borderRadius="full"
              px={3}
              py={1}
              fontSize="xs"
              fontWeight="semibold"
            >
              {diffStyle.label}
            </Badge>
            <Badge
              colorPalette="purple"
              variant="subtle"
              borderRadius="full"
              px={3}
              py={1}
              fontSize="xs"
              fontWeight="semibold"
            >
              <HStack gap={1}>
                <Icon as={FaStar} boxSize={2.5} />
                <Text>{relevancePercent}% relevanță</Text>
              </HStack>
            </Badge>
          </HStack>

          <Box>
            <Flex justify="space-between" mb={1}>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                Scor de relevanță
              </Text>
              <Text fontSize="xs" color="pink.500" fontWeight="bold">
                {relevancePercent}%
              </Text>
            </Flex>
            <Progress.Root
              value={relevancePercent}
              size="sm"
              colorPalette="pink"
              borderRadius="full"
            >
              <Progress.Track bg="rgba(255, 182, 193, 0.15)" borderRadius="full">
                <Progress.Range borderRadius="full" />
              </Progress.Track>
            </Progress.Root>
          </Box>

          <Button
            size="md"
            onClick={() => onSolve(recommendation.quizId)}
            bg="linear-gradient(135deg, rgba(255, 182, 193, 0.95) 0%, rgba(135, 206, 235, 0.95) 100%)"
            color="white"
            borderRadius="full"
            boxShadow="0 4px 16px rgba(255, 182, 193, 0.4)"
            _hover={{
              transform: 'scale(1.03)',
              boxShadow: '0 6px 24px rgba(135, 206, 235, 0.5)',
            }}
            _active={{ transform: 'scale(0.98)' }}
            transition="all 0.2s ease"
            fontWeight="bold"
            w="full"
          >
            Rezolvă
          </Button>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

const RecommendedForYou = ({ user }) => {
  const history = useHistory();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    if (!user?._id || !user?.token) return;

    const fetchRecommendations = async () => {
      setLoading(true);
      setIsFallback(false);
      setWarning(null);

      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      try {
        const { data } = await axios.get(`/api/recommendations/${user._id}`, config);
        const recs = data.recommendations ?? [];

        if (recs.length > 0) {
          setRecommendations(recs);
          if (data.source === 'fallback_popularity' || data.warning) {
            setIsFallback(true);
            setWarning(data.warning || 'Afișăm quiz-uri populare în lipsa serviciului de recomandări.');
          }
        } else {
          setRecommendations(POPULAR_FALLBACK);
          setIsFallback(true);
          setWarning('Nu am găsit recomandări personalizate. Îți arătăm quiz-uri populare.');
        }
      } catch (error) {
        console.error('Eroare la încărcarea recomandărilor:', error.response?.data || error.message);
        setRecommendations(POPULAR_FALLBACK);
        setIsFallback(true);
        setWarning('Nu am putut încărca recomandările. Îți arătăm quiz-uri populare.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user?._id, user?.token]);

  const handleSolve = (quizId) => {
    history.push({
      pathname: '/solve-quizzes',
      state: { quizId },
    });
  };

  if (!user || user.occupation !== 'student') return null;

  return (
    <Box
      w="100%"
      mt={8}
      mb={4}
      p={{ base: 5, md: 8 }}
      borderRadius="3xl"
      bg="rgba(255, 255, 255, 0.45)"
      backdropFilter="blur(20px)"
      border="1px solid rgba(255, 255, 255, 0.55)"
      boxShadow="0 12px 40px rgba(135, 206, 235, 0.12)"
    >
      <VStack align="stretch" gap={6}>
        <HStack gap={3} flexWrap="wrap">
          <Box
            bg="linear-gradient(135deg, rgba(255, 182, 193, 0.3), rgba(135, 206, 235, 0.3))"
            borderRadius="xl"
            p={3}
            boxShadow="0 4px 12px rgba(255, 182, 193, 0.2)"
          >
            <Icon as={FaMagic} color="pink.400" boxSize={6} />
          </Box>
          <VStack align="flex-start" gap={0} flex={1}>
            <Heading
              size="lg"
              fontFamily="work sans"
              bgGradient="linear(to-r, pink.400, blue.300)"
              bgClip="text"
            >
              Recomandat pentru tine
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Quiz-uri personalizate pe baza progresului tău
            </Text>
          </VStack>
        </HStack>

        {isFallback && warning && !loading && (
          <Alert
            status="warning"
            borderRadius="xl"
            bg="rgba(255, 237, 160, 0.5)"
            backdropFilter="blur(8px)"
            title={warning}
          />
        )}

        {loading ? (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={{ base: 4, md: 6 }}>
            {[1, 2, 3].map((i) => (
              <RecommendationSkeleton key={i} />
            ))}
          </SimpleGrid>
        ) : recommendations.length === 0 ? (
          <Box
            textAlign="center"
            py={10}
            px={6}
            borderRadius="2xl"
            bg="rgba(255, 255, 255, 0.5)"
          >
            <Text color="gray.600" fontSize="md">
              Nu există recomandări disponibile momentan. Explorează toate quiz-urile!
            </Text>
            <Button
              mt={4}
              colorPalette="pink"
              borderRadius="full"
              onClick={() => history.push('/solve-quizzes')}
            >
              Vezi toate quiz-urile
            </Button>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={{ base: 4, md: 6 }}>
            {recommendations.map((rec, index) => (
              <RecommendationCard
                key={rec.quizId || index}
                recommendation={rec}
                index={index}
                onSolve={handleSolve}
              />
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Box>
  );
};

export default RecommendedForYou;
