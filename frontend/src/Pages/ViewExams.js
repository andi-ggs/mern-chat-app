import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Text,
    Button,
    VStack,
    Spinner,
    Flex,
    HStack,
    Icon,
    Container,
    Card,
    Badge,
    SimpleGrid,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { FaFilePdf, FaDownload, FaFolderOpen } from 'react-icons/fa';
import GradientText from '../animations/gradientText';
import UserProfileModal from '../appComponents/mischellaneous/UserProfileModal';
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
    MenuSeparator,
} from '../components/ui/menu';
import { Avatar } from '@chakra-ui/react';

const ViewExams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('userInfo'));

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        history.push('/');
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
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };

                const { data } = await axios.get('/api/exams', config);
                setExams(data);
                setLoading(false);
            } catch (err) {
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
        const path = pdfPath.startsWith('/') ? pdfPath.substring(1) : pdfPath;
        return `${window.location.origin}/${path}`;
    };

    const handleDownloadPdf = (pdfPath, title) => {
        const link = document.createElement('a');
        link.href = getFullPdfUrl(pdfPath);
        link.setAttribute('download', `${title}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <Flex minH="100vh" justify="center" align="center" bg="gray.50">
                <VStack spacing={4}>
                    <Spinner size="xl" color="indigo.500" />
                    <Text color="gray.600" fontSize="md">
                        Se încarcă examenele...
                    </Text>
                </VStack>
            </Flex>
        );
    }

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

            <Container maxW="1200px" px={4} pt={28} pb={16}>
                <Box textAlign="center" mb={12} p={{ base: 6, md: 10 }} borderRadius="2xl" bg="white" boxShadow="lg">
                    <Icon as={FaFolderOpen} boxSize={12} color="indigo.500" mb={5} />
                    <Heading
                        fontSize={{ base: '2xl', md: '4xl' }}
                        fontWeight="bold"
                        color="gray.800"
                        mb={3}
                        letterSpacing="-0.02em"
                        lineHeight="1.2"
                    >
                        Modele de examen
                    </Heading>
                    <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.7" maxW="560px" mx="auto">
                        Vizualizează sau descarcă modele de examen încărcate de profesori
                    </Text>
                </Box>

                {error && (
                    <Box bg="red.50" color="red.800" p={5} borderRadius="xl" mb={6} fontSize="md" lineHeight="1.5">
                        {error}
                    </Box>
                )}

                {exams.length === 0 ? (
                    <Box textAlign="center" py={20} bg="white" borderRadius="2xl" boxShadow="md">
                        <Text fontSize="lg" color="gray.500" lineHeight="1.6">
                            Nu există examene disponibile momentan.
                        </Text>
                    </Box>
                ) : (
                    <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
                        {exams.map((exam) => (
                            <Card.Root
                                key={exam._id}
                                bg="white"
                                borderRadius="2xl"
                                boxShadow="md"
                                overflow="hidden"
                                transition="all 0.25s ease"
                                _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                            >
                                <Box h="5px" bg="linear-gradient(90deg, #6366F1, #8B5CF6, #EC4899)" />
                                <Card.Body p={6}>
                                    <VStack align="stretch" spacing={5} h="100%">
                                        <Box flex="1">
                                            <Heading size="md" color="gray.800" mb={3} lineHeight="1.4">
                                                {exam.title}
                                            </Heading>
                                            <Text color="gray.600" fontSize="md" lineHeight="1.6" mb={4}>
                                                {exam.description}
                                            </Text>
                                            <VStack align="stretch" spacing={1}>
                                                <Text fontSize="sm" color="gray.500">
                                                    Încărcat de:{' '}
                                                    <Text as="span" fontWeight="medium" color="gray.700">
                                                        {exam.createdBy?.name || 'Necunoscut'}
                                                    </Text>
                                                </Text>
                                                <Badge colorPalette="gray" variant="subtle" alignSelf="flex-start" borderRadius="full" px={3}>
                                                    {new Date(exam.createdAt).toLocaleDateString('ro-RO')}
                                                </Badge>
                                            </VStack>
                                        </Box>
                                        <HStack spacing={3} pt={2}>
                                            <Button
                                                flex={1}
                                                size="md"
                                                h="44px"
                                                bg="teal.500"
                                                _hover={{ bg: 'teal.600' }}
                                                color="white"
                                                borderRadius="xl"
                                                fontWeight="medium"
                                                onClick={() => handleViewPdf(exam._id)}
                                            >
                                                <Icon as={FaFilePdf} mr={2} />
                                                Vizualizează
                                            </Button>
                                            <Button
                                                flex={1}
                                                size="md"
                                                h="44px"
                                                bg="rgba(255, 182, 193, 0.9)"
                                                _hover={{ bg: 'rgba(255, 182, 193, 1)' }}
                                                color="white"
                                                borderRadius="xl"
                                                fontWeight="medium"
                                                onClick={() => handleDownloadPdf(exam.pdf, exam.title)}
                                            >
                                                <Icon as={FaDownload} mr={2} />
                                                Descarcă
                                            </Button>
                                        </HStack>
                                    </VStack>
                                </Card.Body>
                            </Card.Root>
                        ))}
                    </SimpleGrid>
                )}
            </Container>
        </Box>
    );
};

export default ViewExams;
