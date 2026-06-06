import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Card,
  HStack,
  Badge,
  Container,
  Flex,
  Icon
} from '@chakra-ui/react';
import { FaComments, FaBookReader, FaPencilAlt, FaFileUpload, FaFilePdf } from 'react-icons/fa';
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

const Home = () => {
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem("userInfo"));

    const submitHandlerQuizPage = () => {
      if (user && user.occupation === 'teacher') {
          history.push("/quiz");
      } else if (user && user.occupation === 'student') {
          history.push("/solve-quizzes");
      }
    };

    const submitHandlerChats = () => {
        history.push("/chats")
    }

    const submitHandlerUploadExam = () => {
        history.push("/upload-exam")
    }

    const submitHandlerViewExams = () => {
        history.push("/view-exams")
    }

    const logoutHandler = () => {
      localStorage.removeItem("userInfo");
      history.push("/");
  };

    return (
      <Container maxW="xl" centerContent>
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
                <Box flex="0" d="flex" justifyContent="left">
                  <Text 
                  fontSize="md" 
                  fontWeight="bold" 
                  fontFamily="work sans"
                  color="rgba(255, 182, 193, 0.9)"
                   _hover={{ 
                        bg: "rgba(255, 182, 193, 1)",
                        transform: 'scale(1.05)',
                    }}>
                    Since 2025
                  </Text>
                </Box>
                <Box flex="0" d="flex" justifyContent="center">
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
                            My Profile
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
        <Box
          d="flex"
          justifyContent="center"
          alignItems="center"
          p={8}
          bgGradient="linear(to-r, #FFB6C1, #87CEEB)"
          w="100%"
          maxW="600px"
          m="40px 0"
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
              AskYouProf – Pregătirea Inteligentă pentru Evaluarea Națională
            </Heading>
          </VStack>
        </Box>
        <Box 
          d="flex" 
          justifyContent="flex-start" 
          alignItems="flex-start" 
          w="90vw"
          position="relative"
          left="50%"
          right="50%"
          marginLeft="-30vw"
          bg="white"
          py={10}
          px={8}
          boxShadow="md"
        >
          <Box w="100%">
            <Text 
              fontSize="xl" 
              fontWeight="bold" 
              color="gray.700"
              mb={6}
              lineHeight="1.8"
            >
              AskYouProf este platforma care îi aduce pe elevi și profesori mai aproape ca niciodată pentru o pregătire eficientă, organizată și personalizată pentru Evaluarea Națională.
            </Text>
            
            <VStack align="flex-start" spacing={4} mb={8}>
              <Text 
                fontSize="lg" 
                color="gray.600"
                lineHeight="1.8"
              >
                🔹 Elevii pot accesa rapid quiz-uri create de profesori experimentați, perfect aliniate cu programa școlară și structurate exact ca subiectele de examen.
              </Text>
              <Text 
                fontSize="lg" 
                color="gray.600"
                lineHeight="1.8"
              >
                🔹 Profesorii creează și actualizează constant teste interactive, menite să stimuleze gândirea și să ofere o pregătire reală și relevantă.
              </Text>
            </VStack>

            <Text 
              fontSize="lg" 
              color="gray.600"
              mb={8}
              lineHeight="1.8"
              fontStyle="italic"
            >
              Ai nelămuriri? Cu un singur click intri în chat direct cu profesorul autor al quiz-ului și primești explicații clare, personalizate pe întrebările tale.
            </Text>

            <Box mb={8}>
              <Text 
                fontSize="xl"
                fontWeight="bold"
                color="pink.400"
                mb={4}
              >
                AskYouProf înseamnă:
              </Text>
              <VStack align="flex-start" spacing={3}>
                <Text 
                  fontSize="lg" 
                  color="gray.600"
                  lineHeight="1.8"
                >
                  ✔️ Acces la teste de calitate, actualizate permanent
                </Text>
                <Text 
                  fontSize="lg" 
                  color="gray.600"
                  lineHeight="1.8"
                >
                  ✔️ Suport individualizat de la profesori dedicați
                </Text>
                <Text 
                  fontSize="lg" 
                  color="gray.600"
                  lineHeight="1.8"
                >
                  ✔️ Pregătire organizată, exact ca la examen
                </Text>
              </VStack>
            </Box>

            <Text 
              fontSize="xl"
              fontWeight="bold"
              color="pink.400"
              fontStyle="italic"
              mb={8}
              borderTop="1px solid"
              borderBottom="1px solid"
              borderColor="pink.100"
              py={4}
            >
              Transformăm învățarea într-un proces clar, motivant și accesibil! Intră în AskYouProf și pregătește-te să reușești!
            </Text>

            <Flex 
              direction={{ base: "column", md: "row" }} 
              gap={6} 
              justify="flex-start"
              align="flex-start"
              mt={4}
            >
              <Button
                colorScheme="pink"
                size="lg"
                onClick={submitHandlerChats}
                bg="rgba(255, 182, 193, 0.9)"
                _hover={{ 
                  bg: "rgba(255, 182, 193, 1)",
                  transform: 'scale(1.05)',
                }}
                boxShadow="lg"
                borderRadius="full"
                leftIcon={<Icon as={FaComments} boxSize={5} />}
                px={8}
                transition="all 0.2s ease-in-out"
                flex={{ base: "1", md: "0 1 auto" }}
                minW={{ base: "full", md: "200px" }}
              >
                Vezi Chat-uri
              </Button>

              <Button
                colorScheme="pink"
                size="lg"
                onClick={submitHandlerViewExams}
                bg="rgba(255, 182, 193, 0.9)"
                _hover={{ 
                  bg: "rgba(255, 182, 193, 1)",
                  transform: 'scale(1.05)',
                }}
                boxShadow="lg"
                borderRadius="full"
                leftIcon={<Icon as={FaFilePdf} boxSize={5} />}
                px={8}
                transition="all 0.2s ease-in-out"
                flex={{ base: "1", md: "0 1 auto" }}
                minW={{ base: "full", md: "200px" }}
              >
                Vezi Examene
              </Button>

              {user && user.occupation === 'teacher' && (
                <>
                  <Button
                    colorScheme="pink"
                    size="lg"
                    onClick={submitHandlerQuizPage}
                    bg="rgba(255, 182, 193, 0.9)"
                    _hover={{ 
                      bg: "rgba(255, 182, 193, 1)",
                      transform: 'scale(1.05)',
                    }}
                    boxShadow="lg"
                    borderRadius="full"
                    leftIcon={<Icon as={FaPencilAlt} boxSize={5} />}
                    px={8}
                    transition="all 0.2s ease-in-out"
                    flex={{ base: "1", md: "0 1 auto" }}
                    minW={{ base: "full", md: "200px" }}
                  >
                    Creează Quiz
                  </Button>
                  
                  <Button
                    colorScheme="pink"
                    size="lg"
                    onClick={submitHandlerUploadExam}
                    bg="rgba(255, 182, 193, 0.9)"
                    _hover={{ 
                      bg: "rgba(255, 182, 193, 1)",
                      transform: 'scale(1.05)',
                    }}
                    boxShadow="lg"
                    borderRadius="full"
                    leftIcon={<Icon as={FaFileUpload} boxSize={5} />}
                    px={8}
                    transition="all 0.2s ease-in-out"
                    flex={{ base: "1", md: "0 1 auto" }}
                    minW={{ base: "full", md: "200px" }}
                  >
                    Încarcă Examene
                  </Button>
                </>
              )}

              {user && user.occupation === 'student' && (
                <Button
                  colorScheme="pink"
                  size="lg"
                  onClick={submitHandlerQuizPage}
                  bg="rgba(255, 182, 193, 0.9)"
                  _hover={{ 
                    bg: "rgba(255, 182, 193, 1)",
                    transform: 'scale(1.05)',
                  }}
                  boxShadow="lg"
                  borderRadius="full"
                  leftIcon={<Icon as={FaBookReader} boxSize={5} />}
                  px={8}
                  transition="all 0.2s ease-in-out"
                  flex={{ base: "1", md: "0 1 auto" }}
                  minW={{ base: "full", md: "200px" }}
                >
                  Rezolvă Quiz-uri!
                </Button>

                
              )}
            </Flex>
          </Box>
        </Box>
      </Container>
    );
};

export default Home;
