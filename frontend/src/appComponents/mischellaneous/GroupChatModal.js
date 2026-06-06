import React, {useState} from 'react'
import {
    Button,
    useDisclosure,
    Fieldset,
    Input,
    Box,
    Flex,
} from "@chakra-ui/react";
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


const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [formValid, setFormValid] = useState(true);

    const handleGroup = (userToAdd) => {
        if(selectedUsers.includes(userToAdd)){
            setMessage("Utilizatorul este deja adaugat.");
            setMessageType("warning");
            setTimeout(() => setMessage(""), 5000);
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);

    };        
    const handleSearch = async (query) => {
        setSearch(query);

        if(!query){
            return;
        }

        try{
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
            setMessage("A aparut o eroare! Nu am putut incarca rezultatele.");
            setMessageType("error");
            setTimeout(() => setMessage(""), 5000); 
        }
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const handleSubmit = async () => {
        if (!groupChatName || selectedUsers.length === 0) {
            setMessage("Te rugăm să introduci un nume pentru grup și să adaugi cel puțin un utilizator.");
            setMessageType("warning");
            setTimeout(() => setMessage(""), 5000); 
            setFormValid(false);
            return; 
          }

          try {
            setFormValid(true);
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };
            const { data } = await axios.post(
              `/api/chat/group`,
              {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
              },
              config
            );
            setSelectedChat([data, ...selectedChat]);
            setMessage("Un nou grup a fost creat cu succes!");
            setMessageType("success");
            setTimeout(() => setMessage(""), 5000);
            onClose();
          } catch (error) {
            setMessage("A aparut o eroare! Nu s-a putut crea chat-ul");
            setMessageType("error");
            setTimeout(() => setMessage(""), 5000);
          }
    };

    return (
        <>
        <DialogRoot onClose={formValid ? onClose : undefined} isOpen={isOpen} isCentered>
        <DialogTrigger asChild>
        <span onClick={onOpen}>{children}</span>
        </DialogTrigger>
        <DialogContent bg="white">
          <DialogHeader>
          <DialogTitle
                fontSize="35px"
                fontFamily="Work sans"
                display="flex"
                justifyContent="center"
                color="black">
                Creeaza un grup nou
          </DialogTitle> 
          </DialogHeader>
          <DialogBody
            display="flex"
            flexDir="column"
            alignItems="center">
            <Fieldset.Root>
                <Fieldset.Content>
                <Field 
                    color="black" 
                    fontFamily="Work sans" 
                    label="Introduceti numele grupului">
                    <Input
                    placeholder="Numele grupului"
                    mb={3}
                    onChange={(e) => setGroupChatName(e.target.value)}/>
                </Field>
                <Field 
                    color="black" 
                    fontFamily="Work sans"
                    label="Adaugati utilizatori">
                    <Input
                    placeholder="Adaugati utilizatori eg: Ana, Maria, Alex"
                    mb={1}
                    onChange={(e) => handleSearch(e.target.value)}/>
                </Field>
                </Fieldset.Content>
                <Box w="100%" display="flex" flexWrap="wrap">
                    {selectedUsers.map((u) => (
                        <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                        ))}
                </Box>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    search && searchResult
                        ?.slice(0, 4)
                        .map((user) => <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />)
                    )}
            </Fieldset.Root>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
             <Button 
             onClick={handleSubmit} 
             bg="#E8E8E8"
            _hover={{
                background: "#38B2AC",
                color: "white"}}>
            Create Chat
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
      </>
    )
}

export default GroupChatModal
