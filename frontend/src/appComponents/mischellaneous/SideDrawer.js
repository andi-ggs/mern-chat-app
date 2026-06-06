import {
  Box,
  Button,
  Text,
  useDisclosure,
  Input,
  Flex,
  HStack,
  Icon,
  VStack,
  Avatar,
  Spinner,
} from '@chakra-ui/react';
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  MenuSeparator,
} from '../../components/ui/menu';
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from '../../components/ui/drawer';
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';
import ChatLoading from '../ChatLoading';
import { Tooltip } from '../../components/ui/tooltip';
import React, { useState } from 'react';
import { ChatState } from '../../context/chatProvider';
import UserProfileModal from './UserProfileModal';
import { useHistory, useLocation } from 'react-router-dom';
import { getSender } from '../../config/ChatLogic';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';
import {
  FaSearch,
  FaBell,
  FaHome,
  FaComments,
  FaBookReader,
  FaPencilAlt,
  FaFilePdf,
  FaGraduationCap,
  FaBars,
} from 'react-icons/fa';

export const NAVBAR_HEIGHT = 72;

const NavLink = ({ icon, label, path, isActive, onNavigate }) => (
  <Tooltip content={label} placement="bottom">
    <Button
      variant="ghost"
      size="sm"
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap={2}
      px={4}
      py={2}
      h="auto"
      borderRadius="xl"
      fontFamily="Inter, sans-serif"
      fontSize="sm"
      fontWeight={isActive ? 'semibold' : 'medium'}
      color={isActive ? 'indigo.600' : 'gray.600'}
      bg={isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent'}
      border="1px solid"
      borderColor={isActive ? 'rgba(99, 102, 241, 0.25)' : 'transparent'}
      _hover={{
        bg: isActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.7)',
        transform: 'translateY(-1px)',
        borderColor: isActive ? 'rgba(99, 102, 241, 0.35)' : 'rgba(255, 255, 255, 0.5)',
      }}
      transition="all 0.2s ease"
      onClick={() => onNavigate(path)}
    >
      <Icon as={icon} boxSize={4} />
      <Text display={{ base: 'none', lg: 'inline' }}>{label}</Text>
    </Button>
  </Tooltip>
);

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { setSelectedChat, chatState, setChatState, notification, setNotification } =
    ChatState();
  const history = useHistory();
  const location = useLocation();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const searchDrawer = useDisclosure();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const user = JSON.parse(localStorage.getItem('userInfo'));

  const isActive = (path) => location.pathname === path;

  const quizPath = user?.occupation === 'teacher' ? '/quiz' : '/solve-quizzes';
  const quizLabel = user?.occupation === 'teacher' ? 'Creează Quiz' : 'Quiz-uri';
  const QuizIcon = user?.occupation === 'teacher' ? FaPencilAlt : FaBookReader;

  const navItems = [
    { icon: FaHome, label: 'Acasă', path: '/home' },
    { icon: FaComments, label: 'Chat', path: '/chats' },
    { icon: QuizIcon, label: quizLabel, path: quizPath },
    { icon: FaFilePdf, label: 'Examene', path: '/view-exams' },
  ];

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    history.push('/');
  };

  const handleSearch = async () => {
    if (!search) {
      setMessage('Te rugăm să introduci un nume în bara de căutare');
      setMessageType('warning');
      setTimeout(() => setMessage(''), 5000);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setMessage('A apărut o eroare! Nu am putut încărca rezultatele.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 5000);
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (chatState && !chatState.find((c) => c._id === data._id)) {
        setChatState([data, ...chatState]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      searchDrawer.onClose();
    } catch (error) {
      console.log(error);
      setMessage('A apărut o eroare!');
      setMessageType('error');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const navigateTo = (path) => {
    history.push(path);
    onClose();
  };

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      h={`${NAVBAR_HEIGHT}px`}
      px={{ base: 3, md: 6 }}
      py={2}
    >
      <Flex
        justify="space-between"
        align="center"
        h="100%"
        bg="rgba(255, 255, 255, 0.72)"
        backdropFilter="blur(20px) saturate(180%)"
        WebkitBackdropFilter="blur(20px) saturate(180%)"
        border="1px solid"
        borderColor="rgba(255, 255, 255, 0.6)"
        borderRadius="2xl"
        boxShadow="0 8px 32px rgba(99, 102, 241, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)"
        px={{ base: 3, md: 5 }}
        py={2}
        w="100%"
      >
        {/* Logo */}
        <HStack
          flex="0 0 auto"
          spacing={2}
          cursor="pointer"
          onClick={() => history.push('/home')}
          _hover={{ opacity: 0.85 }}
          transition="opacity 0.2s"
        >
          <Flex
            align="center"
            justify="center"
            w={9}
            h={9}
            borderRadius="xl"
            bgGradient="linear(to-br, indigo.500, purple.500)"
            boxShadow="0 4px 12px rgba(99, 102, 241, 0.35)"
          >
            <Icon as={FaGraduationCap} color="white" boxSize={4} />
          </Flex>
          <VStack align="flex-start" spacing={0} display={{ base: 'none', sm: 'flex' }}>
            <Text
              fontFamily="Nunito, sans-serif"
              fontSize="lg"
              fontWeight="800"
              lineHeight="1.1"
              bgGradient="linear(to-r, indigo.600, purple.500)"
              bgClip="text"
            >
              AskYourProf
            </Text>
            <Text fontSize="2xs" color="gray.500" fontFamily="Inter, sans-serif" fontWeight="medium">
              Platformă educațională
            </Text>
          </VStack>
        </HStack>

        {/* Navigare centrală — desktop */}
        <HStack spacing={1} flex={1} justify="center" display={{ base: 'none', md: 'flex' }}>
          {navItems.map(({ icon, label, path }) => (
            <NavLink
              key={path}
              icon={icon}
              label={label}
              path={path}
              isActive={isActive(path)}
              onNavigate={history.push}
            />
          ))}
        </HStack>

        {/* Acțiuni dreapta */}
        <HStack spacing={1} flex="0 0 auto">
          {/* Meniu mobil */}
          <DrawerRoot placement="bottom" onClose={onClose} isOpen={isOpen}>
            <DrawerBackdrop />
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                borderRadius="xl"
                color="gray.600"
                display={{ base: 'flex', md: 'none' }}
                _hover={{ bg: 'indigo.50', color: 'indigo.600' }}
                onClick={onOpen}
              >
                <FaBars size="14px" />
              </Button>
            </DrawerTrigger>
            <DrawerContent bg="white" borderTopRadius="2xl">
              <DrawerHeader borderBottomWidth="1px" borderColor="gray.100">
                <DrawerTitle fontFamily="Nunito, sans-serif" color="gray.800">
                  Navigare
                </DrawerTitle>
              </DrawerHeader>
              <DrawerBody py={4}>
                <VStack align="stretch" spacing={2}>
                  {navItems.map(({ icon, label, path }) => (
                    <Button
                      key={path}
                      variant="ghost"
                      justifyContent="flex-start"
                      leftIcon={<Icon as={icon} />}
                      borderRadius="xl"
                      fontFamily="Inter, sans-serif"
                      color={isActive(path) ? 'indigo.600' : 'gray.700'}
                      bg={isActive(path) ? 'indigo.50' : 'transparent'}
                      _hover={{ bg: 'indigo.50' }}
                      onClick={() => navigateTo(path)}
                    >
                      {label}
                    </Button>
                  ))}
                </VStack>
              </DrawerBody>
              <DrawerCloseTrigger />
            </DrawerContent>
          </DrawerRoot>

          {/* Căutare utilizatori */}
          <DrawerRoot placement="left" onClose={searchDrawer.onClose} isOpen={searchDrawer.isOpen}>
            <DrawerBackdrop />
            <DrawerTrigger asChild>
              <Tooltip content="Caută utilizatori" placement="bottom">
                <Button
                  variant="ghost"
                  size="sm"
                  borderRadius="xl"
                  color="gray.600"
                  _hover={{ bg: 'indigo.50', color: 'indigo.600' }}
                  onClick={searchDrawer.onOpen}
                >
                  <FaSearch size="14px" />
                  <Text display={{ base: 'none', lg: 'inline' }} ml={2} fontSize="sm" fontFamily="Inter, sans-serif">
                    Caută
                  </Text>
                </Button>
              </Tooltip>
            </DrawerTrigger>
            <DrawerContent bg="white">
              <DrawerHeader borderBottomWidth="1px" borderColor="gray.100">
                <DrawerTitle color="gray.800" fontWeight="semibold" fontFamily="Nunito, sans-serif">
                  Caută utilizatori
                </DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                <Flex gap={2} mb={4}>
                  <Input
                    placeholder="Caută după nume sau email"
                    color="gray.800"
                    fontFamily="Inter, sans-serif"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    borderRadius="lg"
                    flex={1}
                    borderColor="gray.200"
                    _focus={{
                      borderColor: 'indigo.500',
                      boxShadow: '0 0 0 1px var(--chakra-colors-indigo-500)',
                    }}
                  />
                  <Button
                    onClick={handleSearch}
                    bgGradient="linear(to-r, indigo.500, purple.500)"
                    color="white"
                    borderRadius="lg"
                    px={5}
                    fontFamily="Inter, sans-serif"
                    _hover={{ opacity: 0.9 }}
                  >
                    Caută
                  </Button>
                </Flex>

                {loading ? (
                  <ChatLoading />
                ) : (
                  <VStack align="stretch" spacing={0}>
                    {searchResult?.map((u) => (
                      <UserListItem
                        key={u._id}
                        user={u}
                        handleFunction={() => accessChat(u._id)}
                      />
                    ))}
                  </VStack>
                )}
                {loadingChat && <Spinner ml="auto" display="flex" />}
              </DrawerBody>
              <DrawerFooter>
                {message && (
                  <Flex
                    justifyContent="center"
                    alignItems="center"
                    bg={
                      messageType === 'warning'
                        ? 'yellow.50'
                        : messageType === 'success'
                          ? 'green.50'
                          : 'red.50'
                    }
                    color={
                      messageType === 'warning'
                        ? 'yellow.700'
                        : messageType === 'success'
                          ? 'green.700'
                          : 'red.700'
                    }
                    p={3}
                    borderRadius="lg"
                    width="100%"
                    fontSize="sm"
                    fontFamily="Inter, sans-serif"
                  >
                    {message}
                  </Flex>
                )}
              </DrawerFooter>
              <DrawerCloseTrigger />
            </DrawerContent>
          </DrawerRoot>

          {/* Notificări */}
          <MenuRoot>
            <MenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                borderRadius="xl"
                color="gray.600"
                position="relative"
                _hover={{ bg: 'indigo.50', color: 'indigo.600' }}
              >
                <NotificationBadge count={notification.length} effect={Effect.SCALE} />
                <FaBell size="14px" />
              </Button>
            </MenuTrigger>
            <MenuContent borderRadius="xl" boxShadow="lg" p={2}>
              {!notification.length && (
                <Text px={3} py={2} fontSize="sm" color="gray.500" fontFamily="Inter, sans-serif">
                  Niciun mesaj nou
                </Text>
              )}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  borderRadius="lg"
                  fontSize="sm"
                  fontFamily="Inter, sans-serif"
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `Mesaj nou în ${notif.chat.chatName}`
                    : `Mesaj nou de la ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuContent>
          </MenuRoot>

          {/* Profil */}
          <MenuRoot closeOnSelect={false}>
            <MenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                borderRadius="xl"
                px={2}
                _hover={{ bg: 'indigo.50' }}
              >
                <Avatar.Root size="sm">
                  <Avatar.Fallback name={user.name} />
                  <Avatar.Image src={user.pic} />
                </Avatar.Root>
              </Button>
            </MenuTrigger>
            <MenuContent borderRadius="xl" boxShadow="lg" p={2}>
              <Box px={3} py={2} borderBottom="1px solid" borderColor="gray.100" mb={1}>
                <Text fontWeight="semibold" fontSize="sm" color="gray.800" fontFamily="Nunito, sans-serif">
                  {user.name}
                </Text>
                <Text fontSize="xs" color="gray.500" fontFamily="Inter, sans-serif">
                  {user.email}
                </Text>
              </Box>
              <MenuItem borderRadius="lg" fontSize="sm" fontFamily="Inter, sans-serif">
                <UserProfileModal user={user} />
                Profilul meu
              </MenuItem>
              <MenuSeparator />
              <MenuItem
                borderRadius="lg"
                fontSize="sm"
                fontFamily="Inter, sans-serif"
                color="red.500"
                _hover={{ bg: 'red.50' }}
                onClick={logoutHandler}
              >
                Deconectare
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        </HStack>
      </Flex>
    </Box>
  );
};

export default SideDrawer;
