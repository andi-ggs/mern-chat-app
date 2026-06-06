import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Button, VStack, Spinner, Flex, HStack, Icon } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { FaFilePdf, FaDownload } from 'react-icons/fa';
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
import { SimpleGrid } from '@chakra-ui/react';

const ViewExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
          history.push('/');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get('/api/exams', config);
        setExams(data);
        setLoading(false);
      } catch (error) {
        setError('Eroare la încărcarea examenelor. Încercați din nou mai târziu.');
        setLoading(false);
      }
    };

    fetchExams();
  }, [history]);

  const handleViewPdf = (examId) => {
    history.push(`/view-exam/${examId}`);
  };

  const getFullPdfUrl = (pdfPath) => {
    if (!pdfPath) return '';
    // Remove any leading slash to avoid double slashes
    const path = pdfPath.startsWith('/') ? pdfPath.substring(1) : pdfPath;
    return `${window.location.origin}/${path}`;
  };

  const handleDownloadPdf = (pdfPath, title) => {
    // Create an anchor element and trigger a download
    const link = document.createElement('a');
    link.href = getFullPdfUrl(pdfPath);
    link.setAttribute('download', `${title}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="80vh">
        <Spinner size="xl" color="pink.500" />
      </Flex>
    );
  }

  return (
    <Box w="100%" px={4} centerContent>
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
        <HStack spacing={4}>
          <Button
            as="a"
            href="/home"
            colorScheme="pink"
            size="md"
            bg="rgba(255, 182, 193, 0.9)"
            _hover={{ bg: "rgba(255, 182, 193, 1)" }}
            color="white"
            boxShadow="lg"
            borderRadius="full"
            backdropFilter="blur(5px)"
          >
            Înapoi la pagina principală
          </Button>
          <Button
            as="a"
            href="/chats"
            colorScheme="pink"
            size="md"
            bg="rgba(255, 182, 193, 0.9)"
            _hover={{ bg: "rgba(255, 182, 193, 1)" }}
            color="white"
            boxShadow="lg"
            borderRadius="full"
            backdropFilter="blur(5px)"
          >
            Conversatiile mele
          </Button>
        </HStack>
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
              Profilul meu
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
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={8}
        bgGradient="linear(to-r, #FFB6C1, #87CEEB)"
        w="100%"
        maxW="600px"
        m="40px 600px"
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
            Modele de examen
          </Heading>
        </VStack>
      </Box>
      <Box maxW="1200px" mx="auto" ml={0}>
        {error && (
          <Box bg="red.100" color="red.800" p={4} borderRadius="md" mb={4}>
            {error}
          </Box>
        )}

        {exams.length === 0 ? (
          <Box textAlign="center" p={4}>
            <Text fontSize="lg">Nu există examene disponibile momentan.</Text>
          </Box>
        ) : (
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
            gap={6}
            justifyItems="start"
            alignItems="start"
          >
            {exams.map((exam) => (
              <Box
                key={exam._id}
                minH="150px"
                minW="200px"
                display="flex"
                flexDirection="column"
                justifyContent="left"
                p={5}
                shadow="md"
                borderWidth="1px"
                borderRadius="lg"
                bg="white"
                _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                <Flex justifyContent="space-between" alignItems="flex-start" height="100%" direction="column">
                  <Box>
                    <Heading size="md" mb={2} color="black">{exam.title}</Heading>
                    <Text mb={3} color="black">{exam.description}</Text>
                    <Text fontSize="sm" color="green.600">
                      Încărcat de: {exam.createdBy?.name || 'Necunoscut'}
                    </Text>
                    <Text fontSize="sm" color="green.600">
                      Data: {new Date(exam.createdAt).toLocaleDateString('ro-RO')}
                    </Text>
                  </Box>
                  <Flex justify="space-between" mt={3}>
                    <Button
                      leftIcon={<Icon as={FaFilePdf} />}
                      //colorScheme="pink"
                      variant="solid"
                      size="sm"
                      as="a"
                      bg="teal.300"
                      //_hover={{ bg: "rgba(255, 182, 193, 1)" }}
                      color="white"
                      boxShadow="lg"
                      borderRadius="full"
                      backdropFilter="blur(5px)"
                      onClick={() => handleViewPdf(exam._id)}
                    >
                      Vizualizează
                    </Button>
                    <Button
                      leftIcon={<Icon as={FaDownload} />}
                      size="sm"
                      as="a"
                      colorScheme="pink"
                      bg="rgba(255, 182, 193, 0.9)"
                      _hover={{ bg: "rgba(255, 182, 193, 1)" }}
                      color="white"
                      boxShadow="lg"
                      borderRadius="full"
                      backdropFilter="blur(5px)"
                      onClick={() => handleDownloadPdf(exam.pdf, exam.title)}
                    >
                      Descarcă
                    </Button>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
};

export default ViewExams; 