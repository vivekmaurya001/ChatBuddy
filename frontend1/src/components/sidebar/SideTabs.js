import React, { useState, useRef } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Stack,
  Divider,
  Flex,
  Text,
  useToast,
  Modal,
  ModalCloseButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  EditIcon,
  MoonIcon,
  InfoIcon,
  ChatIcon,
  PhoneIcon,
  ArrowForwardIcon,
} from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import GroupChatModal from "../micelenous/GroupChatModal";

const SideTabs = ({ setClicked }) => {
  const [createroomId, setcreateRoomId] = useState("");
  const [joinroomId, setjoinRoomId] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();
  const { user, theme, setTheme } = ChatState();
  const toast = useToast();
  const navigate = useNavigate();
  const btnRef = useRef();

  const handleSwitchToggle = () => setTheme(!theme);

  const showToast = (title, description) =>
    toast({
      title,
      description,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });

  const handleRoomAction = (id, type) => {
    if (!id) {
      showToast("Error Occurred!", `Please enter something to ${type}`);
      return;
    }
    navigate(`/room/${id}`);
  };

  const logoutHandler = () => {
    localStorage.removeItem("userinfo");
    navigate("/");
  };

  const DrawerButton = ({ icon, label, onClick }) => (
    <Button
      h="50px"
      w="100%"
      fontSize="20px"
      bg="transparent"
      _hover={{ bg: "#90e0ef", color: "black" }}
      justifyContent="flex-start"
      leftIcon={icon}
      onClick={onClick}
    >
      {label}
    </Button>
  );

  return (
    <>
      <Button ref={btnRef} onClick={onOpen}>
        <HamburgerIcon />
      </Button>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader textAlign="center" fontSize="2xl" fontWeight="bold">
            ChatBuddy
          </DrawerHeader>

          <DrawerBody as={Stack} spacing={4}>
            <Flex direction="column" align="flex-start" px={2}>
              <Text fontWeight="bold" color="#0077b6">{user?.user?.name}</Text>
              <Text fontSize="sm">{user?.user?.email}</Text>
            </Flex>

            <DrawerButton
              icon={<ChatIcon />}
              label="Messages"
              onClick={() => setClicked("Messages")}
            />

            <GroupChatModal />

            <DrawerButton
              icon={<PhoneIcon />}
              label="Video Call"
              onClick={openModal}
            />

            <DrawerButton
              icon={<EditIcon />}
              label="Update Profile"
              onClick={() => setClicked("Updateprofile")}
            />

            <DrawerButton
              icon={<MoonIcon />}
              label="Dark Mode"
              onClick={handleSwitchToggle}
            />

            <DrawerButton
              icon={<InfoIcon />}
              label="Contact Us"
              onClick={() => setClicked("ContactUs")}
            />

            <Divider />

            <DrawerButton
              icon={<ArrowForwardIcon />}
              label="Log Out"
              onClick={logoutHandler}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Video Call Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Video Call</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Create a meeting</FormLabel>
              <Input
                placeholder="Room ID"
                value={createroomId}
                onChange={(e) => setcreateRoomId(e.target.value)}
              />
              <Button
                colorScheme="blue"
                mt={2}
                onClick={() => handleRoomAction(createroomId, "create")}
              >
                Create
              </Button>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Join a meeting</FormLabel>
              <Input
                placeholder="Room ID"
                value={joinroomId}
                onChange={(e) => setjoinRoomId(e.target.value)}
              />
              <Button
                colorScheme="blue"
                mt={2}
                onClick={() => handleRoomAction(joinroomId, "join")}
              >
                Join
              </Button>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SideTabs;
