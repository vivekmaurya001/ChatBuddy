import React from "react";
import { Box, Text, Tooltip, Avatar, Image } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";

const MessageItem = ({ messages }) => {
  const { user, selectedChat } = ChatState();

  const isSender = (msg) => user.user._id === msg.sender;
  const getSender = (id) => selectedChat.users.find((u) => u._id === id) || { name: "User Left" };

  const isLastMessage = (i) =>
    i === messages.length - 1 || messages[i].sender !== messages[i + 1]?.sender;

  const formatDate = (iso) => {
    const d = new Date(iso);
    const h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, "0");
    return `${h % 12 || 12}:${m} ${h >= 12 ? "PM" : "AM"}`;
  };

  return messages?.map((msg, i) => {
    const sender = getSender(msg.sender);
    const own = isSender(msg);
    const showAvatar = isLastMessage(i);

    return (
      <Box
        key={i}
        maxW="30%"
        alignSelf={own ? "flex-end" : "flex-start"}
        borderRadius="12px"
      >
        <Box
          p="5px 1rem"
          color="white"
          borderRadius="8px"
          bgColor={own ? "#38B2AC" : "#48BB78"}
        >
          {msg.image && (
            <Image
              boxSize="100px"
              objectFit="cover"
              src={msg.image}
              alt="image"
              mb="4px"
            />
          )}
          <Text>{msg.content}</Text>
          <Text fontSize={10} color="black">
            {formatDate(msg.createdAt)}
          </Text>
        </Box>

        {showAvatar && (
          <Tooltip label={sender.name} placement="bottom-start" hasArrow>
            <Avatar
              mt={1}
              size="sm"
              cursor="pointer"
              name={sender.name}
              src={sender.pic || ""}
            />
          </Tooltip>
        )}
      </Box>
    );
  });
};

export default MessageItem;
