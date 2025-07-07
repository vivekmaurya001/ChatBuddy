import React, { useState, useEffect, useRef } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  Button,
  Text,
  Box,
  Tooltip,
  useToast,
  Stack,
  Skeleton,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserListItem";

const PORT = process.env.REACT_APP_BACKEND_URL;

const SearchDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const toast = useToast();
  const { user, chats, setChats, setSelectedChat, theme } = ChatState();

  const handleSearch = async () => {
    if (!search) {
      return toast({
        title: "Please enter something",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    }

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${PORT}/api/user?search=${search}`,
        {
          headers: { Authorization: `Bearer ${user.auhToken}` },
        }
      );
      setResults(data);
    } catch {
      toast({
        title: "Error fetching users",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccessChat = async (id) => {
    try {
      setLoadingChat(true);
      const { data } = await axios.post(
        `${PORT}/api/chat`,
        { userId: id },
        {
          headers: { Authorization: `Bearer ${user.auhToken}` },
        }
      );

      if (!chats.some((chat) => chat._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    if (!search) setResults([]);
  }, [search]);

  return (
    <>
      <Tooltip label="Search User" hasArrow bg="gray.300" color="black">
        <Button
          ref={btnRef}
          onClick={onOpen}
          gap="0.7rem"
          bg={theme ? "#181818" : undefined}
          color={theme ? "gray.300" : "black"}
        >
          <SearchIcon />
          <Text>Search User</Text>
        </Button>
      </Tooltip>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <Input
              mb="1rem"
              type="search"
              placeholder="Search here..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && handleSearch()}
            />

            <Stack spacing={2}>
              {loading ? (
                [...Array(6)].map((_, i) => <Skeleton key={i} height="45px" />)
              ) : (
                results.slice(0, 9).map((u) => (
                  <UserListItem
                    key={u._id}
                    User={u}
                    handleFunction={() => handleAccessChat(u._id)}
                  />
                ))
              )}
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                setSearch("");
                setResults([]);
              }}
            >
              Clear
            </Button>
            <Button colorScheme="blue" onClick={handleSearch} isLoading={loadingChat}>
              Search
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SearchDrawer;
