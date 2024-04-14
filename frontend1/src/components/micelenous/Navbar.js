import {
  Box,
  Button,
  Text,
  Heading,
  Image,
  Badge,
  Drawer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import React from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/hooks";
import SearchDrawer from "./SearchDrawer";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, Notification, setNotification, setSelectedChat } = ChatState();
  const loggedUser = user.user.name;
  const userEmail = user.user.email;
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("userinfo");
    navigate("/");
  };
  const getsender = (Userarray) => {
    if (user.user._id === Userarray[0]) {
      return Userarray[1];
    } else return Userarray[0];
  };

  return (
    <Box
      bg="white"
      p="0.7rem 1rem"
      height="60px"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <SearchDrawer />
      <Heading>ChatBuddy</Heading>
      <Box display="flex" gap="1rem" alignItems="center">
        <Menu>
          <MenuButton>
            <BellIcon w={6} h={6} color="black.500" />
            {Notification.length ? (
              <Badge ml="1" colorScheme="green">
                New
              </Badge>
            ) : null}
          </MenuButton>
          <MenuList>
            {!Notification.length && "No New Messages"}
            {Notification.map((notif) => {
              return (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.Chat);
                    setNotification(Notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.Chat.isGroupChat
                    ? `New Message in ${notif.Chat.chatName}`
                    : `new Message from ${notif.senderName}`}
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Image
              borderRadius="full"
              boxSize="40px"
              src="https://bit.ly/dan-abramov"
              alt="Dan Abramov"
            />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={onOpen}>Profile</MenuItem>
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent fontSize="3xl" textAlign="center">
            <ModalHeader fontSize="4xl">{loggedUser}</ModalHeader>
            <ModalBody
              m="0 auto"
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              <Image
                borderRadius="full"
                boxSize="200px"
                src="https://bit.ly/dan-abramov"
                alt="Dan Abramov"
              />
              <Text>{userEmail}</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default Navbar;
