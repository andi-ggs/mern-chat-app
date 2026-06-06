import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import {
  isSameSender,
  isLastMessage,
  isSameUser,
} from '../config/ChatLogic'
import { Tooltip } from '../components/ui/tooltip'
import { Avatar, Box, Flex, Text } from '@chakra-ui/react'
import { ChatState } from '../context/chatProvider'

const getBubbleRadius = (isOwn, isGroupedWithPrev, isGroupedWithNext) => {
  if (isOwn) {
    if (isGroupedWithPrev && isGroupedWithNext) return '6px 18px 6px 18px'
    if (isGroupedWithPrev) return '6px 18px 18px 18px'
    if (isGroupedWithNext) return '18px 18px 6px 18px'
    return '18px 18px 4px 18px'
  }
  if (isGroupedWithPrev && isGroupedWithNext) return '18px 6px 18px 6px'
  if (isGroupedWithPrev) return '18px 6px 18px 18px'
  if (isGroupedWithNext) return '18px 18px 18px 6px'
  return '18px 18px 18px 4px'
}

const formatMessageTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleTimeString('ro-RO', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState()

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => {
          const isOwn = m.sender._id === user._id
          const showAvatar =
            !isOwn &&
            (isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id))
          const groupedWithPrev = isSameUser(messages, m, i)
          const groupedWithNext =
            i < messages.length - 1 && messages[i + 1].sender._id === m.sender._id

          return (
            <Flex
              key={m._id}
              w="100%"
              justify={isOwn ? 'flex-end' : 'flex-start'}
              align="flex-end"
              gap={2}
              px={2}
              mb={groupedWithNext ? 1 : 3}
              mt={groupedWithPrev ? 0 : 1}
            >
              {!isOwn && (
                <Box w="32px" flexShrink={0}>
                  {showAvatar ? (
                    <Tooltip content={m.sender.name} placement="bottom" hasArrow>
                      <Avatar.Root size="sm" cursor="pointer">
                        <Avatar.Fallback name={m.sender.name} />
                        <Avatar.Image src={m.sender.pic} />
                      </Avatar.Root>
                    </Tooltip>
                  ) : null}
                </Box>
              )}

              <Box maxW={{ base: '82%', md: '65%' }} position="relative">
                <Box
                  px={4}
                  py={2}
                  bg={isOwn ? '#0084ff' : '#f0f0f0'}
                  color={isOwn ? 'white' : 'gray.800'}
                  borderRadius={getBubbleRadius(isOwn, groupedWithPrev, groupedWithNext)}
                  boxShadow={isOwn ? '0 1px 2px rgba(0,132,255,0.25)' : '0 1px 2px rgba(0,0,0,0.06)'}
                  wordBreak="break-word"
                >
                  <Text fontSize="sm" lineHeight="1.5">
                    {m.content}
                  </Text>
                </Box>
                {!groupedWithNext && m.createdAt && (
                  <Text
                    fontSize="10px"
                    color="gray.400"
                    mt={1}
                    textAlign={isOwn ? 'right' : 'left'}
                    px={1}
                  >
                    {formatMessageTime(m.createdAt)}
                  </Text>
                )}
              </Box>
            </Flex>
          )
        })}
    </ScrollableFeed>
  )
}

export default ScrollableChat
