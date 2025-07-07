import {
  Box,
  Text,
  Button,
  Stack,
  Flex,
  useMediaQuery,
  Image,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { ArrowRightIcon } from "@chakra-ui/icons";
import SideTabs from "../sidebar/SideTabs";
import SearchDrawer from "../micelenous/SearchDrawer";
import { Avatar } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

const getSender = (loggedUser, users) =>
  loggedUser._id === users[0]._id ? users[1] : users[0];

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  return `${month} ${day} at ${hours % 12 || 12}:${minutes} ${period}`;
};

const PORT = process.env.REACT_APP_BACKEND_URL;

const ChatTabs = ({
  fetchAgain,
  setSwitchTab,
  switchTab,
  clicked,
  setClicked,
  setFetchAgain,
}) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    theme,
    setTheme,
  } = ChatState();

  const [isLargerThan900] = useMediaQuery("(min-width: 900px)");
  const toast = useToast();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.auhToken}`,
          },
        };
        const { data } = await axios.get(`${PORT}/api/chat`, config);
        setChats(data);
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to load the chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };

    fetchChats();
  }, [fetchAgain, user.auhToken, setChats, toast]);

  const handleTabChange = () => {
    if (selectedChat) setSwitchTab(!switchTab);
  };

  return (
    <>
      {/* Top Bar */}
      <Flex w="100%" justify="space-between" align="center" fontSize={{ base: "28px", md: "30px" }}>
        <SideTabs clicked={clicked} setClicked={setClicked} theme={theme} setTheme={setTheme} />
        <Flex gap="1rem">
          <SearchDrawer />
          {!isLargerThan900 && (
            <Button onClick={handleTabChange}>
              <ArrowRightIcon />
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Chat List */}
      <Stack
        spacing={2}
        align="stretch"
        bg="transparent"
        w="100%"
        h="89%"
        borderRadius="10px"
        p="10px"
        overflowY="scroll"
      >
        {chats.map((chat, i) => {
          const isSelected = selectedChat === chat;
          const isGroup = chat.isGroupChat;
          const sender = isGroup ? null : getSender(user.user, chat.users);

          return (
            <Box
              key={i}
              w="100%"
              minH="60px"
              p="0.2rem 6px"
              borderRadius="7px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              cursor="pointer"
              bg={isSelected ? "#90e0ef" : theme ? "transparent" : "#E8E8E8"}
              color={isSelected ? "white" : theme ? "white" : "black"}
              _hover={{ bg: theme ? "#2b2b2b" : "#f3f3f4" }}
              onClick={() => setSelectedChat(chat)}
            >
              {/* Left: Avatar + Chat Info */}
              <Flex gap="1rem">
              <Avatar
                  boxSize="55px"
                  name={isGroup ? chat.name : sender.name}
                  src={isGroup ? chat.pic : sender.pic}
                  icon={<InfoIcon />} 
                />
                <Flex direction="column">
                  <Text as="b" color="#0077b6">
                    {isGroup ? chat.chatName : sender.name}
                  </Text>
                  <Text fontSize="xs">
                    {chat.latestMessage ? (
                      <>
                        <b>{chat.latestMessage.sender.name}:</b>{" "}
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.slice(0, 51) + "..."
                          : chat.latestMessage.content}
                      </>
                    ) : (
                      "New Chat Created"
                    )}
                  </Text>
                </Flex>
              </Flex>

              {/* Right: Timestamp */}
              <Text fontSize="xs" alignSelf="flex-end">
                {formatDate(chat.latestMessage?.createdAt || chat.createdAt)}
              </Text>
            </Box>
          );
        })}
      </Stack>
    </>
  );
};

export default ChatTabs;
