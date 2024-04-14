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

const Signup = () => {
  const [email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [Image, setImage] = useState("");
  const [confirmpassword, setconfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const handleTogglePassword = () => setShowPassword(!showPassword);

  const postDetails = () => {};

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileTobase(file);
    console.log(file);
  };
  const setFileTobase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };
  const submitHandler = async () => {
    setLoading(true);
    if (!Name || !email || !password || !confirmpassword) {
      toast({
        title: "Please fill Out all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    if (password != confirmpassword) {
      toast({
        title: "password and confirmpassword should be same",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    try {
      //     fetch(`http://localhost:5000/api/user`)
      // const response = await fetch(`http://localhost:5000/api/user`,{
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     name:Name,email:email,password:password
      //   }),
      // });
      // const json = await response.json();

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      let payload = {
        email: email,
        password: password,
        name: Name,
      };

      if (Image) {
        payload.pic = Image;
      }
      console.log(payload);
      const { data } = await axios.post(`/api/user`, payload, config);

      console.log(data);
      if (data.success) {
        //redirect
        localStorage.setItem("userinfo", JSON.stringify(data));
        toast({
          title: "Account created.",
          description: "Account created sucessfully",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        setLoading(false);
        navigate("/chats");
      } else {
        toast({
          title: "Invalid Credentials",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        setLoading(false);
      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <Stack direction="column" spacing={3}>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          value={Name}
          onChange={(e) => setName(e.target.value)}
          mb="1rem"
          type="text"
          minLength="3"
          placeholder="Enter your Name...."
        />
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mb="1rem"
          isemail="true"
          type="email"
          placeholder="Enter  email...."
        />
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            pr="4.5rem"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            mb="1rem"
            minLength="5"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleTogglePassword}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          value={confirmpassword}
          onChange={(e) => setconfirmPassword(e.target.value)}
          mb="1rem"
          type="password"
          placeholder="Confirm password...."
        />
        <FormLabel>Profile Photo</FormLabel>
        <Input
          accept="image/*"
          onChange={handleImage}
          mb="1rem"
          type="file"
          p="7px"
          placeholder="Confirm password...."
        />
      </FormControl>
      <Box mb={2}>
        <Button
          w="100%"
          colorScheme="blue"
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign Up
        </Button>
      </Box>
    </Stack>
  );
};

export default Signup;
