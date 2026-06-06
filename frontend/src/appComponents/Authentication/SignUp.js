import React, { useState, useEffect } from 'react'
import { Button, Fieldset, Input, Stack, Flex, createListCollection } from '@chakra-ui/react'
import { Field } from "../../components/ui/field"
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../components/ui/select"
import axios from 'axios'
import { useHistory } from "react-router";
import { Spinner } from "@chakra-ui/react";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('');
  const history = useHistory();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      setMessage("Te rog selecteaza o imagine");
      setMessageType("error");
      setPicLoading(false);
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    setPicLoading(true);

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "ask-a-teacher");
      data.append("cloud_name", "dlnfse038");
      axios.post("https://api.cloudinary.com/v1_1/dlnfse038/image/upload", data, {
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then((response) => {
          console.log("Cloudinary response:", response);
          setPic(response.data.url.toString());
          setPicLoading(false);
          setMessage("Imagine incărcată cu succes!");
          setMessageType("success");
          setTimeout(() => setMessage(""), 5000);
        })
        .catch((err) => {
          console.log(err);
          setMessage("Eroare la încărcarea imaginii!");
          setMessageType("error");
          setTimeout(() => setMessage(""), 5000);
          setPicLoading(false);
        });
    } else {
      setMessage("Please Select a valid image format!");
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
      setPicLoading(false);
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword || !occupation) {
      setMessage("Please Fill all the Fields!");
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
      setLoading(false);
      return;
    }
    //console.log(name, email, password, pic);
    const roleValue = Array.isArray(role) ? role[0] : role;
    console.log("Payload trimis2:", {
      name,
      email,
      password,
      pic,
      occupation: roleValue
    });
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
          occupation: roleValue,
        },
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
    } finally {
      setLoading(false);  // 🔴 Dezactivează loading indiferent dacă request-ul are succes sau nu
    }
  };

  return (
    <Flex justifyContent="center" p="4">
      <div> {/* Încapsulăm Fieldset pentru a evita problemele de nesting */}
        <Fieldset.Root size="lg" maxW="md">
          <Stack alignItems="center" p="4">
            <div> {/* Previne plasarea Fieldset.HelperText într-un <p> */}
              <Fieldset.HelperText>
                Vă rugăm să introduceți datele dumneavoastră.
              </Fieldset.HelperText>
            </div>
          </Stack>

          <Fieldset.Content>
            <Field label="Nume" color="black">
              <Input
                name="name"
                placeholder="Introduceți numele"
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            <Field label="Adresa de email" color="black">
              <Input
                name="email"
                type="email"
                placeholder="Introduceți adresa de email"
                onChange={(e) => setEmail(e.target.value)}
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

            <Field label="Confirmare parolă" color="black">
              <Flex direction="row" align="center" width="100%" position="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirmare parolă"
                  name="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  width="100%"
                />
                <div
                  style={{
                    position: "absolute",
                    right: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </div>
              </Flex>
            </Field>

            <Field label="Adăugați o fotografie de profil!" color="black">
              <Flex direction="row" align="center" width="100%">
                <Input
                  type="file"
                  p={1.5}
                  accept="image/*"
                  onChange={(e) => postDetails(e.target.files[0])}
                />
              </Flex>
            </Field>
          </Fieldset.Content>
        </Fieldset.Root>

        <SelectRoot
          collection={occupation}
          size="sm"
          width="100%"
          onValueChange={(value) => {
            console.log("Valoare selectată:", value.value);
            setRole(value.value);
          }}  // Aici asigură-te că value este doar valoarea corectă, nu obiectul
        >
          <SelectLabel color={'black'}>Eu sunt...</SelectLabel>
          <SelectTrigger>
            <SelectValueText placeholder="Profesor/Elev" />
          </SelectTrigger>
          <SelectContent>
            {occupation.items.map((roles) => (
              <SelectItem item={roles} key={roles.value} value={roles.value}> {/* `value` trebuie să fie setat corect */}
                {roles.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>

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
          disabled={picLoading || loading} // 🔥 Dezactivăm butonul în timpul încărcării
        >
          {picLoading || loading ? (
            <Spinner size="sm" color="white" />
          ) : (
            "Sign Up"
          )}
        </Button>

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

const occupation = createListCollection({
  items: [
    { label: "Profesor", value: "teacher" },
    { label: "Elev", value: "student" },
  ],
})

export default SignUp;