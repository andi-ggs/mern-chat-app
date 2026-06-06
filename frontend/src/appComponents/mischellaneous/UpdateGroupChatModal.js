import { Spinner, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Button, Box, Fieldset, Input, Flex, Text, VStack, Separator } from '@chakra-ui/react'
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
import { FaInfo } from 'react-icons/fa'

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState()
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [renameLoading, setRenameLoading] = useState(false)

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const { selectedChat, setSelectedChat, user } = ChatState()

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      setMessage('Oops! Utilizatorul ales este deja in grup.')
      setMessageType('error')
      setTimeout(() => setMessage(''), 5000)
      return
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      setMessage('Oops! Doar adminul poate adauga pe cineva.')
      setMessageType('error')
      setTimeout(() => setMessage(''), 5000)
      return
    }

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      )

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoading(false)
    } catch (error) {
      setMessage('Oops! A aparut o eroare.')
      setMessageType('error')
      setTimeout(() => setMessage(''), 5000)
      setLoading(false)
    }
    setGroupChatName('')
  }

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      setMessage('Oops! Doar adminul poate elimina pe cineva din grup.')
      setMessageType('error')
      setTimeout(() => setMessage(''), 5000)
      return
    }

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      )

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      fetchMessages()
      setLoading(false)
    } catch (error) {
      setMessage('Oops! A aparut o eroare.')
      setMessageType('error')
      setTimeout(() => setMessage(''), 5000)
      setLoading(false)
    }
    setGroupChatName('')
  }

  const handleRename = async () => {
    if (!groupChatName) return

    try {
      setRenameLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      )

      console.log(data._id)
      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setRenameLoading(false)
    } catch (error) {
      setMessage('Oops! A aparut o eroare.')
      setMessageType('error')
      setTimeout(() => setMessage(''), 5000)
      setRenameLoading(false)
    }
    setGroupChatName('')
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
      console.log(data)
      setLoading(false)
      setSearchResult(data)
    } catch (error) {
      setMessage('Oops! Nu s-au putut incarca rezultatele cautarii.')
      setMessageType('error')
      setTimeout(() => setMessage(''), 5000)
      setLoading(false)
    }
  }

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          borderRadius="xl"
          color="gray.600"
          _hover={{ bg: 'gray.100' }}
          _active={{ bg: 'gray.100' }}
          _focus={{ bg: 'gray.100' }}
          _expanded={{ bg: 'gray.100' }}
          onClick={onOpen}
        >
          <FaInfo />
        </Button>
      </DialogTrigger>
      <DialogContent
        bg="white"
        borderRadius="2xl"
        maxW="520px"
        mx={4}
        boxShadow="0 20px 60px rgba(0, 0, 0, 0.12)"
      >
        <DialogHeader px={6} pt={6} pb={0}>
          <DialogTitle fontSize="xl" fontWeight="bold" color="gray.800">
            {selectedChat.chatName}
          </DialogTitle>
          <Text fontSize="sm" color="gray.500" mt={1}>
            {selectedChat.users.length} membri · Gestionează grupul
          </Text>
        </DialogHeader>

        <DialogBody px={6} py={5}>
          <VStack gap={5} align="stretch" w="100%">
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={3}>
                Membri
              </Text>
              <Box w="100%" display="flex" flexWrap="wrap" gap={2}>
                {selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    admin={selectedChat.groupAdmin}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </Box>
            </Box>

            <Separator borderColor="gray.100" />

            <Fieldset.Root>
              <Fieldset.Content>
                <Field label="Redenumește grupul" color="gray.700">
                  <Flex gap={2}>
                    <Input
                      placeholder="Nume nou pentru grup"
                      flex={1}
                      value={groupChatName}
                      color="gray.800"
                      borderRadius="xl"
                      borderColor="gray.200"
                      bg="gray.50"
                      px={4}
                      _focus={{ borderColor: 'blue.300', bg: 'white' }}
                      onChange={(e) => setGroupChatName(e.target.value)}
                    />
                    <Button
                      variant="solid"
                      bg="#0084ff"
                      color="white"
                      borderRadius="xl"
                      px={5}
                      fontWeight="semibold"
                      _hover={{ bg: '#0073e6' }}
                      loading={renameLoading}
                      onClick={handleRename}
                    >
                      Salvează
                    </Button>
                  </Flex>
                </Field>
              </Fieldset.Content>
            </Fieldset.Root>

            <Fieldset.Root>
              <Fieldset.Content>
                <Field label="Adaugă membru" color="gray.700">
                  <Input
                    placeholder="Caută utilizator după nume..."
                    color="gray.800"
                    borderRadius="xl"
                    borderColor="gray.200"
                    bg="gray.50"
                    px={4}
                    _focus={{ borderColor: 'blue.300', bg: 'white' }}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </Field>
              </Fieldset.Content>
            </Fieldset.Root>

            {loading ? (
              <Flex justify="center" py={3}>
                <Spinner color="blue.400" size="md" />
              </Flex>
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </VStack>
        </DialogBody>

        <DialogFooter px={6} pb={6} pt={2} flexDir="column" alignItems="stretch" gap={3}>
          <DialogActionTrigger asChild>
            <Button
              onClick={() => handleRemove(user)}
              w="100%"
              borderRadius="xl"
              py={6}
              fontWeight="semibold"
              bg="red.50"
              color="red.600"
              borderWidth="1px"
              borderColor="red.200"
              _hover={{ bg: 'red.100' }}
            >
              Părăsește grupul
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
  )
}

export default UpdateGroupChatModal
