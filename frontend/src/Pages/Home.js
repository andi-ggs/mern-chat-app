import React from 'react';
import RecommendedForYou from '../components/recommendations/RecommendedForYou';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  Badge,
  Container,
  Flex,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  FaComments,
  FaBookReader,
  FaPencilAlt,
  FaFileUpload,
  FaFilePdf,
  FaRocket,
} from 'react-icons/fa';
import { useHistory } from 'react-router-dom';

const QUICK_ACTIONS = {
  student: [
    {
      id: 'chats',
      label: 'Către Chat',
      description: 'Discută cu profesorii tăi',
      icon: FaComments,
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.08)',
      route: '/chats',
    },
    {
      id: 'quizzes',
      label: 'Către Quiz-uri',
      description: 'Rezolvă teste interactive',
      icon: FaBookReader,
      color: '#4F46E5',
      bg: 'rgba(79, 70, 229, 0.08)',
      route: '/solve-quizzes',
    },
    {
      id: 'exams',
      label: 'Vezi Examene',
      description: 'Accesează subiecte PDF',
      icon: FaFilePdf,
      color: '#6366F1',
      bg: 'rgba(99, 102, 241, 0.08)',
      route: '/view-exams',
    },
  ],
  teacher: [
    {
      id: 'chats',
      label: 'Către Chat',
      description: 'Comunică cu elevii tăi',
      icon: FaComments,
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.08)',
      route: '/chats',
    },
    {
      id: 'create-quiz',
      label: 'Creează Quiz',
      description: 'Adaugă teste noi',
      icon: FaPencilAlt,
      color: '#4F46E5',
      bg: 'rgba(79, 70, 229, 0.08)',
      route: '/quiz',
    },
    {
      id: 'upload-exam',
      label: 'Încarcă Examene',
      description: 'Publică subiecte PDF',
      icon: FaFileUpload,
      color: '#6366F1',
      bg: 'rgba(99, 102, 241, 0.08)',
      route: '/upload-exam',
    },
    {
      id: 'view-exams',
      label: 'Vezi Examene',
      description: 'Gestionează materialele',
      icon: FaFilePdf,
      color: '#818CF8',
      bg: 'rgba(129, 140, 248, 0.08)',
      route: '/view-exams',
    },
  ],
};

const STAT_CARDS = {
  student: [
    { label: 'Quiz-uri disponibile', value: '∞', hint: 'Explorează și exersează' },
    { label: 'Pregătire EN', value: '100%', hint: 'Aliniat cu programa' },
    { label: 'Suport live', value: '24/7', hint: 'Chat cu profesori' },
  ],
  teacher: [
    { label: 'Elevi conectați', value: '∞', hint: 'Comunitate activă' },
    { label: 'Quiz-uri create', value: '—', hint: 'Teste interactive' },
    { label: 'Feedback instant', value: '✓', hint: 'Răspunsuri rapide' },
  ],
};

const Home = () => {
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem('userInfo') || 'null');

  const isStudent = user?.occupation === 'student';
  const isTeacher = user?.occupation === 'teacher';
  const role = isStudent ? 'student' : 'teacher';

  const navigateTo = (route) => {
    history.push(route);
  };

  if (!user) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Text color="gray.600">Sesiunea a expirat. Te rugăm să te autentifici din nou.</Text>
          <Button colorPalette="blue" onClick={() => history.push('/')}>
            Mergi la autentificare
          </Button>
        </VStack>
      </Box>
    );
  }

  const quickActions = QUICK_ACTIONS[role] || QUICK_ACTIONS.student;
  const statCards = STAT_CARDS[role] || STAT_CARDS.student;

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="6xl" pt={6} pb={12} px={{ base: 4, md: 8 }}>
        <VStack align="stretch" gap={8}>
          {/* Welcome hero */}
          <Card.Root
            bg="white"
            borderRadius="2xl"
            border="1px solid"
            borderColor="gray.200"
            boxShadow="md"
            overflow="hidden"
          >
            <Box
              h="4px"
              bgGradient="linear(to-r, indigo.500, blue.500, indigo.400)"
            />
            <Card.Body p={{ base: 6, md: 8 }}>
              <Flex
                direction={{ base: 'column', md: 'row' }}
                justify="space-between"
                align={{ base: 'flex-start', md: 'center' }}
                gap={4}
              >
                <VStack align="flex-start" gap={2}>
                  <HStack gap={3} flexWrap="wrap">
                    <Heading
                      size={{ base: 'xl', md: '2xl' }}
                      fontFamily="work sans"
                      color="gray.800"
                    >
                      Salut, {user.name}!
                    </Heading>
                    <Badge
                      colorPalette={isStudent ? 'blue' : 'indigo'}
                      variant="subtle"
                      borderRadius="full"
                      px={3}
                      py={1}
                      fontSize="sm"
                    >
                      {isStudent ? 'Elev' : 'Profesor'}
                    </Badge>
                  </HStack>
                  <Text fontSize="md" color="gray.600" maxW="lg">
                    {isStudent
                      ? 'Bine ai venit în centrul tău de pregătire pentru Evaluarea Națională. Alege o acțiune rapidă sau explorează recomandările personalizate.'
                      : 'Gestionează quiz-urile, examenele și comunicarea cu elevii — totul dintr-un singur loc.'}
                  </Text>
                </VStack>
                <Box
                  bg="indigo.50"
                  borderRadius="xl"
                  p={4}
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FaRocket} color="indigo.500" boxSize={10} />
                </Box>
              </Flex>
            </Card.Body>
          </Card.Root>

          {/* Quick stats */}
          <SimpleGrid columns={{ base: 1, sm: 3 }} gap={4}>
            {statCards.map((stat) => (
              <Card.Root
                key={stat.label}
                bg="white"
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.200"
                boxShadow="sm"
                transition="all 0.2s"
                _hover={{ boxShadow: 'md', borderColor: 'indigo.200' }}
              >
                <Card.Body p={5}>
                  <VStack align="flex-start" gap={1}>
                    <Text fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase" letterSpacing="wider">
                      {stat.label}
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color="indigo.600">
                      {stat.value}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {stat.hint}
                    </Text>
                  </VStack>
                </Card.Body>
              </Card.Root>
            ))}
          </SimpleGrid>

          {/* Quick access */}
          <Box>
            <Heading size="md" color="gray.700" mb={4} fontFamily="work sans">
              Acces rapid
            </Heading>
            <SimpleGrid columns={{ base: 1, sm: 2, lg: isTeacher ? 4 : 3 }} gap={4}>
              {quickActions.map((action) => (
                <Card.Root
                  key={action.id}
                  bg="white"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.200"
                  boxShadow="sm"
                  cursor="pointer"
                  transition="all 0.25s ease"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'lg',
                    borderColor: action.color,
                  }}
                  onClick={() => navigateTo(action.route)}
                >
                  <Card.Body p={5}>
                    <HStack gap={4} align="flex-start">
                      <Flex
                        align="center"
                        justify="center"
                        w="48px"
                        h="48px"
                        borderRadius="xl"
                        bg={action.bg}
                        flexShrink={0}
                      >
                        <Icon as={action.icon} color={action.color} boxSize={5} />
                      </Flex>
                      <VStack align="flex-start" gap={1} flex={1}>
                        <Text fontWeight="bold" color="gray.800" fontSize="md">
                          {action.label}
                        </Text>
                        <Text fontSize="sm" color="gray.500" lineHeight="1.4">
                          {action.description}
                        </Text>
                      </VStack>
                    </HStack>
                  </Card.Body>
                </Card.Root>
              ))}
            </SimpleGrid>
          </Box>

          {/* Action buttons row */}
          <Flex gap={3} flexWrap="wrap">
            <Button
              colorPalette="blue"
              size="lg"
              borderRadius="full"
              leftIcon={<Icon as={FaComments} />}
              onClick={() => navigateTo('/chats')}
              boxShadow="md"
              _hover={{ transform: 'scale(1.03)' }}
              transition="all 0.2s"
            >
              Către Chat
            </Button>
            <Button
              colorPalette="indigo"
              size="lg"
              borderRadius="full"
              leftIcon={<Icon as={isStudent ? FaBookReader : FaPencilAlt} />}
              onClick={() =>
                navigateTo(isStudent ? '/solve-quizzes' : '/quiz')
              }
              boxShadow="md"
              _hover={{ transform: 'scale(1.03)' }}
              transition="all 0.2s"
            >
              {isStudent ? 'Către Quiz-uri' : 'Creează Quiz'}
            </Button>
          </Flex>

          {/* Recommendations — students only */}
          {isStudent && <RecommendedForYou user={user} />}
        </VStack>
      </Container>
    </Box>
  );
};

export default Home;
