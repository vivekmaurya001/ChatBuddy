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
} from "@chakra-ui/react";
import { UnlockIcon } from "@chakra-ui/icons";
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
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb="96px"
            fontWeight="bold"
            py="4px"
            textColor="white"
            w="80%"
            m={"0 auto"}
          >
            <Box display="flex" alignItems="center" gap="4px" mt="6px">
              <Image
                boxSize="100px"
                objectFit="cover"
                src="favico/android-chrome-192x192.png"
                alt="Dan Abramov"
              />
              <Box fontSize="x-large" cursor={"pointer"}>
                <Link to="/" fontSize={28}>
                  ChatBuddy
                </Link>
              </Box>
            </Box>
            <Box display="flex" gap="32px" alignItems="center">
              <Button>Homepage</Button>
              <Button>Services</Button>
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
              w={isLargerThan950 ? "40%" : "80%"}
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
