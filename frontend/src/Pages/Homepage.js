import React, { useState, useEffect } from 'react';
import { Box, Container, Text, Flex, Button, VStack } from '@chakra-ui/react';
import Login from '../appComponents/Authentication/Login';
import SignUp from '../appComponents/Authentication/SignUp';
import { useHistory } from 'react-router-dom';
import GradientText from '../animations/gradientText';

const Homepage = () => {
  const [selectedTab, setSelectedTab] = useState(null); // 'login' | 'signup' | null
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if(user) {
        history.push('/home');
    }
  }, [history]);

  return (
    <Container maxW="8xl" centerContent>
      <Flex
        direction={{ base: 'column', xl: 'row' }}
        w="100%"
        justify="center"
        align="flex-start"
        gap={6}
        mt={10}
      >
        {/* Stânga: Titlu + Descriere */}
        <VStack spacing={6} align="flex-start" minW={{ base: '100%', xl: '340px' }} maxW={{ base: '100%', xl: '340px' }} mb={{ base: 6, xl: 0 }}>
          {/* Box 1: Titlu */}
          <Box
            bg="white"
            borderRadius="lg"
            borderWidth="0px"
            boxShadow="sm"
            p={6}
            width="500px"
            textAlign="center"
          >
            <GradientText
              colors={["#FFB6C1", "#87CEEB", "#98FB98"]}
              animationSpeed={3}
              showBorder={false}
              className="custom-class"
              fontSize="4xl"
              fontFamily="Work sans"
            >
              AskYourProf
            </GradientText>
          </Box>
          {/* Box 2: Descriere */}
          <Box
            bg="white"
            borderRadius="lg"
            borderWidth="0px"
            boxShadow="sm"
            p={6}
            width="500px"
          >
            <VStack spacing={6} align="flex-start">
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="gray.700"
                lineHeight="1.8"
              >
                Platformă educațională pentru pregătirea Evaluării Naționale
              </Text>
              <VStack align="flex-start" spacing={4}>
                <Text fontSize="md" color="gray.600" lineHeight="1.8">🔹 Quiz-uri interactive create de profesori experimentați</Text>
                <Text fontSize="md" color="gray.600" lineHeight="1.8">🔹 Suport personalizat prin chat direct cu profesorii</Text>
                <Text fontSize="md" color="gray.600" lineHeight="1.8">🔹 Pregătire structurată conform programei școlare</Text>
              </VStack>
              <Text
                fontSize="md"
                color="pink.400"
                fontWeight="bold"
                fontStyle="italic"
                borderTop="1px solid"
                borderBottom="1px solid"
                borderColor="pink.100"
                py={3}
                w="100%"
              >
                Creează-ți cont gratuit și începe pregătirea pentru succes!
              </Text>
            </VStack>
          </Box>
          {/* Box 3: Butoane Login/Signup */}
          <Box
            bg="white"
            borderRadius="lg"
            borderWidth="0px"
            boxShadow="sm"
            p={6}
            width="500px"
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap={4}
          >
            <Button
              bg="lightblue"
              color="white"
              _hover={{ bg: "lightblue.100" }}
              _active={{ bg: "white", color: "lightblue", border: "2px solid lightblue" }}
              _focus={{ boxShadow: "none" }}
              variant={selectedTab === 'login' ? 'solid' : 'outline'}
              w="50%"
              onClick={() => setSelectedTab('login')}
            >
              Login
            </Button>
            <Button
              bg="lightblue"
              color="white"
              _hover={{ bg: "lightblue.100" }}
              _active={{ bg: "white", color: "lightblue", border: "2px solid lightblue" }}
              _focus={{ boxShadow: "none" }}
              variant={selectedTab === 'signup' ? 'solid' : 'outline'}
              w="50%"
              onClick={() => setSelectedTab('signup')}
            >
              Sign Up
            </Button>
          </Box>
        </VStack>

        {/* Dreapta: Formular */}
        <VStack spacing={6} align="flex-start" minW={{ base: '100%', xl: '180px' }} maxW={{ base: '100%', xl: selectedTab ? '540px' : '180px' }} w="100%">
          {/* Box 4: Formularul (doar dacă e selectat) */}
          {selectedTab && (
            <Box
              bg="white"
              borderRadius="lg"
              borderWidth="0px"
              boxShadow="sm"
              p={6}
              width="500px"
              //w={{ base: '100%', xl: '340px' }}
              transition="all 0.3s"
              ml={{ base: 0, xl: '200px' }}
            >
              <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb={4} textAlign="center">
                {selectedTab === 'login' ? 'Login' : 'Sign Up'}
              </Text>
              <Box maxH="500px" overflowY="auto" pr={2}
                sx={{
                  '&::-webkit-scrollbar': {
                    width: '6px',
                    backgroundColor: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderRadius: '3px',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    },
                  },
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(0, 0, 0, 0.1) transparent'
                }}
              >
                {selectedTab === 'login' ? <Login /> : <SignUp />}
              </Box>
            </Box>
          )}
        </VStack>
      </Flex>
    </Container>
  );
};

export default Homepage;
