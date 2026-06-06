import {
  Text,
  Box,
  Spinner,
  Input,
  Flex,
  HStack,
  Avatar,
  IconButton,
  Icon,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ChatState } from '../context/chatProvider'
import { getSender, getSenderFull } from '../config/ChatLogic'
import UserProfileModal from './mischellaneous/UserProfileModal'
import UpdateGroupChatModal from './mischellaneous/UpdateGroupChatModal'
import './styles.css'
import ScrollableChat from './ScrollableChat'
import io from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from '../animations/typing.json'
import { FaArrowLeft, FaUsers } from 'react-icons/fa'
import { IoSend } from 'react-icons/io5'

const ENDPOINT = 'http://localhost:5000'
var socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }

  const fetchMessages = async () => {
    if (!selectedChat) return

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      setLoading(true)

      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)
      console.log(messages)

      setMessages(data)
      setLoading(false)

      socket.emit('join chat', selectedChat._id)
    } catch (error) {
      setMessage('A aparut o eroare! Nu am putut trimite mesajul.')
      setMessageType('error')
      setTimeout(() => setMessage(''), 5000)
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit('setup', user)
    socket.on('connected', () => setSocketConnected(true))
    socket.on('typing', () => setIsTyping(true))
    socket.on('stop typing', () => setIsTyping(false))
  }, [])

  useEffect(() => {
    fetchMessages()

    selectedChatCompare = selectedChat
  }, [selectedChat])

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification])
          setFetchAgain(!fetchAgain)
        }
      } else {
        setMessages([...messages, newMessageReceived])
      }
    })
  })

  const sendMessage = async () => {
    if (!newMessage) return

    socket.emit('stop typing', selectedChat._id)
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      }
      const messageContent = newMessage
      setNewMessage('')

      const { data } = await axios.post(
        '/api/message',
        {
          content: messageContent,
          chatId: selectedChat._id,
        },
        config
      )
      socket.emit('new message', data)
      setMessages([...messages, data])
    } catch (error) {
      setMessage('A aparut o eroare! Nu am putut trimite mesajul.')
      setMessageType('error')
      setTimeout(() => setMessage(''), 5000)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && newMessage) {
      sendMessage()
    }
  }

  const typingHandler = (e) => {
    setNewMessage(e.target.value)

    if (!socketConnected) return

    if (!typing) {
      setTyping(true)
      socket.emit('typing', selectedChat._id)
    }

    let lastTypingTime = new Date().getTime()
    var timerLength = 3000
    setTimeout(() => {
      var timeNow = new Date().getTime()
      var timeDifference = timeNow - lastTypingTime

      if (timeDifference >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id)
        setTyping(false)
      }
    }, timerLength)
  }

  const chatPartner = !selectedChat?.isGroupChat
    ? getSenderFull(user, selectedChat?.users)
    : null
  const chatTitle = selectedChat?.isGroupChat
    ? selectedChat.chatName
    : getSender(user, selectedChat?.users)

  return (
    <>
      {selectedChat ? (
        <Flex direction="column" h="100%" w="100%">
          <Flex
            px={5}
            py={3.5}
            align="center"
            justify="space-between"
            borderBottomWidth="1px"
            borderColor="gray.100"
            bg="white"
            flexShrink={0}
            gap={3}
          >
            <HStack gap={3} flex={1} minW={0}>
              <IconButton
                display={{ base: 'flex', md: 'none' }}
                aria-label="Înapoi"
                variant="ghost"
                size="sm"
                borderRadius="xl"
                color="gray.600"
                _hover={{ bg: 'gray.100' }}
                onClick={() => setSelectedChat('')}
              >
                <FaArrowLeft />
              </IconButton>

              {selectedChat.isGroupChat ? (
                <Flex
                  w="44px"
                  h="44px"
                  borderRadius="full"
                  bg="purple.50"
                  borderWidth="2px"
                  borderColor="purple.100"
                  align="center"
                  justify="center"
                  flexShrink={0}
                >
                  <Icon as={FaUsers} color="purple.500" boxSize={4} />
                </Flex>
              ) : (
                <Avatar.Root size="md" flexShrink={0}>
                  <Avatar.Fallback name={chatTitle} />
                  <Avatar.Image src={chatPartner?.pic} />
                </Avatar.Root>
              )}

              <Box minW={0}>
                <Text fontWeight="bold" fontSize="md" color="gray.800" truncate>
                  {chatTitle}
                </Text>
                <HStack gap={1.5}>
                  <Box
                    w="7px"
                    h="7px"
                    borderRadius="full"
                    bg={socketConnected ? 'green.400' : 'gray.300'}
                  />
                  <Text fontSize="xs" color="gray.500" fontWeight="medium">
                    {isTyping
                      ? 'scrie...'
                      : socketConnected
                        ? 'conectat'
                        : 'se conectează...'}
                  </Text>
                </HStack>
              </Box>
            </HStack>

            <Box flexShrink={0}>
              {!selectedChat.isGroupChat ? (
                <UserProfileModal user={chatPartner} />
              ) : (
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              )}
            </Box>
          </Flex>

          <Box
            flex={1}
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            bg="#eef0f3"
            overflow="hidden"
            position="relative"
          >
            {loading ? (
              <Flex flex={1} align="center" justify="center">
                <Spinner size="lg" color="blue.400" />
              </Flex>
            ) : (
              <Box className="messages" flex={1} px={1} py={4}>
                <ScrollableChat messages={messages} />
              </Box>
            )}

            {isTyping && (
              <Box px={5} pb={1}>
                <Lottie options={defaultOptions} width={50} height={30} />
              </Box>
            )}

            <Box px={5} py={4} bg="white" borderTopWidth="1px" borderColor="gray.100">
              <Flex
                align="center"
                gap={3}
                bg="gray.50"
                borderRadius="2xl"
                px={4}
                py={2}
                borderWidth="1px"
                borderColor="gray.200"
                _focusWithin={{
                  borderColor: 'blue.300',
                  boxShadow: '0 0 0 3px rgba(0, 132, 255, 0.12)',
                  bg: 'white',
                }}
                transition="all 0.18s ease"
              >
                <Input
                  flex={1}
                  variant="flushed"
                  border="none"
                  bg="transparent"
                  placeholder="Scrie un mesaj..."
                  fontSize="sm"
                  color="gray.800"
                  _placeholder={{ color: 'gray.400' }}
                  value={newMessage}
                  onChange={typingHandler}
                  onKeyDown={handleKeyDown}
                />
                <IconButton
                  aria-label="Trimite mesaj"
                  size="md"
                  borderRadius="xl"
                  colorPalette="blue"
                  bg="#0084ff"
                  color="white"
                  _hover={{ bg: '#0073e6', transform: 'scale(1.04)' }}
                  _active={{ transform: 'scale(0.97)' }}
                  transition="all 0.15s ease"
                  disabled={!newMessage.trim()}
                  onClick={sendMessage}
                >
                  <IoSend />
                </IconButton>
              </Flex>
            </Box>
          </Box>
        </Flex>
      ) : (
        <Flex
          direction="column"
          align="center"
          justify="center"
          h="100%"
          bg="#eef0f3"
          gap={5}
          px={8}
        >
          <Flex
            w="88px"
            h="88px"
            borderRadius="2xl"
            bg="white"
            boxShadow="0 4px 20px rgba(0, 0, 0, 0.06)"
            align="center"
            justify="center"
          >
            <Text fontSize="4xl">💬</Text>
          </Flex>
          <Box textAlign="center">
            <Text fontSize="xl" fontWeight="bold" color="gray.700" mb={2}>
              Selectează o conversație
            </Text>
            <Text fontSize="sm" color="gray.500" maxW="320px" lineHeight="1.6">
              Alege o conversație din lista din stânga sau caută un utilizator nou pentru a începe
              să discuți.
            </Text>
          </Box>
        </Flex>
      )}
      {message && (
        <Flex
          justifyContent="center"
          alignItems="center"
          bg={
            messageType === 'warning'
              ? 'yellow.100'
              : messageType === 'success'
                ? 'green.100'
                : 'red.100'
          }
          color={
            messageType === 'warning'
              ? 'yellow.800'
              : messageType === 'success'
                ? 'green.800'
                : 'red.800'
          }
          p={3}
          mx={5}
          mb={3}
          borderRadius="xl"
          fontSize="sm"
        >
          {message}
        </Flex>
      )}
    </>
  )
}

export default SingleChat
