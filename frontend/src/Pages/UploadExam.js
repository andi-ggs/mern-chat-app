import React, { useState } from 'react';
import { Button, Fieldset, Input, Stack, Flex, Box, HStack, Text, VStack, Heading } from '@chakra-ui/react';
import { Field } from "../components/ui/field";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import GradientText from '../animations/gradientText';
import {
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
} from "../components/ui/menu";
import { Avatar } from '@chakra-ui/react';
import UserProfileModal from '../appComponents/mischellaneous/UserProfileModal';

const UploadExam = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('pdf', pdf);

      const userInfo = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;
      
      if (!userInfo || !userInfo.token) {
        setError("Nu sunteți autentificat sau sesiunea a expirat. Vă rugăm să vă autentificați din nou.");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      console.log("Uploading PDF...");
      const { data } = await axios.post('/api/exams', formData, config);
      console.log("Upload successful:", data);
      history.push('/home');
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to upload exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex justifyContent="center" p="4" w="100%">
      {/* Header */}
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
                        Vezi conversații
                    </Button>
                </HStack>
                <Box flex="0" display="flex" justifyContent="center">
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

            <Flex direction="column" alignItems="center" p="4" w="100%">
  {/* Heading Section */}
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    p={8}
    bgGradient="linear(to-r, #FFB6C1, #87CEEB)"
    w="100%"
    maxW="800px"
    borderRadius="2xl"
    boxShadow="2xl"
    textAlign="center"
    transition="all 0.3s ease-in-out"
    _hover={{ transform: 'scale(1.02)' }}
    animation="fadeIn 0.5s ease-in-out"
    sx={{
      '@keyframes fadeIn': {
        '0%': { opacity: 0, transform: 'translateY(20px)' },
        '100%': { opacity: 1, transform: 'translateY(0)' },
      },
    }}
    mt={10}
    mb={6} // Added margin-bottom to separate the heading from the form
  >
    <VStack spacing={6}>
      <Heading
        fontSize="4xl"
        fontWeight="bold"
        fontFamily="work sans"
        color="white"
        textShadow="2px 2px 4px rgba(0,0,0,0.2)"
      >
        Încarcă un nou examen
      </Heading>
    </VStack>
  </Box>

  {/* Form Section */}
  <Box
    bg="white"
    p="8"
    borderRadius="lg"
    boxShadow="lg"
    maxW="800px"
    w="90%"
    mt="4"
  >
    <Fieldset.Root size="lg" maxW="800px">
      <Stack alignItems="center" p="4">
        {/* Optional Helper Text */}
      </Stack>

      <Fieldset.Content>
        <Text fontSize="xl" fontWeight="bold" color="black" mb={2}>
          Titlul Examenului
        </Text>
        <Input
          name="title"
          type="text"
          placeholder="Introduceți titlul examenului"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fontSize="md"
          p="6"
          required
        />

        <Text fontSize="xl" fontWeight="bold" color="black" mb={2}>
          Descrierea Examenului
        </Text>
        <Input
          as="textarea"
          name="description"
          placeholder="Introduceți descrierea examenului"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          minH="150px"
          fontSize="md"
          p="6"
        />

        <Text fontSize="xl" fontWeight="bold" color="black" mb={2}>
          Fișier PDF al Examenului
        </Text>
        <Flex direction="row" align="center" width="100%">
          <Input
            type="file"
            p={1.5}
            accept=".pdf"
            onChange={(e) => setPdf(e.target.files[0])}
            color="black"
          />
        </Flex>
      </Fieldset.Content>

      <Button
        type="submit"
        alignSelf="center"
        bg="lightblue"
        color="white"
        _hover={{ bg: "lightblue.100" }}
        _active={{ bg: "white", color: "lightblue", border: "2px solid lightblue" }}
        _focus={{ boxShadow: "none" }}
        mt="4"
        width="100%"
        onClick={handleSubmit}
        isLoading={loading}
        loadingText="Se încarcă..."
      >
        Încarcă Examen
      </Button>
    </Fieldset.Root>

    {error && (
      <Flex
        justifyContent="center"
        alignItems="center"
        bg="red.100"
        color="red.800"
        p="4"
        mt="4"
        borderRadius="md"
        position="relative"
        bottom="0"
        width="100%"
      >
        {error}
      </Flex>
    )}
  </Box>
</Flex>
    </Flex>
  );
};

export default UploadExam; 