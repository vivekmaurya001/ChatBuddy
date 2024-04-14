import React, { useState, useRef } from "react";
import { ChatState } from "../../Context/ChatProvider";
import {
  FormControl,
  FormLabel,
  Input,
  Box,
  Button,
  Stack,
  Flex,
  Text,
  Image,
  Textarea,
  NumberInput,
  NumberInputField,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import axios from "axios";

const Updateprofile = ({ setClicked }) => {
  const { user, setUser } = ChatState();
  const [name, setName] = useState("");
  const [Desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [Number, setNumber] = useState("");
  const [image, setImage] = useState("");
  const [DOB, setDOB] = useState("");
  const toast = useToast();
  const hiddenFileInput = useRef(null);
  const handleClick = () => {
    hiddenFileInput.current.click();
  };

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
      console.log(reader.result);
    };
  };

  const UpdateProfile = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.auhToken}`,
        },
      };

      const payload = {};

      if (Desc) {
        payload.Description = Desc;
      }

      if (DOB) {
        payload.DOB = DOB;
      }

      if (Number) {
        payload.PhoneNo = Number;
      }

      if (name) {
        payload.name = name;
      }

      if (image) {
        payload.pic = image;
      }

      const { data } = await axios.put("/api/user/update", payload, config);

      console.log(data);
      const Updateduser = user;
      Updateduser.user = data;
      setUser(Updateduser);
      console.log(user);
      toast({
        title: "Success",
        description: "Updated Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to update the user",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      w="95%"
      m="0 auto"
      overflowY={"auto"}
    >
      <Flex gap="1rem" alignItems="center">
        <Button borderRadius="full" onClick={() => setClicked("Messages")}>
          <ArrowBackIcon />
        </Button>
        <Text fontSize="25px" fontWeight={900}>
          Upadate Profile
        </Text>
      </Flex>
      <Stack spacing="1rem" w="100%" mt="0.6rem">
        <Image
          alignSelf="center"
          borderRadius="full"
          boxSize="125px"
          src={user.user.pic}
          alt="Dan Abramov"
        />
        <Button onClick={handleClick}>Upload Image</Button>
        <Input
          ref={hiddenFileInput}
          accept="image/*"
          onChange={handleImage}
          type="file"
          hidden
        />
      </Stack>
      <Box display={"flex"} flexDirection={"column"} gap="1rem">
        <Box>
          <FormLabel htmlFor="username" fontWeight={600} fontSize={20}>
            Name
          </FormLabel>
          <Input
            border={"1px solid grey"}
            h="50px"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="username"
            placeholder="Please enter user name"
          />
        </Box>
        <Box>
          <FormLabel htmlFor="desc" fontWeight={600} fontSize={20}>
            Description
          </FormLabel>
          <Textarea
            placeholder="Add about your self"
            id="desc"
            value={Desc}
            onChange={(e) => setDesc(e.target.value)}
            border={"1px solid grey"}
          />
        </Box>
        <Box>
          <FormLabel fontWeight={600} fontSize={20}>
            Phone Number
          </FormLabel>
          <Input
            border={"1px solid grey"}
            type="tel"
            placeholder="Enter your phone number"
            value={Number}
            onChange={(e) => setNumber(e.target.value)}
          />
        </Box>

        <Input
          type="date"
          h="50px"
          name="dob"
          placeholder="Select Date of Birth"
          border={"1px solid grey"}
          value={DOB}
          onChange={(e) => {
            setDOB(e.target.value);
          }}
        />

        <Button
          mt={2}
          colorScheme="teal"
          w="100px"
          onClick={UpdateProfile}
          isLoading={loading}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default Updateprofile;
