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
import { FaStar, FaBookOpen, FaLightbulb } from 'react-icons/fa';
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
    bg="white"
    borderRadius="xl"
    border="1px solid"
    borderColor="gray.200"
    boxShadow="sm"
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
      bg="white"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
      overflow="hidden"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'lg',
        borderColor: 'indigo.300',
      }}
      animation="slideUp 0.5s ease-out forwards"
      style={{ animationDelay: `${index * 0.08}s`, opacity: 0 }}
      sx={{
        '@keyframes slideUp': {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box h="3px" bgGradient="linear(to-r, indigo.500, blue.500)" />
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
            <Flex
              align="center"
              justify="center"
              bg="indigo.50"
              borderRadius="lg"
              p={2}
              flexShrink={0}
            >
              <Icon as={FaBookOpen} color="indigo.500" boxSize={4} />
            </Flex>
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
              colorPalette="indigo"
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
              <Text fontSize="xs" color="indigo.600" fontWeight="bold">
                {relevancePercent}%
              </Text>
            </Flex>
            <Progress.Root
              value={relevancePercent}
              size="sm"
              colorPalette="blue"
              borderRadius="full"
            >
              <Progress.Track bg="blue.50" borderRadius="full">
                <Progress.Range borderRadius="full" />
              </Progress.Track>
            </Progress.Root>
          </Box>

          <Button
            size="md"
            colorPalette="indigo"
            onClick={() => onSolve(recommendation.quizId)}
            borderRadius="full"
            fontWeight="bold"
            w="full"
            _hover={{ transform: 'scale(1.02)' }}
            transition="all 0.2s ease"
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
    <Box w="100%">
      <VStack align="stretch" gap={6}>
        <HStack gap={3} flexWrap="wrap">
          <Flex
            align="center"
            justify="center"
            bg="indigo.50"
            borderRadius="xl"
            p={3}
          >
            <Icon as={FaLightbulb} color="indigo.500" boxSize={6} />
          </Flex>
          <VStack align="flex-start" gap={0} flex={1}>
            <Heading
              size="lg"
              fontFamily="work sans"
              color="gray.800"
            >
              Recomandat pentru tine
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Quiz-uri personalizate pe baza progresului tău
            </Text>
          </VStack>
        </HStack>

        {isFallback && warning && !loading && (
          <Alert
            status="warning"
            borderRadius="xl"
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
            borderRadius="xl"
            bg="white"
            border="1px solid"
            borderColor="gray.200"
          >
            <Text color="gray.600" fontSize="md">
              Nu există recomandări disponibile momentan. Explorează toate quiz-urile!
            </Text>
            <Button
              mt={4}
              colorPalette="indigo"
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
