import React, { useState, useEffect } from "react";
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

const SearchDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const [search, Setsearch] = useState("");
  const [searchResults, SetsearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const toast = useToast();
  const { user, chats, setChats, setSelectedChat, theme } = ChatState();

  //for searching a user in db through a keyword in email or name
  const submitHandler = async () => {
    if (!search) {
      toast({
        title: "Please enter Something in search",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.auhToken}`,
        },
      };

      const { data } = await axios.get(`https://chatbuddy-4.onrender.com/api/user?search=${search}`, config);
      setLoading(false);
      SetsearchResults(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };
  //for running submitHandler through Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submitHandler();
    }
  };
  //for creating one to one chat
  const accessChat = async (id) => {
    console.log(id);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.auhToken}`,
        },
      };
      const { data } = await axios.post(`https://chatbuddy-4.onrender.com/api/chat`, { userId: id }, config);
      console.log(data);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    if (!search) SetsearchResults([]);
  }, [search]);
  return (
    <>
      <Tooltip bg="gray.300" hasArrow label="Search User" color="black">
        <Button
          bg={theme ? "#181818" : null}
          color={theme ? "gray.300" : "black"}
          // minW="20vw"
          gap="0.7rem"
          ref={btnRef}
          onClick={onOpen}
        >
          <SearchIcon />
          <Text>Search User</Text>
        </Button>
      </Tooltip>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        bg="black"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>
          <DrawerBody>
            <Box>
              <Input
                mb="1rem"
                type="search"
                placeholder="Search here..."
                value={search}
                onChange={(e) => Setsearch(e.target.value)}
                onKeyUp={handleKeyPress}
              />
            </Box>
            <Stack spacing={2}>
              {loading ? (
                <Stack>
                  <Skeleton height="45px" />
                  <Skeleton height="45px" />
                  <Skeleton height="45px" />
                  <Skeleton height="45px" />
                  <Skeleton height="45px" />
                  <Skeleton height="45px" />
                </Stack>
              ) : (
                searchResults?.slice(0, 9).map((User, i) => {
                  return (
                    <UserListItem
                      key={i}
                      User={User}
                      handleFunction={() => accessChat(User._id)}
                    />
                  );
                })
              )}
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                SetsearchResults([]);
                Setsearch("");
              }}
            >
              Clear
            </Button>
            <Button colorScheme="blue" onClick={submitHandler}>
              Search
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SearchDrawer;
