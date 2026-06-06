import React, { useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { ChatState } from '../context/chatProvider'
import { NAVBAR_HEIGHT } from '../appComponents/mischellaneous/SideDrawer'
import MyChats from '../appComponents/mischellaneous/MyChats'
import ChatBox from '../appComponents/mischellaneous/ChatBox'

const ChatPage = () => {
  const { user } = ChatState()
  const [fetchAgain, setFetchAgain] = useState(false)

  if (!user) {
    return <div>No user data available</div>
  }

  return (
    <Box w="100%" minH={`calc(100vh - ${NAVBAR_HEIGHT}px)`} bg="#eef0f3">
      <Flex
        h={`calc(100vh - ${NAVBAR_HEIGHT}px)`}
        maxW="1440px"
        mx="auto"
        px={{ base: 0, md: 5 }}
        pb={{ base: 0, md: 4 }}
        pt={{ base: 0, md: 1 }}
        gap={{ base: 0, md: 4 }}
        overflow="hidden"
      >
        <MyChats fetchAgain={fetchAgain} />
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Flex>
    </Box>
  )
}

export default ChatPage
