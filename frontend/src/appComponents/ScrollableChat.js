import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import {
    isSameSender,
    isLastMessage,
    isSameSenderMargin,
    isSameUser
} from '../config/ChatLogic'
import { Tooltip } from "../components/ui/tooltip"
import { Avatar } from '@chakra-ui/react';
import { ChatState } from '../context/chatProvider';

const ScrollableChat = ({messages}) => {

    const { user } = ChatState();
  return (
    <ScrollableFeed>
         {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip content={m.sender.name} placement="bottom" hasArrow>
                <Avatar.Root
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer">
                    <Avatar.Fallback name={m.sender.name} />
                    <Avatar.Image src={m.sender.pic} />
                </Avatar.Root>
              </Tooltip>
            )}
            <span
              style={{
                color: "black",
                backgroundColor: `${
                  m.sender._id === user._id ? "#63B3ED" : "#38A169"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
            </div>
        ))}
      
    </ScrollableFeed>
  )
}

export default ScrollableChat
