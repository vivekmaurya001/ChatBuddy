import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import {
  Button,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Stack,
  Text,
  Avatar,
  Flex,
  AvatarBadge,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import axios from "axios";

const SelctedUserModal = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const btnRef = React.useRef();
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();
  console.log(selectedChat);

  const getsender = (Userarray) => {
    if (user.user._id === Userarray[0]._id) {
      return Userarray[1];
    } else return Userarray[0];
  };

  const DeleteChat = async () => {
    try {
      setLoading(true);
      console.log(user.auhToken);
      const config = {
        headers: {
          Authorization: `Bearer ${user.auhToken}`,
        },
      };

      const { data } = await axios.delete(
        `/api/chat`,
        {
          data: { ChatId: selectedChat._id },
        },
        config
      );
      setLoading(false);
      toast({
        title: "Deleted",
        description: "Deleted successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setFetchAgain(!fetchAgain);
      console.log(data);
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
      console.log(error);
    }
  };
  return (
    <>
      {" "}
      <Tooltip label="User Info">
        <Button ref={btnRef} bg="#48cae4" onClick={onOpen}>
          <ViewIcon color={"white"} />
        </Button>
      </Tooltip>
      {selectedChat && (
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />

            <DrawerBody display="flex" flexDirection="column" gap="1rem">
              <Stack
                mt="8vh"
                w="100%"
                justifyContent="center"
                display="flex"
                flexDirection="column"
                gap="0.9rem"
                borderBottom="1px solid grey"
                p="1rem"
              >
                <Avatar
                  size="2xl"
                  name="Segun Adebayo"
                  src={getsender(selectedChat.users).pic}
                  alignSelf="center"
                >
                  <AvatarBadge boxSize="1em" bg="#d1d2d5" />
                </Avatar>
                <Text textAlign="center" fontWeight="600" fontSize="24px">
                  {getsender(selectedChat.users).name}
                </Text>
                <Text textAlign="center">
                  {" "}
                  {getsender(selectedChat.users).Description
                    ? getsender(selectedChat.users).Description
                    : "No discription"}
                </Text>
              </Stack>
              <Stack gap="1rem" p="1rem" borderBottom="1px solid grey">
                {getsender(selectedChat.users).PhoneNo ? (
                  <Text fontSize="17px" color="grey">
                    {" "}
                    <b>Phone:</b>
                    {getsender(selectedChat.users).PhoneNo}
                  </Text>
                ) : null}
                {getsender(selectedChat.users).email ? (
                  <Text fontSize="17px" color="grey">
                    {" "}
                    <b>E-mail:</b> {getsender(selectedChat.users).email}
                  </Text>
                ) : null}
                {getsender(selectedChat.users).DOB ? (
                  <Text fontSize="17px" color="grey">
                    {" "}
                    <b>DOB:</b> {getsender(selectedChat.users).DOB}
                  </Text>
                ) : null}
              </Stack>
            </DrawerBody>

            <DrawerFooter>
              <Button onClick={openModal}>Delete Chat</Button>
              <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Delete Chat</ModalHeader>
                  <ModalBody>
                    <Text>
                      are you sure want to delete chat with{" "}
                      {getsender(selectedChat.users).name}?
                    </Text>
                    <Text>
                      Chat will also get delted for{" "}
                      {getsender(selectedChat.users).name}?
                    </Text>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      isLoading={loading}
                      onClick={DeleteChat}
                    >
                      Delete
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default SelctedUserModal;
