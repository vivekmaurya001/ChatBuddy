import React, { useState, useEffect } from "react";
import {
  Modal, ModalOverlay, InputRightElement, InputGroup,
  ModalContent, ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, FormControl, FormLabel, Input,
  Button, useDisclosure, Spinner, Tag, TagLabel,
  TagCloseButton, Box, Stack, Flex, useToast,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import UserListItem from "../UserListItem";

const PORT = process.env.REACT_APP_BACKEND_URL;

const UpdateGroupModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const config = {
    headers: { Authorization: `Bearer ${user?.auhToken}` },
  };

  const showToast = (title, status = "info", desc = "") => {
    toast({
      title, description: desc, status, duration: 2000, isClosable: true, position: "bottom"
    });
  };

  const handleSearch = async () => {
    if (!search) return showToast("Please enter something to search", "error");
    try {
      setLoading(true);
      const { data } = await axios.get(`${PORT}/api/user?search=${search}`, config);
      setSearchResults(data);
    } catch (err) {
      showToast("Search failed", "error", err.response?.data || "Try again");
    } finally {
      setLoading(false);
    }
  };

  const updateName = async () => {
    if (!newName) return showToast("Enter a new name", "error");
    try {
      setLoading(true);
      const { data } = await axios.put(`${PORT}/api/chat/rename`, {
        chatId: selectedChat._id,
        chatName: newName
      }, config);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      onClose();
      showToast("Group name updated", "success");
    } catch (err) {
      showToast("Update failed", "error", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const addToGroup = async (userId) => {
    if (selectedChat.users.some((u) => u._id === userId))
      return showToast("User already in group", "error");

    if (selectedChat.groupAdmin._id !== user.user._id)
      return showToast("Only admins can add users", "error");

    try {
      setLoading(true);
      const { data } = await axios.put(`${PORT}/api/chat/groupadd`, {
        chatId: selectedChat._id, userId
      }, config);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      onClose();
      showToast("User added", "success");
    } catch (err) {
      showToast("Failed to add member", "error", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (userId) => {
    if (user.user._id !== selectedChat.groupAdmin._id && user.user._id !== userId)
      return showToast("Only admins can remove users", "error");

    try {
      setLoading(true);
      const { data } = await axios.put(`${PORT}/api/chat/groupremove`, {
        chatId: selectedChat._id,
        userId
      }, config);
      userId === user.user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      onClose();
      showToast(userId === user.user._id ? "Left group" : "User removed", "success");
    } catch (err) {
      showToast("Failed to remove user", "error", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!search) setSearchResults([]);
  }, [search]);

  return (
    <>
      <Button onClick={onOpen} isDisabled={!selectedChat?.isGroupChat}>
        <ViewIcon />
      </Button>
      {selectedChat && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign="center">{selectedChat.chatName}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box>
                {selectedChat.users.map((u) => (
                  <Tag key={u._id} size="lg" colorScheme="purple" mr="1rem" mb="6px">
                    <TagLabel>{u.name}</TagLabel>
                    <TagCloseButton onClick={() => removeUser(u._id)} />
                  </Tag>
                ))}
              </Box>
              <Stack spacing={4} mt={4}>
                <FormControl>
                  <FormLabel>Rename Group</FormLabel>
                  <Flex gap="1rem">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Enter new group name"
                    />
                    <Button onClick={updateName} colorScheme="blue">
                      {loading ? <Spinner size="sm" /> : "Update"}
                    </Button>
                  </Flex>
                </FormControl>
                <FormControl>
                  <FormLabel>Add Users</FormLabel>
                  <InputGroup>
                    <Input
                      placeholder="Search users..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <InputRightElement width="4.5rem">
                      <Button size="sm" onClick={handleSearch}>Search</Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                {loading ? <Spinner /> : (
                  searchResults.slice(0, 3).map((u) => (
                    <UserListItem
                      key={u._id}
                      User={u}
                      handleFunction={() => addToGroup(u._id)}
                    />
                  ))
                )}
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" onClick={() => removeUser(user.user._id)}>
                Leave Group
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default UpdateGroupModal;
