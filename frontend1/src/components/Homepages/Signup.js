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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

import { ChatState } from "../../Context/ChatProvider";
import { useNavigate } from "react-router-dom";

const PORT = process.env.REACT_APP_BACKEND_URL;

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = ChatState();


  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, image: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const { name, email, password, confirmPassword, image } = form;

    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please fill out all the fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${PORT}/api/user`,
        { name, email, password, pic: image },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.success) {
        localStorage.setItem("userinfo", JSON.stringify(data));
        setUser(data);
        toast({
          title: "Account created successfully.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        navigate("/chats");
      } else {
        toast({
          title: "Invalid Credentials",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error occurred!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <FormControl>
        {[
          { label: "Name", name: "name", type: "text", minLength: 3 },
          { label: "Email Address", name: "email", type: "email" },
        ].map(({ label, name, type, minLength }) => (
          <Box key={name}>
            <FormLabel fontSize={15} fontWeight={900}>
              {label}
            </FormLabel>
            <Input
              name={name}
              value={form[name]}
              onChange={handleChange}
              type={type}
              minLength={minLength}
              placeholder={`Enter ${label.toLowerCase()}...`}
              mb="1rem"
            />
          </Box>
        ))}

        <FormLabel fontSize={15} fontWeight={900}>
          Password
        </FormLabel>
        <InputGroup mb="1rem">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            minLength={5}
          />
          <InputRightElement width="4.5rem">
            <Button size="sm" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>

        <FormLabel fontSize={15} fontWeight={900}>
          Confirm Password
        </FormLabel>
        <Input
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          mb="1rem"
        />

        <FormLabel fontSize={15} fontWeight={900}>
          Profile Photo
        </FormLabel>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImage}
          p="7px"
          mb="1rem"
        />
      </FormControl>

      <Button
        w="100%"
        colorScheme="blue"
        onClick={handleSubmit}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </Stack>
  );
};

export default Signup;
