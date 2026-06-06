import React from 'react'
import { Badge } from "@chakra-ui/react";

const UserBadgeItem = ({user, handleFunction, admin }) => {
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      backgroundColor= {
        user.occupation === "student" ? "orange" :
        user.occupation === "teacher" ? "green" : "gray"
      }
      color="white"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      {admin && String(admin._id).trim() === String(user._id).trim() && <span> (Admin)</span>}
      <i class="fa-solid fa-xmark"></i>
    </Badge>
  );
};

export default UserBadgeItem
