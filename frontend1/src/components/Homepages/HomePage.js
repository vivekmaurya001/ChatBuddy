import React, { useEffect } from "react";
import {
  Box,
  Heading,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Image,
  Text,
  Flex,
  useMediaQuery,
  Stack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

const navItems = ["Features", "Use Cases", "Resources"];

const HomePage = () => {
  const [isLargeScreen] = useMediaQuery("(min-width: 950px)");
  const navigate = useNavigate();

  return (
    <Box h="100vh" w="100vw">
      {/* Navbar */}
      <Flex w="90vw" h="100px" mx="auto" justify="space-between" pt="1rem" fontWeight="bold">
        <Image h="160px" w="200px" src="images/Logo2.png" alt="Logo" objectFit="cover" />
      </Flex>

      {/* Auth + Hero Section */}
      <Flex
        wrap="wrap"
        mt={30}
        w="80%"
        mx="auto"
        justify="center"
        align="center"
        gap="128px"
      >
        {/* Auth Box */}
        <Box
          w={isLargeScreen ? "40%" : "98%"}
          p={4}
          bg="white"
          borderRadius="8px"
          textAlign="center"
        >
          <Flex h="150px" align="center" justify="center" gap={4}>
            <Stack textAlign="left">
              <Heading>Get Closer To EveryOne</Heading>
              <Text>Helps you to contact everyone in an easy way</Text>
            </Stack>
          </Flex>

          <Tabs mt={6}>
            <TabList justifyContent="center" gap={4}>
              <Tab w="45%">Sign Up</Tab>
              <Tab w="45%">Login</Tab>
            </TabList>
            <TabPanels>
              <TabPanel><Signup /></TabPanel>
              <TabPanel><Login /></TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

      </Flex>
    </Box>
  );
};

export default HomePage;
