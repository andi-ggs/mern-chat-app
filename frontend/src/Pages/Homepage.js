import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Flex,
  Button,
  VStack,
  HStack,
  Icon,
  Heading,
  Badge,
} from '@chakra-ui/react';
import {
  FaGraduationCap,
  FaComments,
  FaBookOpen,
  FaChalkboardTeacher,
  FaStar,
} from 'react-icons/fa';
import Login from '../appComponents/Authentication/Login';
import SignUp from '../appComponents/Authentication/SignUp';
import { useHistory } from 'react-router-dom';
import GradientText from '../animations/gradientText';

const features = [
  { icon: FaBookOpen, text: 'Quiz-uri interactive create de profesori experimentați' },
  { icon: FaComments, text: 'Suport personalizat prin chat direct cu profesorii' },
  { icon: FaChalkboardTeacher, text: 'Pregătire structurată conform programei școlare' },
];

const stats = [
  { value: '500+', label: 'Quiz-uri disponibile' },
  { value: '50+', label: 'Profesori verificați' },
  { value: '24/7', label: 'Acces la platformă' },
];

const Homepage = () => {
  const [selectedTab, setSelectedTab] = useState('login');
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      history.push('/home');
    }
  }, [history]);

  return (
    <Flex minH="100vh" w="100%" direction={{ base: 'column', lg: 'row' }} bg="gray.50">
      {/* Panou stânga — branding educațional */}
      <Box
        flex={{ base: 'none', lg: '1' }}
        minH={{ base: '320px', lg: '100vh' }}
        position="relative"
        overflow="hidden"
        bgGradient="linear(145deg, #1e3a5f 0%, #2563eb 35%, #0d9488 70%, #14b8a6 100%)"
        px={{ base: 8, lg: 14, xl: 16 }}
        py={{ base: 12, lg: 16 }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        {/* Pattern decorativ */}
        <Box
          position="absolute"
          inset={0}
          opacity={0.06}
          bgImage="radial-gradient(circle at 2px 2px, white 1px, transparent 0)"
          bgSize="32px 32px"
        />

        {/* Orbs luminoase */}
        <Box
          position="absolute"
          top="-100px"
          right="-60px"
          w="380px"
          h="380px"
          borderRadius="full"
          bg="cyan.300"
          opacity={0.2}
          filter="blur(80px)"
        />
        <Box
          position="absolute"
          bottom="-80px"
          left="-40px"
          w="320px"
          h="320px"
          borderRadius="full"
          bg="blue.400"
          opacity={0.25}
          filter="blur(70px)"
        />
        <Box
          position="absolute"
          top="40%"
          right="15%"
          w="180px"
          h="180px"
          borderRadius="full"
          bg="teal.200"
          opacity={0.15}
          filter="blur(50px)"
        />

        <VStack align="flex-start" spacing={10} position="relative" zIndex={1} maxW="560px">
          {/* Logo & brand */}
          <HStack spacing={4}>
            <Flex
              w="52px"
              h="52px"
              borderRadius="2xl"
              bg="whiteAlpha.250"
              backdropFilter="blur(16px)"
              align="center"
              justify="center"
              border="1px solid"
              borderColor="whiteAlpha.400"
              boxShadow="lg"
            >
              <Icon as={FaGraduationCap} boxSize={6} color="white" />
            </Flex>
            <Box>
              <GradientText
                colors={["#ffffff", "#a5f3fc", "#ffffff"]}
                animationSpeed={5}
                showBorder={false}
                fontSize="3xl"
                fontFamily="Nunito, sans-serif"
              >
                AskYourProf
              </GradientText>
              <Badge
                mt={1}
                px={3}
                py={0.5}
                borderRadius="full"
                bg="whiteAlpha.200"
                color="white"
                fontSize="xs"
                fontWeight="semibold"
                letterSpacing="wider"
                textTransform="uppercase"
                fontFamily="Inter, sans-serif"
              >
                EdTech Platform
              </Badge>
            </Box>
          </HStack>

          {/* Mesaj inspirațional */}
          <Box>
            <Heading
              fontSize={{ base: '2xl', lg: '4xl', xl: '4.5xl' }}
              fontWeight="800"
              color="white"
              lineHeight="1.2"
              fontFamily="Nunito, sans-serif"
              letterSpacing="-0.02em"
            >
              Pregătește-te pentru succes la Evaluarea Națională
            </Heading>
            <Text
              mt={4}
              fontSize={{ base: 'md', lg: 'lg' }}
              color="whiteAlpha.850"
              lineHeight="1.8"
              fontFamily="Inter, sans-serif"
              fontWeight="medium"
            >
              Fiecare lecție te aduce mai aproape de obiectiv. Învață alături de profesori
              dedicați, exersează cu quiz-uri interactive și primește ajutor când ai nevoie.
            </Text>
          </Box>

          {/* Features */}
          <VStack align="flex-start" spacing={4} w="100%">
            {features.map(({ icon, text }) => (
              <HStack
                key={text}
                spacing={4}
                align="flex-start"
                w="100%"
                px={4}
                py={3}
                borderRadius="xl"
                bg="whiteAlpha.100"
                backdropFilter="blur(8px)"
                border="1px solid"
                borderColor="whiteAlpha.200"
                transition="all 0.2s"
                _hover={{ bg: 'whiteAlpha.200', transform: 'translateX(4px)' }}
              >
                <Flex
                  w="40px"
                  h="40px"
                  minW="40px"
                  borderRadius="xl"
                  bg="whiteAlpha.300"
                  align="center"
                  justify="center"
                  mt={0.5}
                  boxShadow="sm"
                >
                  <Icon as={icon} boxSize={4} color="white" />
                </Flex>
                <Text
                  fontSize="md"
                  color="whiteAlpha.900"
                  lineHeight="1.6"
                  fontFamily="Inter, sans-serif"
                  fontWeight="medium"
                >
                  {text}
                </Text>
              </HStack>
            ))}
          </VStack>

          {/* Statistici */}
          <HStack spacing={6} w="100%" flexWrap="wrap">
            {stats.map(({ value, label }) => (
              <VStack key={label} align="flex-start" spacing={0}>
                <Text
                  fontSize="2xl"
                  fontWeight="800"
                  color="white"
                  fontFamily="Nunito, sans-serif"
                >
                  {value}
                </Text>
                <Text fontSize="xs" color="whiteAlpha.700" fontFamily="Inter, sans-serif">
                  {label}
                </Text>
              </VStack>
            ))}
          </HStack>

          {/* Citație inspirațională */}
          <Flex
            align="flex-start"
            gap={3}
            px={5}
            py={4}
            borderRadius="2xl"
            bg="whiteAlpha.150"
            backdropFilter="blur(16px)"
            border="1px solid"
            borderColor="whiteAlpha.250"
            boxShadow="md"
          >
            <Icon as={FaStar} color="yellow.300" boxSize={4} mt={1} flexShrink={0} />
            <Text
              fontSize="sm"
              color="white"
              fontWeight="medium"
              fontStyle="italic"
              lineHeight="1.7"
              fontFamily="Inter, sans-serif"
            >
              „Educația este cea mai puternică armă pe care o poți folosi pentru a schimba lumea."
              — Creează-ți cont gratuit și începe pregătirea astăzi!
            </Text>
          </Flex>
        </VStack>
      </Box>

      {/* Panou dreapta — formular auth */}
      <Flex
        flex={{ base: '1', lg: '0 0 500px', xl: '0 0 560px' }}
        direction="column"
        align="center"
        justify="center"
        bg="white"
        px={{ base: 6, md: 10, lg: 12, xl: 14 }}
        py={{ base: 10, lg: 12 }}
        position="relative"
        boxShadow={{ lg: '-12px 0 40px rgba(15, 23, 42, 0.08)' }}
      >
        {/* Accent decorativ */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="4px"
          bgGradient="linear(to-r, #2563eb, #0d9488, #14b8a6)"
        />

        <Box w="100%" maxW="420px">
          <VStack spacing={3} mb={8} textAlign="center">
            <Heading
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="800"
              color="gray.800"
              fontFamily="Nunito, sans-serif"
              letterSpacing="-0.02em"
            >
              {selectedTab === 'login' ? 'Bine ai revenit!' : 'Creează-ți contul'}
            </Heading>
            <Text fontSize="md" color="gray.500" fontFamily="Inter, sans-serif">
              {selectedTab === 'login'
                ? 'Autentifică-te pentru a continua pregătirea'
                : 'Alătură-te comunității AskYourProf'}
            </Text>
          </VStack>

          {/* Tab switcher */}
          <Flex
            bg="gray.100"
            borderRadius="2xl"
            p={1.5}
            mb={8}
            position="relative"
            boxShadow="inner"
          >
            <Box
              position="absolute"
              top="6px"
              left={selectedTab === 'login' ? '6px' : 'calc(50% + 3px)'}
              w="calc(50% - 9px)"
              h="calc(100% - 12px)"
              bg="white"
              borderRadius="xl"
              boxShadow="md"
              transition="left 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            />
            <Button
              flex={1}
              variant="ghost"
              size="md"
              h="44px"
              zIndex={1}
              borderRadius="xl"
              color={selectedTab === 'login' ? 'blue.600' : 'gray.500'}
              fontWeight={selectedTab === 'login' ? 'bold' : 'medium'}
              fontFamily="Inter, sans-serif"
              _hover={{ bg: 'transparent' }}
              onClick={() => setSelectedTab('login')}
            >
              Autentificare
            </Button>
            <Button
              flex={1}
              variant="ghost"
              size="md"
              h="44px"
              zIndex={1}
              borderRadius="xl"
              color={selectedTab === 'signup' ? 'blue.600' : 'gray.500'}
              fontWeight={selectedTab === 'signup' ? 'bold' : 'medium'}
              fontFamily="Inter, sans-serif"
              _hover={{ bg: 'transparent' }}
              onClick={() => setSelectedTab('signup')}
            >
              Înregistrare
            </Button>
          </Flex>

          <Box
            key={selectedTab}
            animation="fadeSlideIn 0.4s ease"
            sx={{
              '@keyframes fadeSlideIn': {
                '0%': { opacity: 0, transform: 'translateY(16px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            {selectedTab === 'login' ? (
              <Login onSwitchToSignUp={() => setSelectedTab('signup')} />
            ) : (
              <SignUp onSwitchToLogin={() => setSelectedTab('login')} />
            )}
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Homepage;
