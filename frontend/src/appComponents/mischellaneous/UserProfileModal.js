import React from 'react'
import {
    Button,
    useDisclosure,
    Text,
    Image,
    Center,
} from "@chakra-ui/react";
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
import { FaInfo } from 'react-icons/fa';

const UserProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <DialogRoot size="md" isOpen={isOpen} onClose={onClose} isCentered>
                <DialogTrigger asChild>
                    <Button size="lg" ml="auto"
                        variant="ghost"
                        _hover={{ bg: 'gray.300' }}
                        _active={{ bg: 'gray.300' }}
                        _focus={{ bg: 'gray.300' }}
                        _expanded={{ bg: 'gray.300' }}
                    >
                        {/* <i className="fa-solid fa-circle-info" style={{ color: 'black' }} ></i> */}
                        <FaInfo style={{ color: 'black' }} />
                    </Button>
                </DialogTrigger>
                <DialogContent h="400px" bg="white">
                    <DialogHeader>
                        <Center>
                            <DialogTitle 
                            fontSize="40px"
                            fontFamily="Work sans" 
                            mt={6}
                            color="black"
                            >
                            {user.name}
                            </DialogTitle>
                        </Center>
                    </DialogHeader>
                    <DialogBody>
                        <Center flexDirection="column">
                            {/* Imaginea profilului */}
                            <Image
                                mt={6}
                                borderRadius="full"
                                boxSize="150px"
                                src={user.pic}
                                alt="Profile Picture"
                            />

                            {/* Adresa de email */}
                            <Text 
                            mt={6} 
                            fontSize={{ base: "28px", md: "30px" }}
                            fontFamily="Work sans"
                            color="black"
                            > Email: {user.email}
                            </Text>
                        </Center>
                    </DialogBody>
                    <DialogFooter>
                    </DialogFooter>
                    <DialogCloseTrigger />
                </DialogContent>
            </DialogRoot>
        </>
    );
};

export default UserProfileModal;
