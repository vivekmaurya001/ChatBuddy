import React from "react";
import {
  Box,
  Button,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Text,
  useMediaQuery,
  Image,
} from "@chakra-ui/react";
import { ChevronDownIcon, CheckIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

const MainSitePage = () => {
  const [isLargerThan950] = useMediaQuery("(min-width: 950px)");

  return (
    <Box p="0 3rem" w="100vw" h="100%" overflow="hidden" bgColor="white">
      {/* Navbar */}
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
          {isLargerThan950 && (
            <>
              {["Features", "Use Cases", "Resources"].map((menuLabel) => (
                <Menu key={menuLabel}>
                  <MenuButton
                    bg="transparent"
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                  >
                    {menuLabel}
                  </MenuButton>
                  <MenuList>
                    <MenuItem>Profile</MenuItem>
                    <MenuItem>Logout</MenuItem>
                  </MenuList>
                </Menu>
              ))}
            </>
          )}

          <Box display="flex" gap={2} ml={4}>
            <Button colorScheme="teal" variant="ghost" borderRadius={20} w="150px">
              <Link to="/login">Log in</Link>
            </Button>
            <Button color="white" bgColor="#136dff" borderRadius={20} w="150px">
              <Link to="/login">Sign Up</Link>
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        h="90%"
        w="100%"
        alignItems="center"
      >
        <Stack spacing={4} w={isLargerThan950 ? "50%" : "100%"}>
          <Text color="grey" fontSize={18} fontWeight={600}>
            LIVE CHAT SOFTWARE
          </Text>

          <Heading color="black" fontSize={50} fontWeight="bolder">
            Unleash the power of live chat with ChatBuddy.
          </Heading>

          {[
            "Share images and have video calls seamlessly.",
            "Engage in one-on-one and group chats instantly.",
            "Easily find and connect with individuals using our search feature.",
            "Catering to your visual preference.",
          ].map((text, i) => (
            <Text
              key={i}
              fontWeight={700}
              gap={3}
              alignItems="center"
              display="flex"
            >
              <CheckIcon color="green" /> {text}
            </Text>
          ))}
        </Stack>

        {isLargerThan950 && (
          <Box
            w="50%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              objectFit="cover"
              boxSize="560px"
              src="images/SitePage.png"
              alt="Illustration"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MainSitePage;
