import React, { useEffect, useState, useRef } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  Button,
  FormControl,
  useToast,
  Input,
  Spinner,
  InputGroup,
  Box,
  InputRightElement,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import MessageItem from "./MessageItem";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animation/Animation.json";
const ENDPOINT = "https://chatbuddy-4.onrender.com";

var socket, selectedChatCompare;

const MessageContainer = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState("");
  const [newmessage, setnewMessage] = useState("");
  const [loading, setloading] = useState(false);
  const { user, selectedChat, Notification, setNotification } = ChatState();
  const toast = useToast();
  const [socketConnected, setsocketConnected] = useState(false);
  const [Typing, setTyping] = useState(false);
  const [IsTyping, setIsTyping] = useState(false);

  const hiddenFileInput = useRef(null);
  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileTobase(file);
    console.log(file);
  };
  const setFileTobase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user.user);
    socket.on("connected", () => setsocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop-typing", () => setIsTyping(false));
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setloading(true);

      const config1 = {
        headers: {
          Authorization: `Bearer ${user.auhToken}`,
        },
      };
      const { data } = await axios.get(
        `https://chatbuddy-4.onrender.com/api/message/${selectedChat._id}`,
        config1
      );

      setMessages(data);
      console.log(data);
      setnewMessage("");
      setloading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: "failed to load all chats",
        status: "error",
        duration: 2000,
        position: "bottom",
      });
      setloading(false);
    }
  };

  const SendMessage = async () => {
    if (newmessage) {
      socket.emit("stop-typing", selectedChat._id);

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.auhToken}`,
          },
        };
        const { data } = await axios.post(
          `https://chatbuddy-4.onrender.com/api/message`,
          {
            chatId: selectedChat._id,
            content: newmessage,
            image: image,
          },
          config
        );
        setMessages([...messages, data]);
        setnewMessage("");
        setImage("");
        socket.emit("new message", data);
      } catch (error) {
        toast({
          title: "Failed to send the message!",
          description: error.response.data,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      //chking that if no chat is selcted and selected chat and newmessage of a chat are not same then we show notifications
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.Chat._id
      ) {
        //showing notification
        if (!Notification.includes(newMessageReceived)) {
          newMessageReceived.senderName = user.user.name;
          setNotification([newMessageReceived, ...Notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const typingHandler = (e) => {
    setnewMessage(e.target.value);

    if (!socketConnected) return;

    if (!Typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && Typing) {
        socket.emit("stop-typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  //for running submitHandler through Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      SendMessage();
    }
  };

  return (
    <>
      <Box overflowY="scroll" p="1rem" pt="5rem" mb="12vh">
        <ScrollableFeed className="my-scrollable-feed">
          {loading ? (
            <Spinner alignSelf="Center" size="xl" />
          ) : (
            <MessageItem messages={messages} />
          )}
          {IsTyping ? (
            <div
              style={{
                marginBottom: 15,
                marginLeft: 0,
                width: "70px",
              }}
            >
              {" "}
              <Lottie options={defaultOptions} width={70} /> Typing....
            </div>
          ) : null}
        </ScrollableFeed>
      </Box>
      <Box
        w="100%"
        h="100px"
        bgColor="transparent"
        gap="1rem"
        display="flex"
        justifyContent="center"
        position={"absolute"}
        bottom={0}
      >
        <InputGroup w="60%" h="100%" mt="1rem" gap="1rem" display="flex">
          <Input
            w="100%"
            h="60%"
            bgColor="#edede9"
            type="text"
            placeholder="Enter the message......."
            value={newmessage}
            onChange={typingHandler}
            onKeyDown={handleKeyPress}
          />
          <InputRightElement width="4.5rem" alignSelf="center" h="60%">
            <Button
              h="3rem"
              w="3rem"
              bgColor={"transparent"}
              borderRadius="50%"
              onClick={handleClick}
            >
              <i style={{ fontSize: "30px" }} class="fas fa-paperclip"></i>
            </Button>
            <Input
              ref={hiddenFileInput}
              accept="image/*"
              onChange={handleImage}
              type="file"
              hidden
            />
          </InputRightElement>
        </InputGroup>
        <Button
          h="3.5rem"
          alignSelf={"center"}
          _hover={{ bg: "#48cae4" }}
          bgColor="#0096c7"
          display={"flex"}
          gap={"1rem"}
          color={"white"}
          fontSize={"20px"}
          onClick={() => {
            SendMessage();
          }}
        >
          <i style={{ color: "white" }} class="fas fa-paper-plane"></i>
          send
        </Button>
      </Box>
    </>
  );
};

export default MessageContainer;
