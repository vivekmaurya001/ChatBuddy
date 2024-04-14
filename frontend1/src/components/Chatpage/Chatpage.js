import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import Navbar from "../micelenous/Navbar";
import MyChats from "../LeftChat/MyChats";
import ChatBox from "../RightPage/ChatBox";
import { Box, useMediaQuery } from "@chakra-ui/react";

const Chatpage = () => {
  const { user, selectedChat } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  //considering false for mychats
  const [clicked, setClicked] = useState("Messages");
  const [switchTab, setSwitchTab] = useState(false);
  const [isLargerThan800] = useMediaQuery("(min-width: 900px)");

  return (
    <Box w="100%" h="100vh" overflowX="hidden" overflowY="hidden">
      {user && (
        <Box h="100vh" w="100%" display="flex" justifyContent="space-around">
          {user && (
            <MyChats
              fetchAgain={fetchAgain}
              switchTab={switchTab}
              setSwitchTab={setSwitchTab}
              setFetchAgain={setFetchAgain}
              clicked={clicked}
              setClicked={setClicked}
            />
          )}
          {user && (
            <ChatBox
              fetchAgain={fetchAgain}
              switchTab={switchTab}
              setSwitchTab={setSwitchTab}
              setFetchAgain={setFetchAgain}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default Chatpage;
