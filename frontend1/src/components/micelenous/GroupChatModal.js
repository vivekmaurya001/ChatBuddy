import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Button,
  Stack,
  Modal,
  useToast,
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
} from "@chakra-ui/react";
import { AddIcon, CalendarIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/hooks";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserListItem";

const GroupChatModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupname, setGroupname] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, Setsearch] = useState("");
  const [searchResults, SetsearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats, selectedChat, setSelectedChat, theme } =
    ChatState();
  const toast = useToast();

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

      const { data } = await axios.get(`/api/user?search=${search}`, config);
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
  //fxn for adding selsted members in array
  const addFxn = async (UsertoAdd) => {
    // Check if the member already exists
    const addedmember = selectedUsers.some((User) => User === UsertoAdd);
    if (!addedmember) {
      // Add the new member to the array
      setSelectedUsers([UsertoAdd, ...selectedUsers]);
    } else {
      toast({
        title: "member already added",
        status: "error",
        duration: 2000,
        position: "bottom-right",
      });
    }
  };
  const removefxn = async (User) => {
    setSelectedUsers((selectedUsers) =>
      selectedUsers.filter((item) => item !== User)
    );
  };
  const createGroup = async () => {
    if (selectedUsers.length < 2 || !groupname) {
      toast({
        title: "Error Occured!",
        description: "Select Atlest two members and enter group name",
        status: "error",
        duration: 2000,
        position: "bottom-left",
      });
      return;
    }
    try {
      setLoading(true);
      SetsearchResults([]);

      const config = {
        headers: {
          Authorization: `Bearer ${user.auhToken}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupname,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setSelectedChat(data);
      setLoading(false);
      onClose();
      setSelectedUsers([]);
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!search) SetsearchResults([]);
  }, [search]);
  return (
    <>
      <Button
        h="50px"
        bg="transparent"
        _hover={{ bg: "#90e0ef", color: "black" }}
        w="100%"
        fontSize="20px"
        gap="1rem"
        display={"flex"}
        justifyContent={"flex-start"}
        onClick={onOpen}
      >
        <i class="fas fa-users"></i>
        Create Group
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack mb="1rem" spacing={3}>
              <Box>
                <FormLabel>Group name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter the group name..."
                  value={groupname}
                  onChange={(e) => setGroupname(e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel>Search users</FormLabel>
                <InputGroup>
                  <Input
                    type="search"
                    placeholder="Choose memebers...."
                    value={search}
                    onChange={(e) => Setsearch(e.target.value)}
                    onKeyUp={handleKeyPress}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={submitHandler}>
                      Search
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>
            </Stack>
            <Box>
              {selectedUsers.map((User, i) => {
                return (
                  <Tag
                    key={i}
                    size="lg"
                    variant="solid"
                    colorScheme="purple"
                    mb="6px"
                    mr="1rem"
                  >
                    <TagLabel>{User.name}</TagLabel>
                    <TagCloseButton onClick={() => removefxn(User)} />
                  </Tag>
                );
              })}
            </Box>
            <Stack spacing={2}>
              {loading ? (
                <Spinner />
              ) : (
                searchResults?.slice(0, 3).map((User, i) => {
                  return (
                    <UserListItem
                      key={i}
                      User={User}
                      handleFunction={() => addFxn(User)}
                    />
                  );
                })
              )}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                createGroup();
              }}
            >
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
