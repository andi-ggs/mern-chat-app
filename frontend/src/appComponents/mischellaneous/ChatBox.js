import React from 'react'
import { ChatState } from '../../context/chatProvider'
import { Box } from '@chakra-ui/react'
import SingleChat from '../SingleChat'

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState()

  return (
    <Box
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      flexDir="column"
      flex={1}
      h="100%"
      bg="white"
      borderRadius={{ base: 0, md: '2xl' }}
      boxShadow={{ base: 'none', md: '0 4px 24px rgba(0, 0, 0, 0.06)' }}
      borderWidth={{ base: 0, md: '1px' }}
      borderColor="gray.100"
      overflow="hidden"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox
