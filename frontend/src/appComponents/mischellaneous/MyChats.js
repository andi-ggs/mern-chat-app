import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/chatProvider'
import axios from 'axios'
import {
  Box,
  Button,
  Text,
  Flex,
  HStack,
  VStack,
  Badge,
  Avatar,
  Icon,
} from '@chakra-ui/react'
import ChatLoading from '../ChatLoading'
import { getSender, getSenderFull } from '../../config/ChatLogic'
import GroupChatModal from './GroupChatModal'
import { FaPlus, FaUsers } from 'react-icons/fa'
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2'

const formatChatTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  if (isToday) {
    return date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })
}

const getChatAvatar = (chat, loggedUser) => {
  if (chat.isGroupChat) return null
  const sender = getSenderFull(loggedUser, chat.users)
  return sender?.pic || null
}

const getChatName = (chat, loggedUser) => {
  if (chat.isGroupChat) return chat.chatName
  return getSender(loggedUser, chat.users)
}

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState()
  const { selectedChat, setSelectedChat, user, chatState, setChatState, notification } =
    ChatState()
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.get(`/api/chat`, config)
      setChatState(data)
    } catch (error) {
      setMessage('A aparut o eroare!')
      setMessageType('error')
      setTimeout(() => setMessage(''), 5000)
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')))
    fetchChats()
  }, [fetchAgain])

  const getUnreadCount = (chatId) =>
    notification.filter((n) => n.chat?._id === chatId).length

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir="column"
      w={{ base: '100%', md: '360px' }}
      minW={{ md: '360px' }}
      h="100%"
      bg="white"
      borderRadius={{ base: 0, md: '2xl' }}
      boxShadow={{ base: 'none', md: '0 4px 24px rgba(0, 0, 0, 0.06)' }}
      borderWidth={{ base: 0, md: '1px' }}
      borderColor="gray.100"
      overflow="hidden"
    >
      <Flex
        px={5}
        py={4}
        align="center"
        justify="space-between"
        borderBottomWidth="1px"
        borderColor="gray.100"
        flexShrink={0}
        bg="white"
      >
        <HStack gap={2.5}>
          <Flex
            w="36px"
            h="36px"
            borderRadius="xl"
            bg="blue.50"
            align="center"
            justify="center"
          >
            <Icon as={HiOutlineChatBubbleLeftRight} boxSize={5} color="blue.500" />
          </Flex>
          <Box>
            <Text fontSize="md" fontWeight="bold" color="gray.800" letterSpacing="-0.02em">
              Conversații
            </Text>
            <Text fontSize="xs" color="gray.400">
              {chatState?.length ? `${chatState.length} active` : 'Nicio conversație'}
            </Text>
          </Box>
        </HStack>
        <GroupChatModal>
          <Button
            size="sm"
            colorPalette="blue"
            borderRadius="xl"
            fontWeight="semibold"
            gap={1.5}
            px={3}
            bg="blue.50"
            color="blue.600"
            _hover={{ bg: 'blue.100' }}
          >
            <FaPlus size={11} />
            Grup nou
          </Button>
        </GroupChatModal>
      </Flex>

      <Box flex={1} overflowY="auto" px={3} py={3}>
        {chatState ? (
          chatState.length > 0 ? (
            <VStack gap={1.5} align="stretch" w="100%">
              {chatState.map((chat) => {
                const isSelected = selectedChat?._id === chat._id
                const unreadCount = getUnreadCount(chat._id)
                const chatName = getChatName(chat, loggedUser)
                const avatarSrc = getChatAvatar(chat, loggedUser)

                return (
                  <Flex
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    cursor="pointer"
                    align="center"
                    gap={3}
                    px={3}
                    py={3}
                    borderRadius="xl"
                    bg={isSelected ? 'blue.50' : 'transparent'}
                    borderWidth="1px"
                    borderColor={isSelected ? 'blue.100' : 'transparent'}
                    _hover={{
                      bg: isSelected ? 'blue.50' : 'gray.50',
                      borderColor: isSelected ? 'blue.100' : 'gray.100',
                    }}
                    transition="all 0.18s ease"
                  >
                    <Box position="relative" flexShrink={0}>
                      {chat.isGroupChat ? (
                        <Flex
                          w="48px"
                          h="48px"
                          borderRadius="full"
                          bg="purple.50"
                          borderWidth="2px"
                          borderColor="purple.100"
                          align="center"
                          justify="center"
                        >
                          <Icon as={FaUsers} color="purple.500" boxSize={4} />
                        </Flex>
                      ) : (
                        <Avatar.Root size="md">
                          <Avatar.Fallback name={chatName} />
                          <Avatar.Image src={avatarSrc} />
                        </Avatar.Root>
                      )}
                      {!chat.isGroupChat && (
                        <Box
                          position="absolute"
                          bottom="1px"
                          right="1px"
                          w="12px"
                          h="12px"
                          borderRadius="full"
                          bg="green.400"
                          border="2px solid white"
                        />
                      )}
                    </Box>

                    <Box flex={1} minW={0}>
                      <Flex justify="space-between" align="center" mb={0.5}>
                        <Text
                          fontWeight={unreadCount > 0 ? 'bold' : 'semibold'}
                          fontSize="sm"
                          color={isSelected ? 'blue.700' : 'gray.800'}
                          truncate
                        >
                          {chatName}
                        </Text>
                        {chat.latestMessage?.createdAt && (
                          <Text
                            fontSize="xs"
                            color={unreadCount > 0 ? 'blue.500' : 'gray.400'}
                            fontWeight={unreadCount > 0 ? 'semibold' : 'normal'}
                            flexShrink={0}
                            ml={2}
                          >
                            {formatChatTime(chat.latestMessage.createdAt)}
                          </Text>
                        )}
                      </Flex>
                      {chat.latestMessage ? (
                        <Text fontSize="xs" color="gray.500" truncate>
                          {chat.isGroupChat && (
                            <Text as="span" fontWeight="medium" color="gray.600">
                              {chat.latestMessage.sender?.name}:{' '}
                            </Text>
                          )}
                          {chat.latestMessage.content}
                        </Text>
                      ) : (
                        <Text fontSize="xs" color="gray.400" fontStyle="italic">
                          Nicio conversație încă
                        </Text>
                      )}
                    </Box>

                    {unreadCount > 0 && (
                      <Badge
                        colorPalette="blue"
                        borderRadius="full"
                        minW="22px"
                        h="22px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="xs"
                        fontWeight="bold"
                        flexShrink={0}
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Flex>
                )
              })}
            </VStack>
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              h="100%"
              color="gray.400"
              gap={3}
              py={12}
            >
              <Flex
                w="64px"
                h="64px"
                borderRadius="2xl"
                bg="gray.50"
                align="center"
                justify="center"
              >
                <Icon as={HiOutlineChatBubbleLeftRight} boxSize={8} opacity={0.35} />
              </Flex>
              <Text fontSize="sm" fontWeight="medium" color="gray.500">
                Nicio conversație
              </Text>
              <Text fontSize="xs" color="gray.400" textAlign="center" px={6}>
                Creează un grup nou sau caută un utilizator pentru a începe
              </Text>
            </Flex>
          )
        ) : (
          <ChatLoading />
        )}
      </Box>

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
          mx={3}
          mb={3}
          borderRadius="xl"
          fontSize="sm"
        >
          {message}
        </Flex>
      )}
    </Box>
  )
}

export default MyChats
