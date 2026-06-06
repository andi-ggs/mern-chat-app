import React, { useState } from 'react';
import {
    Button,
    Input,
    Flex,
    Box,
    HStack,
    Text,
    VStack,
    Heading,
    Container,
    Textarea,
    Icon,
    Card,
} from '@chakra-ui/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { FaCloudUploadAlt, FaFilePdf } from 'react-icons/fa';
import GradientText from '../animations/gradientText';
import {
    MenuRoot,
    MenuTrigger,
    MenuContent,
    MenuItem,
    MenuSeparator,
} from '../components/ui/menu';
import { Avatar } from '@chakra-ui/react';
import UserProfileModal from '../appComponents/mischellaneous/UserProfileModal';

const UploadExam = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [pdf, setPdf] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('userInfo'));

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        history.push('/');
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

            const userInfo = localStorage.getItem('userInfo')
                ? JSON.parse(localStorage.getItem('userInfo'))
                : null;

            if (!userInfo || !userInfo.token) {
                setError('Nu sunteți autentificat sau sesiunea a expirat. Vă rugăm să vă autentificați din nou.');
                setLoading(false);
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.post('/api/exams', formData, config);
            history.push('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Nu s-a putut încărca examenul. Încercați din nou.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyles = {
        bg: 'white',
        borderColor: 'gray.200',
        color: 'gray.800',
        fontSize: 'md',
        _hover: { borderColor: 'indigo.300' },
        _focus: { borderColor: 'indigo.500', boxShadow: '0 0 0 1px var(--chakra-colors-indigo-500)' },
        _placeholder: { color: 'gray.400' },
    };

    return (
        <Box minH="100vh" bg="linear-gradient(160deg, #F8FAFC 0%, #EEF2FF 40%, #FDF2F8 100%)">
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
                        <MenuItem bg="white" color="black" _hover={{ background: 'gray.100' }} onClick={logoutHandler}>
                            Logout
                        </MenuItem>
                    </MenuContent>
                </MenuRoot>
            </Box>

            <Container maxW="720px" px={4} pt={28} pb={16}>
                <Box textAlign="center" mb={10}>
                    <Icon as={FaCloudUploadAlt} boxSize={12} color="indigo.500" mb={5} />
                    <Heading
                        fontSize={{ base: '2xl', md: '3xl' }}
                        fontWeight="bold"
                        color="gray.800"
                        mb={3}
                        letterSpacing="-0.02em"
                    >
                        Încarcă un nou examen
                    </Heading>
                    <Text color="gray.600" fontSize="md" lineHeight="1.7">
                        Adaugă un model de examen în format PDF pentru elevi
                    </Text>
                </Box>

                <Card.Root bg="white" borderRadius="2xl" boxShadow="xl" overflow="hidden">
                    <Box h="5px" bg="linear-gradient(90deg, #6366F1, #8B5CF6, #EC4899)" />
                    <Card.Body p={{ base: 6, md: 8 }}>
                        <VStack spacing={7} align="stretch" as="form" onSubmit={handleSubmit}>
                            <Box>
                                <Text fontSize="md" fontWeight="semibold" color="gray.700" mb={2}>
                                    Titlul examenului
                                </Text>
                                <Input
                                    name="title"
                                    type="text"
                                    placeholder="Introduceți titlul examenului"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    size="lg"
                                    h="52px"
                                    required
                                    {...inputStyles}
                                />
                            </Box>

                            <Box>
                                <Text fontSize="md" fontWeight="semibold" color="gray.700" mb={2}>
                                    Descrierea examenului
                                </Text>
                                <Textarea
                                    name="description"
                                    placeholder="Introduceți descrierea examenului"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    minH="120px"
                                    fontSize="md"
                                    lineHeight="1.6"
                                    {...inputStyles}
                                />
                            </Box>

                            <Box>
                                <Text fontSize="md" fontWeight="semibold" color="gray.700" mb={2}>
                                    Fișier PDF
                                </Text>
                                <Box
                                    border="2px dashed"
                                    borderColor={pdf ? 'indigo.300' : 'gray.200'}
                                    borderRadius="2xl"
                                    p={8}
                                    textAlign="center"
                                    bg={pdf ? 'indigo.50' : 'gray.50'}
                                    transition="all 0.2s"
                                    _hover={{ borderColor: 'indigo.400', bg: 'indigo.50' }}
                                    position="relative"
                                >
                                    <VStack spacing={3}>
                                        <Icon as={FaFilePdf} boxSize={10} color={pdf ? 'indigo.500' : 'gray.400'} />
                                        {pdf ? (
                                            <Text fontSize="md" fontWeight="medium" color="indigo.700">
                                                {pdf.name}
                                            </Text>
                                        ) : (
                                            <Text fontSize="md" color="gray.500" lineHeight="1.5">
                                                Trage fișierul aici sau apasă pentru a selecta
                                            </Text>
                                        )}
                                        <Text fontSize="sm" color="gray.400">
                                            Doar fișiere .pdf
                                        </Text>
                                    </VStack>
                                    <Input
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => setPdf(e.target.files[0])}
                                        position="absolute"
                                        top="0"
                                        left="0"
                                        w="100%"
                                        h="100%"
                                        opacity="0"
                                        cursor="pointer"
                                    />
                                </Box>
                            </Box>

                            {error && (
                                <Box bg="red.50" color="red.800" p={4} borderRadius="xl" fontSize="md" lineHeight="1.5">
                                    {error}
                                </Box>
                            )}

                            <Button
                                type="submit"
                                size="lg"
                                h="52px"
                                w="100%"
                                bg="linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"
                                _hover={{ bg: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
                                color="white"
                                fontWeight="semibold"
                                fontSize="md"
                                borderRadius="xl"
                                loading={loading}
                                loadingText="Se încarcă..."
                                disabled={!title || !pdf}
                                _disabled={{ opacity: 0.6, cursor: 'not-allowed' }}
                            >
                                Încarcă examen
                            </Button>
                        </VStack>
                    </Card.Body>
                </Card.Root>
            </Container>
        </Box>
    );
};

export default UploadExam;
