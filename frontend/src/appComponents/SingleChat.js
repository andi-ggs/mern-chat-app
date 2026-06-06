import {
  Text,
  Box,
  Button,
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
            px={4}
            py={3}
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
                borderRadius="full"
                onClick={() => setSelectedChat('')}
              >
                <FaArrowLeft />
              </IconButton>

              {selectedChat.isGroupChat ? (
                <Flex
                  w="42px"
                  h="42px"
                  borderRadius="full"
                  bg="purple.100"
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
                <Text fontWeight="semibold" fontSize="md" color="gray.800" truncate>
                  {chatTitle}
                </Text>
                <HStack gap={1.5}>
                  <Box
                    w="8px"
                    h="8px"
                    borderRadius="full"
                    bg={socketConnected ? 'green.400' : 'gray.300'}
                  />
                  <Text fontSize="xs" color="gray.500">
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
            bg="#f8f9fa"
            overflow="hidden"
            position="relative"
          >
            {loading ? (
              <Flex flex={1} align="center" justify="center">
                <Spinner size="lg" color="blue.400" />
              </Flex>
            ) : (
              <Box className="messages" flex={1} px={2} py={4}>
                <ScrollableChat messages={messages} />
              </Box>
            )}

            {isTyping && (
              <Box px={4} pb={1}>
                <Lottie options={defaultOptions} width={50} height={30} />
              </Box>
            )}

            <Box px={4} py={3} bg="white" borderTopWidth="1px" borderColor="gray.100">
              <Flex
                align="center"
                gap={2}
                bg="gray.50"
                borderRadius="2xl"
                px={4}
                py={2}
                borderWidth="1px"
                borderColor="gray.200"
                _focusWithin={{ borderColor: 'blue.300', boxShadow: '0 0 0 1px #63B3ED' }}
                transition="all 0.15s ease"
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
                  size="sm"
                  borderRadius="full"
                  colorPalette="blue"
                  bg="#0084ff"
                  color="white"
                  _hover={{ bg: '#0073e6' }}
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
          bg="#f8f9fa"
          gap={4}
          px={6}
        >
          <Flex
            w="80px"
            h="80px"
            borderRadius="full"
            bg="blue.50"
            align="center"
            justify="center"
          >
            <Text fontSize="3xl">💬</Text>
          </Flex>
          <Text fontSize="xl" fontWeight="semibold" color="gray.700" textAlign="center">
            Selectează o conversație
          </Text>
          <Text fontSize="sm" color="gray.500" textAlign="center" maxW="300px">
            Alege o conversație din lista din stânga sau caută un utilizator nou pentru a începe
            să discuți.
          </Text>
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
          mx={4}
          mb={3}
          borderRadius="lg"
        >
          {message}
        </Flex>
      )}
    </>
  )
}

export default SingleChat
