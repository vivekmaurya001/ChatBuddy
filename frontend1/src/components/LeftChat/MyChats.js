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
import ChatTabs from "./ChatTabs";
import Updateprofile from "../sidebar/Updateprofile";

const MyChats = ({
  clicked,
  setClicked,
  switchTab,
  setSwitchTab,
  fetchAgain,
}) => {
  const toast = useToast();
  const [isLargerThan900] = useMediaQuery("(min-width: 900px)");
  const { theme } = ChatState();

  return (
    <Stack
      // bg="black"
      w={isLargerThan900 ? "31%" : switchTab ? "0%" : "100%"}
      p="0.8rem"
      gap="1rem"
      display={isLargerThan900 ? "flex" : switchTab ? "none" : "flex"}
      borderRight="2px solid grey"
      bg={theme ? "#212121" : "#f9f9f9"}
    >
      {clicked == "Messages" && (
        <ChatTabs
          fetchAgain={fetchAgain}
          setSwitchTab={setSwitchTab}
          switchTab={switchTab}
          clicked={clicked}
          setClicked={setClicked}
        />
      )}
      {clicked == "Updateprofile" && (
        <Updateprofile clicked={clicked} setClicked={setClicked} />
      )}
    </Stack>
  );
};

export default MyChats;
