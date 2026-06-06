import React, { useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { ChatState } from '../context/chatProvider'
import SideDrawer from '../appComponents/mischellaneous/SideDrawer'
import MyChats from '../appComponents/mischellaneous/MyChats'
import ChatBox from '../appComponents/mischellaneous/ChatBox'

const ChatPage = () => {
  const { user } = ChatState()
  const [fetchAgain, setFetchAgain] = useState(false)

  if (!user) {
    return <div>No user data available</div>
  }

  return (
    <Box w="100%" minH="100vh" bg="#f0f2f5">
      <SideDrawer />
      <Flex
        h="calc(100vh - 70px)"
        mt="70px"
        maxW="1600px"
        mx="auto"
        px={{ base: 0, md: 4 }}
        pb={{ base: 0, md: 3 }}
        gap={{ base: 0, md: 3 }}
        overflow="hidden"
      >
        <MyChats fetchAgain={fetchAgain} />
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Flex>
    </Box>
  )
}

export default ChatPage
