import React, { useEffect, useState, useRef } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  Box,
  Button,
  Input,
  Spinner,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animation/Animation.json";
import MessageItem from "./MessageItem";

const ENDPOINT = process.env.REACT_APP_BACKEND_URL;
let socket, selectedChatIdCompare;

const MessageContainer = ({ fetchAgain, setFetchAgain }) => {
  const toast = useToast();
  const { user, selectedChat, Notification, setNotification } = ChatState();

  const [state, setState] = useState({
    messages: [],
    text: "",
    imgData: "",
    loading: false,
    socketConnected: false,
    isTyping: false
  });

  const hiddenFileInput = useRef();

  const defaultLottie = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user.user);
    socket.on("connected", () => setState(s => ({ ...s, socketConnected: true })));
    socket.on("typing", () => setState(s => ({ ...s, isTyping: true })));
    socket.on("stop-typing", () => setState(s => ({ ...s, isTyping: false })));
    socket.on("message received", handleIncomingMessage);
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      selectedChatIdCompare = selectedChat._id;
    }
  }, [selectedChat]);

  async function fetchMessages() {
    setState(s => ({ ...s, loading: true }));
    try {
      const { data } = await axios.get(
        `${ENDPOINT}/api/message/${selectedChat._id}`,
        { headers: { Authorization: `Bearer ${user.auhToken}` } }
      );
      setState(s => ({ ...s, messages: data, text: "", loading: false }));
      socket.emit("join chat", selectedChat._id);
    } catch {
      toast({ title: "Error loading messages", status: "error", duration: 2000, position: "bottom" });
      setState(s => ({ ...s, loading: false }));
    }
  }

  function handleIncomingMessage(newMsg) {
    if (!selectedChatIdCompare || selectedChatIdCompare !== newMsg.Chat._id) {
      if (!Notification.some(n => n._id === newMsg._id)) {
        setNotification([newMsg, ...Notification]);
        setFetchAgain(!fetchAgain);
      }
    } else {
      setState(s => ({ ...s, messages: [...s.messages, newMsg] }));
    }
  }

  function handleTyping(e) {
    const text = e.target.value;
    setState(s => ({ ...s, text }));
    if (!state.socketConnected) return;

    if (!state.isTyping) {
      socket.emit("typing", selectedChat._id);
      setState(s => ({ ...s, isTyping: true }));
    }
    debounceStopTyping();
  }

  let typingTimeout;
  function debounceStopTyping() {
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stop-typing", selectedChat._id);
      setState(s => ({ ...s, isTyping: false }));
    }, 3000);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") sendMessage();
  }

  async function sendMessage() {
    const { text, imgData } = state;
    if (!text) return;

    socket.emit("stop-typing", selectedChat._id);
    try {
      const { data } = await axios.post(
        `${ENDPOINT}/api/message`,
        { chatId: selectedChat._id, content: text, image: imgData },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.auhToken}` } }
      );
      setState(s => ({ ...s, messages: [...s.messages, data], text: "", imgData: "" }));
      socket.emit("new message", data);
    } catch (error) {
      toast({ title: "Send failed", description: error.response?.data, status: "error", duration: 5000, position: "bottom" });
    }
  }

  function handleImageSelection(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setState(s => ({ ...s, imgData: reader.result }));
    reader.readAsDataURL(file);
  }

  function triggerFilePicker() {
    hiddenFileInput.current.click();
  }

  const { messages, loading, isTyping, text } = state;

  return (
    <>
      <Box p="1rem" pt="5rem" mb="12vh" overflowY="auto">
        <ScrollableFeed>
          {loading ? <Spinner size="xl" alignSelf="center" /> : <MessageItem messages={messages} />}
          {isTyping && <Box mb="15px"><Lottie options={defaultLottie} width={70} />Typing...</Box>}
        </ScrollableFeed>
      </Box>

      <Box position="absolute" bottom={0} display="flex" w="100%" gap={2} p={4} bg="white">
        <InputGroup flex="1">
          <Input
            value={text}
            placeholder="Enter message..."
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            bg="#edede9"
          />
          <InputRightElement width="4.5rem">
            <Button size="sm" onClick={triggerFilePicker}>📎</Button>
            <Input type="file" hidden ref={hiddenFileInput} accept="image/*" onChange={handleImageSelection} />
          </InputRightElement>
        </InputGroup>
        <Button colorScheme="blue" onClick={sendMessage}>Send</Button>
      </Box>
    </>
  );
};

export default MessageContainer;
