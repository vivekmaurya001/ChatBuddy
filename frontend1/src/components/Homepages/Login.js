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
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const PORT = process.env.REACT_APP_BACKEND_URL;


const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { setUser } = ChatState();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const { email, password } = form;
    setLoading(true);

    if (!email || !password) {
      toast({
        title: "Please fill out all fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${PORT}/api/user/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.success) {
        localStorage.setItem("userinfo", JSON.stringify(data));
        setUser(data);
        toast({
          title: "Success",
          description: "Login credentials verified",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        navigate("/chats");
      } else {
        toast({
          title: "Invalid Credentials",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error occurred!",
        status: "error",
        duration: 2000,
        position: "bottom",
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <FormControl isRequired>
        <FormLabel>Email address</FormLabel>
        <Input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email..."
          mb="1rem"
        />

        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Box>
        <Button
          w="100%"
          colorScheme="blue"
          onClick={handleSubmit}
          isLoading={loading}
        >
          Login
        </Button>
      </Box>
    </Stack>
  );
};

export default Login;
