import React, { useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
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
  Image,
  useColorMode,
  useColorModeValue,
  Switch,
  Modal,
  ModalCloseButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Input,
  FormLabel,
  FormControl,
  useToast,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  ArrowRightIcon,
  ChatIcon,
  CalendarIcon,
  InfoIcon,
  MoonIcon,
  EditIcon,
} from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import GroupChatModal from "../micelenous/GroupChatModal";

const SideTabs = ({ setClicked }) => {
  const [createroomId, setcreateRoomId] = useState();
  const [joinroomId, setjoinRoomId] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const toast = useToast();
  const { user, theme, setTheme } = ChatState();
  const navigate = useNavigate();

  const handleSwitchToggle = () => {
    setTheme(!theme);
    console.log(theme);
  };

  const handlecreate = () => {
    if (!createroomId) {
      toast({
        title: "Error Occured!",
        description: "Please enter something to create",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }

    navigate(`/room/${createroomId}`);
  };
  const handleJoin = () => {
    if (!joinroomId) {
      toast({
        title: "Error Occured!",
        description: "Please enter something to join",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }

    navigate(`/room/${joinroomId}`);
  };
  const [loggedUser, setLoggedUser] = useState(user.user);
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userinfo");
    navigate("/");
  };
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
        colorScheme="#48cae4"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader alignSelf="center" fontSize="30px">
            <Image
              objectFit="cover"
              h="100px"
              w="180px"
              src="images/Logo.png"
              alt="Logo"
            />
          </DrawerHeader>

          <DrawerBody gap="2rem" display="flex" flexDirection="column">
            <Flex gap="1rem">
              <Image
                size="100px"
                borderRadius="full"
                boxSize="55px"
                src={loggedUser.pic}
                alt="Dan Abramov"
              />
              <Flex flexDirection="column">
                <Text as="b" color="#0077b6">
                  {loggedUser.name}
                </Text>
                <Flex>{loggedUser.email}</Flex>
              </Flex>
            </Flex>
            <Stack
              spacing="1rem"
              bgColor="transparent"
              alignItems="center"
              w="100%"
            >
              <Button
                h="50px"
                bg="transparent"
                _hover={{ bg: "#90e0ef", color: "black" }}
                w="100%"
                fontSize="20px"
                gap="1rem"
                display={"flex"}
                justifyContent={"flex-start"}
                onClick={() => setClicked("Messages")}
              >
                <i class="fas fa-comments"></i>
                Messages
              </Button>
              <GroupChatModal />
              <Button
                h="50px"
                bg="transparent"
                _hover={{ bg: "#90e0ef", color: "black" }}
                w="100%"
                fontSize="20px"
                gap="1rem"
                display={"flex"}
                justifyContent={"flex-start"}
                onClick={openModal}
              >
                <i class="fas fa-video"></i>
                Video Call
              </Button>
              <Button
                h="50px"
                bg="transparent"
                _hover={{ bg: "#90e0ef", color: "black" }}
                w="100%"
                fontSize="20px"
                gap="1rem"
                display={"flex"}
                onClick={() => setClicked("Updateprofile")}
                justifyContent={"flex-start"}
              >
                <EditIcon />
                Update Profile
              </Button>
              <Button
                h="50px"
                bg="transparent"
                _hover={{ bg: "#90e0ef", color: "black" }}
                w="100%"
                fontSize="20px"
                display={"flex"}
                onClick={handleSwitchToggle}
                justifyContent={"space-between"}
              >
                <Text gap="1rem" display={"flex"}>
                  <MoonIcon />
                  Dark Mode
                </Text>
                <Switch colorScheme="red" />
              </Button>
              <Button
                h="50px"
                bg="transparent"
                _hover={{ bg: "#90e0ef", color: "black" }}
                w="100%"
                fontSize="20px"
                gap="1rem"
                display={"flex"}
                onClick={() => setClicked("ContactUs")}
                justifyContent={"flex-start"}
              >
                <InfoIcon />
                Contact Us
              </Button>
              <Divider />
              <Button
                h="50px"
                bg="transparent"
                bgColor="transparent"
                w="100%"
                fontSize="20px"
                gap="1rem"
                display={"flex"}
                onClick={logoutHandler}
                justifyContent={"flex-start"}
              >
                <i class="fas fa-sign-out-alt"></i>
                Log Out
              </Button>
            </Stack>
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Do a Video Call</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Create a meeting</FormLabel>
              <Input
                placeholder="RoomId"
                value={createroomId}
                onChange={(e) => setcreateRoomId(e.target.value)}
              />
              <Button colorScheme="blue" mr={3} mt="8px" onClick={handlecreate}>
                Create
              </Button>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Join a meeting</FormLabel>
              <Input
                placeholder="RoomId"
                value={joinroomId}
                onChange={(e) => setjoinRoomId(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="blue" mr={3} mt="8px" onClick={handleJoin}>
              Join
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SideTabs;
