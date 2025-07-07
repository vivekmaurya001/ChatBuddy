import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Button,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormLabel,
  Spinner,
  Tag,
  TagLabel,
  TagCloseButton,
  InputRightElement,
  InputGroup,
  useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/hooks";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserListItem";

const PORT = process.env.REACT_APP_BACKEND_URL;

const GroupChatModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats, setSelectedChat } = ChatState();
  const toast = useToast();

  // Fetch users based on search
  const handleSearch = async () => {
    if (!search) {
      return toast({
        title: "Enter something to search",
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
        { headers: { Authorization: `Bearer ${user.auhToken}` } }
      );
      setSearchResults(data);
    } catch {
      toast({
        title: "Search failed",
        description: "Unable to fetch users",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleAddUser = (userToAdd) => {
    if (selectedUsers.some((u) => u._id === userToAdd._id)) {
      toast({
        title: "User already added",
        status: "error",
        duration: 2000,
        position: "bottom-right",
      });
      return;
    }
    setSelectedUsers((prev) => [userToAdd, ...prev]);
  };

  const handleRemoveUser = (userToRemove) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== userToRemove._id));
  };

  const createGroup = async () => {
    if (!groupName || selectedUsers.length < 2) {
      return toast({
        title: "Incomplete data",
        description: "Provide group name and at least 2 users",
        status: "error",
        duration: 2000,
        position: "bottom-left",
      });
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${PORT}/api/chat/group`,
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        { headers: { Authorization: `Bearer ${user.auhToken}` } }
      );

      setChats((prev) => [data, ...prev]);
      setSelectedChat(data);
      toast({
        title: "Group created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      onClose();
      setGroupName("");
      setSelectedUsers([]);
      setSearchResults([]);
    } catch (error) {
      toast({
        title: "Creation failed",
        description: error?.response?.data || "Server error",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!search) setSearchResults([]);
  }, [search]);

  return (
    <>
      <Button
        h="50px"
        bg="transparent"
        w="100%"
        fontSize="20px"
        gap="1rem"
        justifyContent="flex-start"
        onClick={onOpen}
        _hover={{ bg: "#90e0ef", color: "black" }}
        leftIcon={<AddIcon />}
      >
        Create Group
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4} mb={4}>
              <Box>
                <FormLabel>Group Name</FormLabel>
                <Input
                  placeholder="Enter group name..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel>Search Users</FormLabel>
                <InputGroup>
                  <Input
                    placeholder="Search members..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyUp={handleKeyPress}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleSearch}>
                      Search
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>
            </Stack>

            {/* Selected Users */}
            <Box mb={4}>
              {selectedUsers.map((user) => (
                <Tag
                  key={user._id}
                  size="lg"
                  colorScheme="purple"
                  variant="solid"
                  mr={2}
                  mb={2}
                >
                  <TagLabel>{user.name}</TagLabel>
                  <TagCloseButton onClick={() => handleRemoveUser(user)} />
                </Tag>
              ))}
            </Box>

            {/* Search Results */}
            <Stack spacing={2}>
              {loading ? (
                <Spinner />
              ) : (
                searchResults.slice(0, 3).map((user) => (
                  <UserListItem
                    key={user._id}
                    User={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
              )}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={createGroup}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
