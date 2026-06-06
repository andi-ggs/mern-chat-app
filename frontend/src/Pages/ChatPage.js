import React, { useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { ChatState } from '../context/chatProvider'
import SideDrawer from '../appComponents/mischellaneous/SideDrawer';
import MyChats from '../appComponents/mischellaneous/MyChats';
import ChatBox from '../appComponents/mischellaneous/ChatBox';


const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  if (!user) {
    return <div>No user data available</div>;
  }   
  return (
    <div style={{width: "100%"}}>
      {user && <SideDrawer/>}
      <Box
      display="flex"
      justifyContent="space-between"
      w="100%"
      h="91.5vh"
      p="10px">
        {user && (
          <MyChats  fetchAgain={fetchAgain}/>)}
        {user && (
          <ChatBox  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>)}
      </Box>
    </div>
  )
};

export default ChatPage
