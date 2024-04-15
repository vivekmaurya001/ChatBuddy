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
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Input,
  Button,
  Text,
  Flex,
  useMediaQuery,
  Stack,
} from "@chakra-ui/react";
import { UnlockIcon, ChevronDownIcon } from "@chakra-ui/icons";
import Login from "./Login";
import Signup from "./Signup";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [isLargerThan950] = useMediaQuery("(min-width: 950px)");
  const navigate = useNavigate();
  useEffect(() => {
    // const userInfo=JSON.parse(localStorage.getItem("userinfo"))
    // if(userInfo){
    //     navigate("/chats")
    // }
  }, [navigate]);
  return (
    <>
      <div>
        <Box bg="transparent" h="100vh" w="100vw">
          <Box
            w="90vw"
            h="100px"
            display="flex"
            justifyContent="space-between"
            fontWeight="bold"
            pt="1rem"
          >
            <Box
              fontSize="x-large"
              display="flex"
              alignItems="center"
              gap="4px"
            >
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
            width="80%"
            margin="auto"
            display="flex"
            justifyContent="center"
            alignContent="center"
            gap="128px"
            mt={30}
          >
            <Box
              w={isLargerThan950 ? "40%" : "98%"}
              p={4}
              m="0 auto"
              textAlign="center"
              backgroundColor="white"
              borderRadius="8px"
              d="flex"
              justifyContent="center"
              alignItems="center"
            >
              {" "}
              <Flex h="150px" alignItems={"center"}>
                <Stack>
                  <Heading>Get Closer To EveryOne</Heading>
                  <Text>Helps you to contact everyone with just easy way</Text>
                </Stack>
                <Image
                  objectFit="cover"
                  h="120px"
                  w="120px"
                  src="images/LoginPage.png"
                  alt="Logo"
                />
              </Flex>
              <Tabs>
                <TabList gap="4" display="flex" justifyContent="space-between">
                  <Tab w="45%">Sign Up</Tab>
                  <Tab w="45%">Login</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Signup />
                  </TabPanel>
                  <TabPanel>
                    <Login />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
            {isLargerThan950 ? (
              <div className="right">
                <img src="images/no.png" alt="" />
              </div>
            ) : null}
          </Box>
        </Box>
      </div>
    </>
  );
};

export default HomePage;
