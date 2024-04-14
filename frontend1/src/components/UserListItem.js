import React from 'react'
import { Box, Text } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";

const UserListItem = ({User,handleFunction}) => {
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
      d="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={User.name}
        src={User.pic}
      />
      <Box>
        <Text>{User.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {User.email}
        </Text>
      </Box>
    </Box>
  )
}

export default UserListItem
