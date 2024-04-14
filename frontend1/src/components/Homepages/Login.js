import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Box,
  Button,
  Stack,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleTogglePassword = () => setShowPassword(!showPassword);
  const toast = useToast();
  const navigate = useNavigate();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please fill Out all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      //     fetch(`http://localhost:5000/api/user`)
      // const response = await fetch(`http://localhost:5000/api/user/login`,{
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     email:email,password:password
      //   }),
      // });
      // const json = await response.json();

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `https://chatbuddy-4.onrender.com/api/user/login`,
        {
          email: email,
          password: password,
        },
        config
      );

      console.log(data);

      if (data.success) {
        //redirect
        localStorage.setItem("userinfo", JSON.stringify(data));
        toast({
          title: "Success",
          description: "Login credentials verified",
          status: "success",
          duration: 2000,
        });
        setLoading(false);
        navigate("/chats");
      } else {
        toast({
          title: "Invalid Credentials",
          status: "error",
          duration: 2000,
        });
        setLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        status: "error",
        duration: 2000,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <Stack direction="column" spacing={3}>
      <FormControl isRequired>
        <FormLabel>Email address</FormLabel>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mb="1rem"
          type="email"
          placeholder="Enter the email...."
        />
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            pr="4.5rem"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleTogglePassword}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Box mb={2}>
        <Stack spacing={1}>
          <Button
            w="100%"
            colorScheme="blue"
            onClick={submitHandler}
            isLoading={loading}
          >
            Login
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Login;
