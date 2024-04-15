import React, { useEffect } from "react";
import { Button, ButtonGroup, Heading } from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Box,
  Text,
  Stack,
  useMediaQuery,
} from "@chakra-ui/react";
import { ChevronDownIcon, CheckIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const MainSitePage = () => {
  const [isLargerThan950] = useMediaQuery("(min-width: 950px)");

  return (
    <Box p="0 3rem" w="100vw" h="100%" overflow={"hidden"} bgColor={"white"}>
      <Box
        w="90vw"
        h="100px"
        display="flex"
        justifyContent="space-between"
        fontWeight="bold"
        pt="1rem"
      >
        <Box fontSize="x-large" display="flex" alignItems="center" gap="4px">
          <Image
            objectFit="cover"
            h="160px"
            w="200px"
            src="images/Logo2.png"
            alt="Logo"
          />
        </Box>
        <Box display="flex" alignItems="center">
          {" "}
          {isLargerThan950 ? (
            <>
              <Menu>
                <MenuButton
                  bg="transparent"
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                >
                  Features
                </MenuButton>
                <MenuList>
                  <MenuItem>Profile</MenuItem>
                  <MenuItem>Logout</MenuItem>
                </MenuList>
              </Menu>
              <Menu>
                <MenuButton
                  bg="transparent"
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                >
                  Use Cases
                </MenuButton>
                <MenuList>
                  <MenuItem>Profile</MenuItem>
                  <MenuItem>Logout</MenuItem>
                </MenuList>
              </Menu>
              <Menu>
                <MenuButton
                  bg="transparent"
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                >
                  Resourses
                </MenuButton>
                <MenuList>
                  <MenuItem>Profile</MenuItem>
                  <MenuItem>Logout</MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : null}
          <div className="buttons">
            <Button
              colorScheme="teal"
              variant="ghost"
              borderRadius={20}
              w="150px"
            >
              <Link to="/login">Log in</Link>
            </Button>
            <Button
              color={"white"}
              bgColor="#136dff"
              borderRadius={20}
              w="150px"
            >
              <Link to="/login">Sign Up</Link>
            </Button>
          </div>
        </Box>
      </Box>
      <Box
        display={"flex"}
        flex={"wrap"}
        justifyContent={"space-between"}
        h="90%"
        w="100%"
        alignItems={"center"}
      >
        <Stack spacing={4} w={isLargerThan950 ? "50%" : "100%"}>
          <Text color={"grey"} fontSize={18} fontWeight={600}>
            {" "}
            LIVE CHAT SOFTWARE
          </Text>
          <Heading color={"black"} fontSize={50} fontWeight={"bolder"}>
            Unleash the power of live chat with ChatBuddy.
          </Heading>
          <Text fontWeight={700} gap={3} alignItems={"center"} display={"flex"}>
            {" "}
            <CheckIcon color={"green"} /> Share images and have video calls
            seamlessly.
          </Text>
          <Text fontWeight={700} gap={3} alignItems={"center"} display={"flex"}>
            {" "}
            <CheckIcon color={"green"} />
            Engage in one-on-one and group chats instantly
          </Text>
          <Text fontWeight={700} gap={3} alignItems={"center"} display={"flex"}>
            {" "}
            <CheckIcon color={"green"} /> Easily find and connect with
            individuals using our search feature.
          </Text>
          <Text fontWeight={700} gap={3} alignItems={"center"} display={"flex"}>
            {" "}
            <CheckIcon color={"green"} />
            catering to your visual preference
          </Text>
        </Stack>
        {isLargerThan950 ? (
          <Box
            w="50%"
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Image
              objectFit="cover"
              boxSize="560px"
              src="images/SitePage.png"
              alt="Logo"
            />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default MainSitePage;
