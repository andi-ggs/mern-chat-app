import { Spinner, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react'
import { Button, Box, Fieldset, Input, Flex } from "@chakra-ui/react"
import { Field } from "../../components/ui/field"
import {
    DialogActionTrigger,
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog"
import { ChatState } from '../../context/chatProvider';
import UserBadgeItem from '../userAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';
import { FaInfo } from 'react-icons/fa';


const UpdateGroupChatModal = ({fetchMessages, fetchAgain, setFetchAgain }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            setMessage("Oops! Utilizatorul ales este deja in grup.");
            setMessageType("error");
            setTimeout(() => setMessage(""), 5000);
            return;
          }
      
          if (selectedChat.groupAdmin._id !== user._id) {
            setMessage("Oops! Doar adminul poate adauga pe cineva.");
            setMessageType("error");
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
            const { data } = await axios.put(
              `/api/chat/groupadd`,
              {
                chatId: selectedChat._id,
                userId: user1._id,
              },
              config
            );
      
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
          } catch (error) {
            setMessage("Oops! A aparut o eroare.");
            setMessageType("error");
            setTimeout(() => setMessage(""), 5000);
            setLoading(false);
          }
          setGroupChatName("");
    };

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            setMessage("Oops! Doar adminul poate elimina pe cineva din grup.");
            setMessageType("error");
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
            const { data } = await axios.put(
              `/api/chat/groupremove`,
              {
                chatId: selectedChat._id,
                userId: user1._id,
              },
              config
            );
      
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
          } catch (error) {
            setMessage("Oops! A aparut o eroare.");
            setMessageType("error");
            setTimeout(() => setMessage(""), 5000);
            setLoading(false);
          }
          setGroupChatName("");
     };
    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/rename`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );

            console.log(data._id);
            // setSelectedChat("");
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            setMessage("Oops! A aparut o eroare.");
            setMessageType("error");
            setTimeout(() => setMessage(""), 5000);
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
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
            console.log(data);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            setMessage("Oops! Nu s-au putut incarca rezultatele cautarii.");
            setMessageType("error");
            setTimeout(() => setMessage(""), 5000);
            setLoading(false);
        }
    };

    return (
        <DialogRoot>
            <DialogTrigger asChild>
                <Button
                    size="lg"
                    ml="auto"
                    variant="ghost"
                    _hover={{ bg: 'gray.300' }}
                    _active={{ bg: 'gray.300' }}
                    _focus={{ bg: 'gray.300' }}
                    _expanded={{ bg: 'gray.300' }}
                    onClick={onOpen}>
                    {/* <i className="fa-solid fa-circle-info" style={{ color: 'black' }}></i> */}
                    <FaInfo style={{ color: 'black' }} />
                </Button>
            </DialogTrigger>
            <DialogContent bg="white">
                <DialogHeader>
                    <DialogTitle
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                        color="black">
                        {selectedChat.chatName}
                    </DialogTitle>
                </DialogHeader>
                <DialogBody
                    display="flex"
                    flexDir="column"
                    alignItems="center"
                    color="white">
                    <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
                        {selectedChat.users.map((u) => (
                            <UserBadgeItem
                                key={u._id}
                                user={u}
                                admin={selectedChat.groupAdmin}
                                handleFunction={() => handleRemove(u)}
                            />
                        ))}
                    </Box>
                    <Fieldset.Root display="flex">
                        <Fieldset.Content>
                            <Field label="Chat Name">
                                <Flex>
                                    <Input
                                        placeholder="Chat Name"
                                        width="350px"
                                        value={groupChatName}
                                        color={"black"}
                                        onChange={(e) => setGroupChatName(e.target.value)}
                                    />
                                    <Button
                                        variant="solid"
                                        bg="teal"
                                        color="white"
                                        ml={2}
                                        isLoading={renameLoading}
                                        onClick={handleRename}
                                    >
                                        Update
                                    </Button>
                                </Flex>
                            </Field>
                        </Fieldset.Content>
                    </Fieldset.Root>
                    <Fieldset.Root>
                        <Fieldset.Content>
                            <Field>
                                <Input
                                    placeholder="Add User to group"
                                    width="350px"
                                    color="black"
                                    onChange={(e) => handleSearch(e.target.value)} />
                            </Field>
                        </Fieldset.Content>
                    </Fieldset.Root>

                    {loading ? (
                        <Spinner color="black"size="lg" />
                    ) : (
                        searchResult?.map((user) => (
                            <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={() => handleAddUser(user)}
                            />
                        ))
                    )}
                </DialogBody>
                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button
                            onClick={() => handleRemove(user)}
                            bg="red">
                            Leave Group
                        </Button>
                    </DialogActionTrigger>
                    {message && (
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            bg={messageType === "warning" ? "yellow.100" : messageType === "success" ? "green.100" : "red.100"}
                            color={messageType === "warning" ? "yellow.800" : messageType === "success" ? "green.800" : "red.800"}
                            p="4"
                            mt="8"
                            borderRadius="md"
                            width="100%">
                            {message}
                        </Flex>
                    )}
                </DialogFooter>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    )
}

export default UpdateGroupChatModal
