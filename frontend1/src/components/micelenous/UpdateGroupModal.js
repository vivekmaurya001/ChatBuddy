import React, { useState, useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";
import {
  Modal,
  ModalOverlay,
  InputRightElement,
  InputGroup,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  useDisclosure,
  Spinner,
  Tag,
  TagLabel,
  TagCloseButton,
  Box,
  Stack,
  Flex,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { ViewIcon } from "@chakra-ui/icons";
import UserListItem from "../UserListItem";

const UpdateGroupModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [search, Setsearch] = useState("");
  const [searchResults, SetsearchResults] = useState([]);
  const [newName, setnewname] = useState("");
  const [loading, setLoading] = useState(false);
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
  //fxn to update new function
  const updateName = async () => {
    if (!newName) {
      toast({
        title: "Please enter Something in name",
        status: "error",
        duration: 2000,
        position: "bottom-right",
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
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: newName,
        },
        config
      );
      setSelectedChat(data);
      setLoading(false);
      setFetchAgain(!fetchAgain);
      onClose();
      toast({
        title: "name updates succesfully",
        status: "success",
        duration: 2000,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to update the name!",
        description: error.response.data,
        status: "error",
        duration: 2000,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const addToGroup = async (UserID) => {
    if (selectedChat.users.find((u) => u._id === UserID)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 2000,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user.user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 2000,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);

      const config2 = {
        headers: {
          Authorization: `Bearer ${user.auhToken}`,
        },
      };
      const { newdata1 } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: UserID,
        },
        config2
      );
      setFetchAgain(!fetchAgain);
      setSelectedChat(newdata1);
      onClose();
      setLoading(false);
      toast({
        title: "added member succesfully",
        status: "success",
        duration: 2000,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to add memeber!",
        description: error.response.data,
        status: "error",
        duration: 2000,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  //api request not going to server sending undefined data but on refreshing user is deleted
  const removefxn = async (UserID) => {
    console.log("removing this", UserID);
    console.log("chat id", selectedChat._id);
    try {
      setLoading(true);

      const config1 = {
        headers: {
          Authorization: `Bearer ${user.auhToken}`,
        },
      };
      const { newdata } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: UserID,
        },
        config1
      );
      console.log(newdata);
      setFetchAgain(!fetchAgain);
      UserID === user.user._id ? setSelectedChat() : setSelectedChat(newdata);
      onClose();
      setLoading(false);
      toast({
        title: "deleted member succesfully",
        status: "success",
        duration: 2000,
        position: "bottom",
      });
      return;
    } catch (error) {
      toast({
        title: "Failed to delete memeber!",
        description: error.response.data,
        status: "error",
        duration: 2000,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const removemember = (UserId) => {
    if (user.user._id === selectedChat.groupAdmin._id) {
      removefxn(UserId);
    } else {
      toast({
        title: "Permission denied",
        description: "only admins can remove memebers",
        status: "error",
        duration: 2000,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    if (!search) SetsearchResults([]);
  }, [search]);
  return (
    <>
      <Button
        isDisabled={selectedChat ? !selectedChat.isGroupChat : true}
        onClick={onOpen}
      >
        <ViewIcon />
      </Button>
      {selectedChat && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontSize="35px" display="flex" justifyContent="center">
              {selectedChat.chatName}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Box>
                {selectedChat.users.map((User, i) => {
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
                      <TagCloseButton onClick={() => removemember(User._id)} />
                    </Tag>
                  );
                })}
              </Box>

              <Stack>
                <FormControl>
                  <FormLabel>Update Name</FormLabel>
                  <Flex gap="1rem">
                    <Input
                      placeholder="Enter the new name..."
                      value={newName}
                      onChange={(e) => setnewname(e.target.value)}
                    />
                    <Button colorScheme="blue" onClick={() => updateName()}>
                      {loading ? <Spinner /> : "Update"}{" "}
                    </Button>
                  </Flex>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Add members</FormLabel>
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
                </FormControl>
              </Stack>

              <Stack mt="1rem">
                {loading ? (
                  <Spinner />
                ) : (
                  searchResults?.slice(0, 3).map((User, i) => {
                    return (
                      <UserListItem
                        key={i}
                        User={User}
                        handleFunction={() => addToGroup(User._id)}
                      />
                    );
                  })
                )}
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="red"
                alignSelf="end"
                onClick={() => removefxn(user.user._id)}
              >
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
