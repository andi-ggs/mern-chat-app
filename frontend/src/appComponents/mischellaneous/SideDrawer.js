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
} from '@chakra-ui/react';
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  MenuSeparator,
} from "../../components/ui/menu";
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
} from "../../components/ui/drawer";
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';
import ChatLoading from '../ChatLoading';
import { Tooltip } from "../../components/ui/tooltip";
import React, { useState } from 'react';
import { Avatar } from '@chakra-ui/react';
import { ChatState } from '../../context/chatProvider';
import UserProfileModal from './UserProfileModal';
import { useHistory, useLocation } from 'react-router-dom';
import { Spinner } from "@chakra-ui/react";
import { getSender } from '../../config/ChatLogic';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';
import GradientText from '../../animations/gradientText';
import {
  FaSearch,
  FaBell,
  FaHome,
  FaComments,
  FaBookReader,
  FaPencilAlt,
  FaFilePdf,
} from "react-icons/fa";

const NavLink = ({ icon, label, path, isActive, onNavigate }) => (
  <Tooltip content={label} placement="bottom">
    <Button
      variant="ghost"
      size="sm"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={0.5}
      px={3}
      py={2}
      h="auto"
      minW="56px"
      borderRadius="xl"
      color={isActive ? 'purple.600' : 'gray.600'}
      bg={isActive ? 'purple.50' : 'transparent'}
      _hover={{
        bg: isActive ? 'purple.100' : 'whiteAlpha.600',
        transform: 'translateY(-1px)',
      }}
      transition="all 0.2s"
      onClick={() => onNavigate(path)}
    >
      <Icon as={icon} boxSize={4} />
      <Text fontSize="2xs" fontWeight={isActive ? 'semibold' : 'medium'} display={{ base: 'none', md: 'block' }}>
        {label}
      </Text>
    </Button>
  </Tooltip>
);

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { setSelectedChat, chatState, setChatState, notification, setNotification } = ChatState();
  const history = useHistory();
  const location = useLocation();
  const { isOpen, onClose } = useDisclosure();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const isActive = (path) => location.pathname === path;

  const quizPath = user?.occupation === 'teacher' ? '/quiz' : '/solve-quizzes';
  const quizLabel = user?.occupation === 'teacher' ? 'Quiz-uri' : 'Quiz-uri';
  const QuizIcon = user?.occupation === 'teacher' ? FaPencilAlt : FaBookReader;

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      setMessage("Te rugăm să introduci un nume în bara de căutare");
      setMessageType("warning");
      setTimeout(() => setMessage(""), 5000);
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
      setMessage("A apărut o eroare! Nu am putut încărca rezultatele.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (chatState && !chatState.find((c) => c._id === data._id)) {
        setChatState([data, ...chatState]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      console.log(error);
      setMessage("A apărut o eroare!");
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      px={{ base: 3, md: 6 }}
      py={2}
    >
      <Flex
        justify="space-between"
        align="center"
        bg="rgba(255, 255, 255, 0.75)"
        backdropFilter="blur(16px)"
        border="1px solid"
        borderColor="whiteAlpha.600"
        borderRadius="2xl"
        boxShadow="0 4px 24px rgba(0, 0, 0, 0.06)"
        px={{ base: 3, md: 5 }}
        py={2}
        w="100%"
      >
        {/* Logo */}
        <Box flex="0 0 auto" minW="120px">
          <GradientText
            colors={["#667eea", "#764ba2", "#f093fb"]}
            animationSpeed={4}
            showBorder={false}
            className="custom-class"
          >
            AskYourProf
          </GradientText>
        </Box>

        {/* Navigare centrală */}
        <HStack spacing={1} flex={1} justify="center" display={{ base: 'none', sm: 'flex' }}>
          <NavLink icon={FaHome} label="Acasă" path="/home" isActive={isActive('/home')} onNavigate={history.push} />
          <NavLink icon={FaComments} label="Chat" path="/chats" isActive={isActive('/chats')} onNavigate={history.push} />
          <NavLink icon={QuizIcon} label={quizLabel} path={quizPath} isActive={isActive(quizPath)} onNavigate={history.push} />
          <NavLink icon={FaFilePdf} label="Examene" path="/view-exams" isActive={isActive('/view-exams')} onNavigate={history.push} />
        </HStack>

        {/* Acțiuni dreapta */}
        <HStack spacing={1} flex="0 0 auto">
          {/* Căutare utilizatori */}
          <DrawerRoot placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerBackdrop />
            <DrawerTrigger asChild>
              <Tooltip content="Caută utilizatori" placement="bottom">
                <Button
                  variant="ghost"
                  size="sm"
                  borderRadius="xl"
                  color="gray.600"
                  _hover={{ bg: 'purple.50', color: 'purple.600' }}
                >
                  <FaSearch size="14px" />
                  <Text display={{ base: 'none', lg: 'inline' }} ml={2} fontSize="sm">
                    Caută
                  </Text>
                </Button>
              </Tooltip>
            </DrawerTrigger>
            <DrawerContent bg="white">
              <DrawerHeader borderBottomWidth="1px" borderColor="gray.100">
                <DrawerTitle color="gray.800" fontWeight="semibold">
                  Caută utilizatori
                </DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                <Flex gap={2} mb={4}>
                  <Input
                    placeholder="Caută după nume sau email"
                    color="gray.800"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    borderRadius="lg"
                    flex={1}
                    borderColor="gray.200"
                    _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)' }}
                  />
                  <Button
                    onClick={handleSearch}
                    bgGradient="linear(to-r, #667eea, #764ba2)"
                    color="white"
                    borderRadius="lg"
                    px={5}
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
                      messageType === "warning"
                        ? "yellow.50"
                        : messageType === "success"
                          ? "green.50"
                          : "red.50"
                    }
                    color={
                      messageType === "warning"
                        ? "yellow.700"
                        : messageType === "success"
                          ? "green.700"
                          : "red.700"
                    }
                    p={3}
                    borderRadius="lg"
                    width="100%"
                    fontSize="sm"
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
                _hover={{ bg: 'purple.50', color: 'purple.600' }}
              >
                <NotificationBadge count={notification.length} effect={Effect.SCALE} />
                <FaBell size="14px" />
              </Button>
            </MenuTrigger>
            <MenuContent borderRadius="xl" boxShadow="lg" p={2}>
              {!notification.length && (
                <Text px={3} py={2} fontSize="sm" color="gray.500">
                  Niciun mesaj nou
                </Text>
              )}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  borderRadius="lg"
                  fontSize="sm"
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
                _hover={{ bg: 'purple.50' }}
              >
                <Avatar.Root size="sm">
                  <Avatar.Fallback name={user.name} />
                  <Avatar.Image src={user.pic} />
                </Avatar.Root>
              </Button>
            </MenuTrigger>
            <MenuContent borderRadius="xl" boxShadow="lg" p={2}>
              <Box px={3} py={2} borderBottom="1px solid" borderColor="gray.100" mb={1}>
                <Text fontWeight="semibold" fontSize="sm" color="gray.800">{user.name}</Text>
                <Text fontSize="xs" color="gray.500">{user.email}</Text>
              </Box>
              <MenuItem borderRadius="lg" fontSize="sm">
                <UserProfileModal user={user} />
                Profilul meu
              </MenuItem>
              <MenuSeparator />
              <MenuItem
                borderRadius="lg"
                fontSize="sm"
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
