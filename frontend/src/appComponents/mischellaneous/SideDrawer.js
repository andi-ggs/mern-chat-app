import { Box, Button, Text, useDisclosure, Input, Flex } from '@chakra-ui/react'
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  MenuSeparator,
} from "../../components/ui/menu";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/ui/drawer"
import axios from 'axios'
import UserListItem from '../userAvatar/UserListItem';
import ChatLoading from '../ChatLoading';
import { Tooltip } from "../../components/ui/tooltip"
import React, { useState } from 'react'
import { Avatar } from '@chakra-ui/react';
import { ChatState } from '../../context/chatProvider';
import UserProfileModal from './UserProfileModal';
import { useHistory } from 'react-router-dom';
import { Spinner } from "@chakra-ui/react";
import { getSender } from '../../config/ChatLogic';
import NotificationBadge from 'react-notification-badge'
import {Effect} from 'react-notification-badge'
import GradientText from '../../animations/gradientText';
import { FaSearch } from "react-icons/fa";
import { FaBell } from "react-icons/fa";

const SideDrawer = () => {
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState();
  const {setSelectedChat, chatState, setChatState, notification, setNotification } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      setMessage("Te rugam sa introduci un nume in bara de cautari");
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

      const { data } = await axios.get(`/api/user?search=${search}`, config)
      console.log(data)
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setMessage("A aparut o eroare! Nu am putut incarca rezultatele.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

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
      console.log(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      console.log(error)
      setMessage("A aparut o eroare!");
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="10px 10px 5px 10px"
      borderWidth="0px"
      top="0"
      position="fixed"
    >
      <DrawerRoot placement="left" onClose={onClose} isOpen={isOpen} bg="white">
      <DrawerBackdrop/>
        <Tooltip content="Cauta utilizatori" hasArrow placement="bottom-end" >
          <DrawerTrigger asChild>
            <Button variant="ghost" _hover={{ bg: 'gray.300' }}>
            <FaSearch size="15px" color="black" />
              <Text d={{ base: "none", md: 'flex' }} px='1' color={'black'}>
                Cauta Utilizatori
              </Text>
            </Button>
          </DrawerTrigger>
        </Tooltip>
        <Button
          as="a"
          href="/home"
          colorScheme="pink"
          size="sm"
          bg="rgba(255, 182, 193, 0.9)"
          _hover={{ bg: "rgba(255, 182, 193, 1)" }}
          color="white"
          boxShadow="lg"
          borderRadius="full"
          ml={2}
          px={4}
          py={2}
          mt={-2}
        >
          Înapoi la pagina principală
        </Button>
        <DrawerContent bg="white">
          <DrawerHeader>
            <DrawerTitle borderBottomWidth="1px" color="black">Cauta utilizatori</DrawerTitle>
          </DrawerHeader>
          <DrawerBody bg="white">
            <Box display="flex" alignItems="center" pb={2}>
              <Input
                placeholder="Search by name or email"
                color="black"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                width="200px"
              />
              <Button
                onClick={handleSearch}
                bg="#E8E8E8"
                _hover={{
                  background: "#38B2AC",
                  color: "white",
                }}
                width="70px"
                p={2}
              >
                Caută
              </Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                );
              })
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}

          </DrawerBody>
          <DrawerFooter>
            {message && (
              <Flex
                justifyContent="center"
                alignItems="center"
                bg={messageType === "warning" ? "yellow.100" : messageType === "success" ? "green.100" : "red.100"}
                color={messageType === "warning" ? "yellow.800" : messageType === "success" ? "green.800" : "red.800"}
                p="4"
                mt="8"
                borderRadius="md"
                width="100%"
              >
                {message}
              </Flex>
            )}
          </DrawerFooter>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
      <GradientText
        colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
        animationSpeed={3}
        showBorder={false}
        className="custom-class">
      AskYourProf
    </GradientText>
      <div>
        <MenuRoot>
          <MenuTrigger asChild>
            <Button size="lg" ml="auto"
              variant="ghost"
              _hover={{ bg: 'gray.300' }}
              _active={{ bg: 'gray.300' }}
              _focus={{ bg: 'gray.300' }}
              _expanded={{ bg: 'gray.300' }}>
              <NotificationBadge count={notification.length} effect={Effect.SCALE} />
              {/* <NotificationBadge>
              count={notification.length}
              effect={Effect.SCALE}
            </NotificationBadge> */}
              <FaBell style={{ color: 'black' }} />
            </Button>
          </MenuTrigger>
          <MenuContent pl={2}>
            {!notification.length && "No new messages"}
            {notification.map(notif => (
              <MenuItem 
              bg="white"
              fontFamily="Work sans"
              color="black"
              key={notif._id} onClick={() => {
                setSelectedChat(notif.chat);
                setNotification(notification.filter((n) => n !== notif));
              }}>
                {notif.chat.isGroupChat?`New Message in ${notif.chat.chatName}`:`New message from ${getSender(user, notif.chat.users)}`}
              </MenuItem>
            ))}
          </MenuContent>
        </MenuRoot>
        <MenuRoot closeOnSelect={false}>
          <MenuTrigger asChild>
            <Button size="lg" ml="auto"
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
      </div>
    </Box>

  )
}

export default SideDrawer;
