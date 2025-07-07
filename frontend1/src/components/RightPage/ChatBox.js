import {
  Box,
  Flex,
  Button,
  Text,
  useMediaQuery,
  Stack,
  Image,
  AvatarGroup,
  Avatar,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@chakra-ui/icons";
import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import UpdateGroupModal from "../micelenous/UpdateGroupModal";
import MessageContainer from "./MessageContainer";
import SelctedUserModal from "../micelenous/SelctedUserModal";

const ChatBox = ({ fetchAgain, setFetchAgain, switchTab, setSwitchTab }) => {
  const { user, selectedChat, theme } = ChatState();
  const [isLargerThan900] = useMediaQuery("(min-width: 900px)");

  const getsender = (Userarray) => {
    if (user.user._id === Userarray[0]._id) {
      return Userarray[1];
    } else return Userarray[0];
  };
  const getsender1 = (loggedUser, Userarray) => {
    if (loggedUser._id === Userarray[0]._id) return Userarray[1];
    else return Userarray[0];
  };
  const tabChange = () => {
    setSwitchTab(!switchTab);
  };
  return (
    <>
      {selectedChat ? (
        <Box
          bg="white"
          position={"relative"}
          w={isLargerThan900 ? "69%" : switchTab ? "100%" : "0%"}
          h="100%"
          display={isLargerThan900 ? "block" : switchTab ? "block" : "none"}
        >
          <Flex
            bg="transparent"
            justifyContent="space-between"
            backgroundColor={
              theme ? " rgba(74, 68, 68, 0.8)" : "rgba(243, 240, 240, 0.8)"
            }
            color={theme ? "white" : "black"}
            h="80px"
            w="100%"
            position={"absolute"}
            zIndex={100}
            backdropFilter="blur(6px)"
            top={0}
            borderBottom="1px solid grey"
            borderLeft="1px solid grey"
            px="1rem"
            alignItems="center"
          >
            {isLargerThan900 ? null : (
              <Button onClick={tabChange}>
                {" "}
                <ArrowLeftIcon />
              </Button>
            )}
            <Flex gap="0.6rem">
              {!selectedChat.isGroupChat ? (
                <Avatar
                  mb="4px"
                  size="md"
                  name={getsender1(user.user, selectedChat.users).name}
                  src={getsender1(user.user, selectedChat.users).pic}
                />
              ) : (
                <AvatarGroup size="sm" max={3}>
                  <Avatar
                    name=""
                    src={selectedChat.users[0].pic}
                  />
                  <Avatar
                    name=""
                    src={selectedChat.users[1].pic}
                  />
                  <Avatar
                    name=""
                    src={selectedChat.users[2].pic}
                  />
                </AvatarGroup>
              )}
              <Flex flexDirection="column">
                <Text fontSize="2xl">
                  {selectedChat.isGroupChat
                    ? selectedChat.chatName
                    : getsender(selectedChat.users).name}
                </Text>
                <Text fontSize="sm">
                  {selectedChat.isGroupChat
                    ? selectedChat.users.length + "  members"
                    : getsender(selectedChat.users).name}
                </Text>
              </Flex>
            </Flex>
            {selectedChat.isGroupChat ? (
              <UpdateGroupModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
              />
            ) : (
              <SelctedUserModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
              />
            )}
          </Flex>
          <Stack
            w="100%"
            h="100%"
            bgColor="#d8d6d6"
            borderLeft="1px solid grey"
            position="relative"
            backgroundImage={
              theme
                ? "https://wallpapercave.com/wp/wp6988787.png"
                : "url('https://wallpapercave.com/wp/wp5149772.jpg')"
            }
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            backgroundPosition="center"
          >
            <MessageContainer
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
            />
          </Stack>
        </Box>
      ) : (
        <Box
          backgroundImage="url('https://wallpapercave.com/wp/wp5149772.jpg')"
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          backgroundPosition="center"
          height="100%"
          w={isLargerThan900 ? "69%" : switchTab ? "100%" : "0%"}
          display={isLargerThan900 ? "flex" : switchTab ? "flex" : "none"}
          alignItems="center"
          flexDirection={"column"}
          justifyContent="center"
        >
          {" "}
          <Image
            objectFit="cover"
            h="200px"
            w="280px"
            src="images/Logo.png"
            alt="Logo"
          />
          <Text fontSize="4xl" color={"black"} fontWeight={600}>
            Welcome to ChatBuddy
          </Text>
        </Box>
      )}
    </>
  );
};

export default ChatBox;
