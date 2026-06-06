import React from 'react';
import { Box, Text } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";

const UserListItem = ({user, handleFunction}) => {

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar.Root>
        <Avatar.Fallback name={user.name} />
        <Avatar.Image 
          src={user.pic} 
          alt={user.name} 
          boxSize="50px"
        />
      </Avatar.Root>
      <Box ml={3}>
        <Text fontWeight="bold">{user.name} - {user.occupation}</Text>
        <Text fontSize="xs" color="gray.500">
          <b>Email: </b>{user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
