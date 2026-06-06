import React, { useState } from 'react'
import { Button, Fieldset, Input, Stack, Flex } from '@chakra-ui/react'
import { Field } from "../../components/ui/field"
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useHistory } from "react-router-dom";
import axios from 'axios'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const history = useHistory();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      setMessage("Please Fill all the Fields!");
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      setMessage("Registration Successful!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 5000);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/home");
    } catch (error) {
      console.log("Eroare la trimiterea cererii:", error.response?.data || error.message);
      setMessage("Error Occurred!");
      setMessageType("error");
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
      setLoading(false);
    }
  };

  return (
    <Flex justifyContent="center" p="4">
      <div> {/* Încapsulăm Fieldset într-un div */}
        <Fieldset.Root size="lg" maxW="md">
          <Stack alignItems="center" p="4">
            <div> {/* Evităm plasarea Fieldset.HelperText într-un <p> */}
              <Fieldset.HelperText>
                Introduceți datele pentru autentificare.
              </Fieldset.HelperText>
            </div>
          </Stack>

          <Fieldset.Content>
            <Field label="Adresa de email" color="black">
              <Input
                name="email"
                type="email"
                placeholder="Introduceți adresa de email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>

            <Field label="Parola" color="black">
              <Flex direction="row" align="center" width="100%" position="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Parolă"
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  width="100%"
                  style={{color: "black"}}
                />
                <div
                  style={{
                    position: "absolute",
                    right: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={20} color="black"/> : <FaEye size={20} color="black"/>}
                </div>
              </Flex>
            </Field>
          </Fieldset.Content>

          <Button
            type="submit"
            alignSelf="center"
            bg="lightblue"
            color="white"
            _hover={{ bg: "lightblue.100" }}
            _active={{ bg: "white", color: "lightblue", border: "2px solid lightblue" }}
            _focus={{ boxShadow: "none" }}
            mt="4"
            width="100%"
            onClick={submitHandler}
          >
            Login
          </Button>

          {/* <Button
            variant="solid"
            alignSelf="center"
            bg="darkred"
            color="white"
            _hover={{ bg: "red.100" }}
            _active={{ bg: "white", color: "red", border: "2px solid red" }}
            _focus={{ boxShadow: "none" }}
            mt="4"
            width="100%"
            onClick={() => {
              setEmail("guest@example.com");
              setPassword("123456");
            }}
          >
            Autentifică-te drept vizitator
          </Button> */}
        </Fieldset.Root>
        {message && (
          <Flex
            justifyContent="center"
            alignItems="center"
            bg={messageType === "success" ? "green.100" : "red.100"}
            color={messageType === "success" ? "green.800" : "red.800"}
            p="4"
            mt="4"
            borderRadius="md"
            position="relative"
            bottom="0"
            width="100%"
          >
            {message}
          </Flex>
        )}
      </div>
    </Flex>
  );
};

export default Login
