import React, { useState } from 'react'
import {
  Button,
  useDisclosure,
  Fieldset,
  Input,
  Box,
  Flex,
  Text,
  Spinner,
  VStack,
} from '@chakra-ui/react'
import { Field } from '../../components/ui/field'
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
} from '../../components/ui/dialog'
import { ChatState } from '../../context/chatProvider'
import UserBadgeItem from '../userAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../userAvatar/UserListItem'
import { FaUsers } from 'react-icons/fa'

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState()
  const [selectedUsers, setSelectedUsers] = useState([])
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const { user, selectedChat, setSelectedChat } = ChatState()
  const [formValid, setFormValid] = useState(true)

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      setMessage('Utilizatorul este deja adaugat.')
      setMessageType('warning')
      setTimeout(() => setMessage(''), 5000)
      return
    }

    setSelectedUsers([...selectedUsers, userToAdd])
  }

  const handleSearch = async (query) => {
    setSearch(query)

    if (!query) {
      return
    }

    try {
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.get(`/api/user?search=${search}`, config)
      setLoading(false)
      setSearchResult(data)
    } catch (error) {
      setMessage('A aparut o eroare! Nu am putut incarca rezultatele.')
      setMessageType('error')
      setTimeout(() => setMessage(''), 5000)
    }
  }

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id))
  }

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      setMessage('Te rugăm să introduci un nume pentru grup și să adaugi cel puțin un utilizator.')
      setMessageType('warning')
      setTimeout(() => setMessage(''), 5000)
      setFormValid(false)
      return
    }

    try {
      setFormValid(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      )
      setSelectedChat([data, ...selectedChat])
      setMessage('Un nou grup a fost creat cu succes!')
      setMessageType('success')
      setTimeout(() => setMessage(''), 5000)
      onClose()
    } catch (error) {
      setMessage('A aparut o eroare! Nu s-a putut crea chat-ul')
      setMessageType('error')
      setTimeout(() => setMessage(''), 5000)
    }
  }

  return (
    <>
      <DialogRoot onClose={formValid ? onClose : undefined} isOpen={isOpen} isCentered>
        <DialogTrigger asChild>
          <span onClick={onOpen}>{children}</span>
        </DialogTrigger>
        <DialogContent
          bg="white"
          borderRadius="2xl"
          maxW="480px"
          mx={4}
          boxShadow="0 20px 60px rgba(0, 0, 0, 0.12)"
        >
          <DialogHeader px={6} pt={6} pb={0}>
            <Flex align="center" gap={3} mb={1}>
              <Flex
                w="44px"
                h="44px"
                borderRadius="xl"
                bg="purple.50"
                align="center"
                justify="center"
                flexShrink={0}
              >
                <FaUsers color="#805AD5" size={18} />
              </Flex>
              <Box>
                <DialogTitle fontSize="xl" fontWeight="bold" color="gray.800">
                  Creează un grup nou
                </DialogTitle>
                <Text fontSize="sm" color="gray.500" mt={0.5}>
                  Adaugă membri și alege un nume pentru grup
                </Text>
              </Box>
            </Flex>
          </DialogHeader>

          <DialogBody px={6} py={5}>
            <Fieldset.Root>
              <Fieldset.Content>
                <VStack gap={4} align="stretch" w="100%">
                  <Field label="Numele grupului" color="gray.700">
                    <Input
                      placeholder="ex: Proiect Disertație"
                      borderRadius="xl"
                      borderColor="gray.200"
                      bg="gray.50"
                      px={4}
                      py={2}
                      _focus={{ borderColor: 'blue.300', bg: 'white' }}
                      onChange={(e) => setGroupChatName(e.target.value)}
                    />
                  </Field>

                  <Field label="Adaugă utilizatori" color="gray.700">
                    <Input
                      placeholder="Caută după nume: Ana, Maria, Alex..."
                      borderRadius="xl"
                      borderColor="gray.200"
                      bg="gray.50"
                      px={4}
                      py={2}
                      _focus={{ borderColor: 'blue.300', bg: 'white' }}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </Field>
                </VStack>
              </Fieldset.Content>

              {selectedUsers.length > 0 && (
                <Box w="100%" display="flex" flexWrap="wrap" gap={2} mt={4}>
                  {selectedUsers.map((u) => (
                    <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                  ))}
                </Box>
              )}

              <Box mt={3}>
                {loading ? (
                  <Flex justify="center" py={4}>
                    <Spinner color="blue.400" size="md" />
                  </Flex>
                ) : (
                  search &&
                  searchResult
                    ?.slice(0, 4)
                    .map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleGroup(user)}
                      />
                    ))
                )}
              </Box>
            </Fieldset.Root>
          </DialogBody>

          <DialogFooter px={6} pb={6} pt={2} gap={3} flexDir="column" alignItems="stretch">
            <DialogActionTrigger asChild>
              <Button
                onClick={handleSubmit}
                w="100%"
                borderRadius="xl"
                py={6}
                fontWeight="semibold"
                bg="#0084ff"
                color="white"
                _hover={{ bg: '#0073e6' }}
              >
                Creează grupul
              </Button>
            </DialogActionTrigger>

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
                    ? 'yellow.800'
                    : messageType === 'success'
                      ? 'green.800'
                      : 'red.800'
                }
                p={3}
                borderRadius="xl"
                fontSize="sm"
                borderWidth="1px"
                borderColor={
                  messageType === 'warning'
                    ? 'yellow.200'
                    : messageType === 'success'
                      ? 'green.200'
                      : 'red.200'
                }
              >
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
