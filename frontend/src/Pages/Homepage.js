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
} from '@chakra-ui/react';
import { FaGraduationCap, FaComments, FaBookOpen, FaChalkboardTeacher } from 'react-icons/fa';
import Login from '../appComponents/Authentication/Login';
import SignUp from '../appComponents/Authentication/SignUp';
import { useHistory } from 'react-router-dom';
import GradientText from '../animations/gradientText';

const features = [
  { icon: FaBookOpen, text: 'Quiz-uri interactive create de profesori experimentați' },
  { icon: FaComments, text: 'Suport personalizat prin chat direct cu profesorii' },
  { icon: FaChalkboardTeacher, text: 'Pregătire structurată conform programei școlare' },
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
    <Flex minH="100vh" w="100%" direction={{ base: 'column', lg: 'row' }}>
      {/* Panou stânga — branding & gradient */}
      <Box
        flex={{ base: 'none', lg: '1' }}
        minH={{ base: '280px', lg: '100vh' }}
        position="relative"
        overflow="hidden"
        bgGradient="linear(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)"
        px={{ base: 8, lg: 12 }}
        py={{ base: 10, lg: 16 }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        {/* Decorative orbs */}
        <Box
          position="absolute"
          top="-80px"
          right="-80px"
          w="300px"
          h="300px"
          borderRadius="full"
          bg="whiteAlpha.200"
          filter="blur(60px)"
        />
        <Box
          position="absolute"
          bottom="-60px"
          left="-60px"
          w="250px"
          h="250px"
          borderRadius="full"
          bg="whiteAlpha.150"
          filter="blur(50px)"
        />

        <VStack align="flex-start" spacing={8} position="relative" zIndex={1} maxW="520px">
          <HStack spacing={3}>
            <Flex
              w="48px"
              h="48px"
              borderRadius="xl"
              bg="whiteAlpha.300"
              backdropFilter="blur(10px)"
              align="center"
              justify="center"
              border="1px solid"
              borderColor="whiteAlpha.400"
            >
              <Icon as={FaGraduationCap} boxSize={6} color="white" />
            </Flex>
            <GradientText
              colors={["#ffffff", "#e0e7ff", "#ffffff"]}
              animationSpeed={4}
              showBorder={false}
              fontSize="3xl"
              fontFamily="Work sans"
            >
              AskYourProf
            </GradientText>
          </HStack>

          <Heading
            fontSize={{ base: '2xl', lg: '3xl' }}
            fontWeight="bold"
            color="white"
            lineHeight="1.3"
            fontFamily="Work sans"
          >
            Platformă educațională pentru pregătirea Evaluării Naționale
          </Heading>

          <VStack align="flex-start" spacing={4} w="100%">
            {features.map(({ icon, text }) => (
              <HStack key={text} spacing={3} align="flex-start">
                <Flex
                  w="36px"
                  h="36px"
                  minW="36px"
                  borderRadius="lg"
                  bg="whiteAlpha.250"
                  align="center"
                  justify="center"
                  mt={0.5}
                >
                  <Icon as={icon} boxSize={4} color="white" />
                </Flex>
                <Text fontSize="md" color="whiteAlpha.900" lineHeight="1.7">
                  {text}
                </Text>
              </HStack>
            ))}
          </VStack>

          <Box
            mt={2}
            px={5}
            py={3}
            borderRadius="xl"
            bg="whiteAlpha.200"
            backdropFilter="blur(12px)"
            border="1px solid"
            borderColor="whiteAlpha.300"
          >
            <Text fontSize="sm" color="white" fontWeight="medium" fontStyle="italic">
              Creează-ți cont gratuit și începe pregătirea pentru succes!
            </Text>
          </Box>
        </VStack>
      </Box>

      {/* Panou dreapta — formular auth */}
      <Flex
        flex={{ base: '1', lg: '0 0 480px', xl: '0 0 540px' }}
        direction="column"
        align="center"
        justify="center"
        bg="white"
        px={{ base: 6, md: 10, lg: 12 }}
        py={{ base: 10, lg: 0 }}
        boxShadow={{ lg: '-8px 0 32px rgba(0,0,0,0.08)' }}
      >
        <Box w="100%" maxW="400px">
          <VStack spacing={2} mb={8} textAlign="center">
            <Heading
              fontSize="2xl"
              fontWeight="bold"
              color="gray.800"
              fontFamily="Work sans"
            >
              {selectedTab === 'login' ? 'Bine ai revenit!' : 'Creează-ți contul'}
            </Heading>
            <Text fontSize="sm" color="gray.500">
              {selectedTab === 'login'
                ? 'Autentifică-te pentru a continua pregătirea'
                : 'Alătură-te comunității AskYourProf'}
            </Text>
          </VStack>

          {/* Tab switcher */}
          <Flex
            bg="gray.100"
            borderRadius="xl"
            p={1}
            mb={8}
            position="relative"
          >
            <Box
              position="absolute"
              top="4px"
              left={selectedTab === 'login' ? '4px' : 'calc(50% + 2px)'}
              w="calc(50% - 6px)"
              h="calc(100% - 8px)"
              bg="white"
              borderRadius="lg"
              boxShadow="sm"
              transition="left 0.25s ease"
            />
            <Button
              flex={1}
              variant="ghost"
              size="sm"
              h="40px"
              zIndex={1}
              color={selectedTab === 'login' ? 'purple.600' : 'gray.500'}
              fontWeight={selectedTab === 'login' ? 'semibold' : 'medium'}
              _hover={{ bg: 'transparent' }}
              onClick={() => setSelectedTab('login')}
            >
              Autentificare
            </Button>
            <Button
              flex={1}
              variant="ghost"
              size="sm"
              h="40px"
              zIndex={1}
              color={selectedTab === 'signup' ? 'purple.600' : 'gray.500'}
              fontWeight={selectedTab === 'signup' ? 'semibold' : 'medium'}
              _hover={{ bg: 'transparent' }}
              onClick={() => setSelectedTab('signup')}
            >
              Înregistrare
            </Button>
          </Flex>

          <Box
            key={selectedTab}
            animation="fadeSlideIn 0.35s ease"
            sx={{
              '@keyframes fadeSlideIn': {
                '0%': { opacity: 0, transform: 'translateY(12px)' },
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
