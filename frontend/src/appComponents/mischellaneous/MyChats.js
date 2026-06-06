import React from 'react'
import { ChatState } from "../../context/chatProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, VStack, Text, Flex } from "@chakra-ui/react"
import ChatLoading from '../ChatLoading';
import { getSender } from "../../config/ChatLogic";
import GroupChatModal from './GroupChatModal';
import { FaPlus } from "react-icons/fa";

const MyChats = ({fetchAgain}) => {
    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chatState, setChatState } = ChatState();
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const fetchChats = async () => {
        // console.log(user._id);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/chat`, config);
            setChatState(data);
        } catch (error) {
            setMessage("A aparut o eroare!");
            setMessageType("error");
            setTimeout(() => setMessage(""), 5000);
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [fetchAgain]);

    return (
        <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "30%" }}
        borderRadius="lg"
        borderWidth="1px"
        mt={20}
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
                color="black"
            >
                Conversatiile mele
                <GroupChatModal>
                <Button
                    d="flex"
                    fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                    variant="ghost"
                    color="black"
                >
                <FaPlus  color='black' size={2}/>
                    Grup nou
                </Button>
                </GroupChatModal>
            </Box>
            <Box
                display="flex"
                flexDir="column"
                p={3}
                bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="auto"
            >
                {chatState ? (
                    <VStack overflowY="scroll" spacing={2} w="100%">
                        {chatState.map((chat) => (
                            <Box
                                onClick={() => setSelectedChat(chat)}
                                cursor="pointer"
                                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                color={selectedChat === chat ? "white" : "black"}
                                px={3}
                                py={2}
                                w="100%"
                                borderRadius="lg"
                                key={chat._id}
                                textAlign="center"
                            >
                                <Text>
                                    {!chat.isGroupChat
                                        ? getSender(loggedUser, chat.users)
                                        : chat.chatName}
                                </Text>
                                {chat.latestMessage && (
                                    <Text fontSize="xs">
                                        <b>{chat.latestMessage.sender.name} : </b>
                                        {chat.latestMessage.content.length > 50
                                            ? chat.latestMessage.content.substring(0, 51) + "..."
                                            : chat.latestMessage.content}
                                    </Text>
                                )}
                            </Box>
                        ))}
                    </VStack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
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
        </Box>
    )
}

export default MyChats;
