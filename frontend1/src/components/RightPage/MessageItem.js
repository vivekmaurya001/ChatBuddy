import React from "react";
import { Box, Text, Tooltip, Avatar, Image } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";

const MessageItem = ({ messages }) => {
  const { user, selectedChat } = ChatState();

  // chat logic functions
  const isSameSender = (Msgobj) => {
    if (user.user._id === Msgobj.sender) return true;
    else return false;
  };
  const getSender = (Id) => {
    const index = selectedChat.users.findIndex((user) => user._id === Id);
    if (index !== -1) {
      return selectedChat.users[index];
    } else return "User Left";
  };
  const isLastMessage = (i) => {
    if (i === messages.length - 1) {
      return true;
    } else if (messages[i].sender === messages[i + 1].sender) {
      return false;
    } else {
      return true;
    }
  };
  function formatDate(isoString) {
    // Parse the ISO 8601 string into a Date object
    const date = new Date(isoString);

    // Get the month, day, hours, and minutes
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Format the result
    const formattedDate = `${hours % 12 || 12}:${minutes
      .toString()
      .padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
    return formattedDate;
  }

  return (
    <>
      {messages &&
        messages?.map((MsgObj, i) => {
          return (
            <Box
              key={i}
              maxWidth="30%"
              bgColor={isSameSender(MsgObj) ? "transparent" : "transparent"}
              alignSelf={isSameSender(MsgObj) ? "flex-end" : null}
              borderRadius="12px"
            >
              <Box
                w="100%"
                minHeight="50px"
                p="5px 1rem"
                color="white"
                borderRadius="8px"
                bgColor={isSameSender(MsgObj) ? "#38B2AC" : "#48BB78"}
              >
                {MsgObj.image ? (
                  <Image
                    boxSize="100px"
                    objectFit="cover"
                    src={MsgObj.image}
                    alt="Dan Abramov"
                  />
                ) : null}
                <Text>{MsgObj.content}</Text>
                <Text fontSize={10} color={"black"}>
                  {formatDate(MsgObj.createdAt)}
                </Text>
              </Box>
              {isLastMessage(i) ? (
                <Tooltip
                  label={getSender(MsgObj.sender).name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={MsgObj.sender.name}
                    src={getSender(MsgObj.sender).pic}
                  />
                </Tooltip>
              ) : null}
            </Box>
          );
        })}
    </>
  );
};

export default MessageItem;
