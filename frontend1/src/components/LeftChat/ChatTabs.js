import {
  Box,
  Text,
  Button,
  Stack,
  Flex,
  useMediaQuery,
  Image,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import GroupChatModal from "../micelenous/GroupChatModal";
import { HamburgerIcon, ArrowRightIcon } from "@chakra-ui/icons";
import SideTabs from "../sidebar/SideTabs";
import SearchDrawer from "../micelenous/SearchDrawer";

const ChatTabs = ({
  fetchAgain,
  setSwitchTab,
  switchTab,
  clicked,
  setClicked,
  setFetchAgain,
}) => {
  const toast = useToast();
  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    theme,
    setTheme,
  } = ChatState();
  const [loggedUser, setLoggedUser] = useState(user.user);
  const [isLargerThan900] = useMediaQuery("(min-width: 900px)");

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.auhToken}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      console.log("hi", data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const getsender = (loggedUser, Userarray) => {
    if (loggedUser._id === Userarray[0]._id) return Userarray[1];
    else return Userarray[0];
  };
  const tabChange = () => {
    if (selectedChat) setSwitchTab(!switchTab);
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
    const formattedDate = `${month} ${day} at ${hours % 12 || 12}:${minutes
      .toString()
      .padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
    return formattedDate;
  }
  // when the name updated we have to render chats again
  useEffect(() => {
    // setLoggedUser(data1.user);
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <>
      <Box
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        fontSize={{ base: "28px", md: "30px" }}
      >
        <SideTabs
          clicked={clicked}
          setClicked={setClicked}
          theme={theme}
          setTheme={setTheme}
        />
        <Flex gap="1rem">
          <SearchDrawer />
          {/* <GroupChatModal /> */}
          {isLargerThan900 ? null : (
            <Button onClick={tabChange}>
              {" "}
              <ArrowRightIcon />
            </Button>
          )}
        </Flex>
      </Box>
      <Stack
        spacing={2}
        align="stretch"
        //
        // bgColor={theme ? "black" : "#f9f9f9"}
        bg="transparent"
        w="100%"
        h="89%"
        borderRadius="10px"
        p="10px"
        overflowY="scroll"
      >
        {chats.map((chat, i) => {
          return (
            <Box
              key={i}
              w="100%"
              minH="60px"
              borderRadius="7px"
              p="0.2rem 6px"
              bgColor="#bfb8b8"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              onClick={() => setSelectedChat(chat)}
              cursor="pointer"
              _hover={{ bgColor: theme ? "#2b2b2b" : "#f3f3f4" }}
              bg={
                selectedChat === chat
                  ? "#90e0ef"
                  : theme
                  ? "transparent"
                  : "#E8E8E8"
              }
              color={
                selectedChat === chat ? "white" : theme ? "white" : "black"
              }
            >
              <Flex gap="1rem">
                <Image
                  borderRadius="full"
                  boxSize="55px"
                  src={
                    !chat.isGroupChat
                      ? getsender(loggedUser, chat.users).pic
                      : chat.pic
                  }
                  alt="Dan Abramov"
                />
                <Flex flexDirection="column">
                  <Text as="b" color="#0077b6">
                    {!chat.isGroupChat
                      ? getsender(loggedUser, chat.users).name
                      : chat.chatName}
                  </Text>
                  <Flex>
                    {chat.latestMessage ? (
                      <Text fontSize="xs">
                        <b>{chat.latestMessage.sender.name} : </b>
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </Text>
                    ) : (
                      "New Chat Created"
                    )}
                  </Flex>
                </Flex>
              </Flex>
              <Text fontSize="xs" alignSelf="flex-end">
                {chat.latestMessage
                  ? formatDate(chat.latestMessage.createdAt)
                  : formatDate(chat.createdAt)}
              </Text>
            </Box>
          );
        })}
      </Stack>
    </>
  );
};

export default ChatTabs;
