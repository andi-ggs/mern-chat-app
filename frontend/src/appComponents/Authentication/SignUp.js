import React, { useState } from 'react';
import {
  Button,
  Input,
  Stack,
  Text,
  Icon,
  Spinner,
  Flex,
  Box,
  createListCollection,
} from '@chakra-ui/react';
import { Field } from "../../components/ui/field";
import { PasswordInput } from "../../components/ui/password-input";
import { InputGroup } from "../../components/ui/input-group";
import { Alert } from "../../components/ui/alert";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../../components/ui/select";
import { FaUser, FaEnvelope, FaImage, FaCloudUploadAlt } from 'react-icons/fa';
import axios from 'axios';
import { useHistory } from "react-router";

const occupation = createListCollection({
  items: [
    { label: "Profesor", value: "teacher" },
    { label: "Elev", value: "student" },
  ],
});

const formStackSx = {
  '& label': {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 'semibold',
    fontSize: 'sm',
    color: 'var(--chakra-colors-gray-700)',
    marginBottom: '6px',
  },
};

const inputStyles = {
  size: "lg",
  h: '52px',
  borderRadius: "xl",
  border: '1.5px solid',
  borderColor: "gray.200",
  bg: 'gray.50',
  fontFamily: 'Inter, sans-serif',
  fontSize: 'md',
  boxShadow: 'sm',
  transition: 'all 0.2s',
  _hover: {
    borderColor: 'blue.300',
    bg: 'white',
    boxShadow: 'md',
  },
  _focus: {
    borderColor: 'blue.500',
    bg: 'white',
    boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.15)',
  },
  _placeholder: {
    color: 'gray.400',
  },
};

const selectTriggerStyles = {
  h: '52px',
  borderRadius: 'xl',
  border: '1.5px solid',
  borderColor: 'gray.200',
  bg: 'gray.50',
  fontFamily: 'Inter, sans-serif',
  boxShadow: 'sm',
  transition: 'all 0.2s',
  _hover: {
    borderColor: 'blue.300',
    bg: 'white',
    boxShadow: 'md',
  },
};

const SignUp = ({ onSwitchToLogin }) => {
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
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    role: false,
  });

  const nameError = touched.name && !name ? 'Numele este obligatoriu' : '';
  const emailError = touched.email && !email ? 'Emailul este obligatoriu' : '';
  const passwordError = touched.password && !password ? 'Parola este obligatorie' : '';
  const confirmError = touched.confirmPassword && confirmPassword !== password
    ? 'Parolele nu coincid'
    : touched.confirmPassword && !confirmPassword
      ? 'Confirmarea parolei este obligatorie'
      : '';
  const roleError = touched.role && !role ? 'Selectează rolul tău' : '';

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      setMessage("Te rog selectează o imagine");
      setMessageType("error");
      setPicLoading(false);
      setTimeout(() => setMessage(""), 5000);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "ask-a-teacher");
      data.append("cloud_name", "dlnfse038");
      axios.post("https://api.cloudinary.com/v1_1/dlnfse038/image/upload", data, {
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then((response) => {
          setPic(response.data.url.toString());
          setPicLoading(false);
          setMessage("Imagine încărcată cu succes!");
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
      setMessage("Selectează un format valid (JPEG sau PNG)!");
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
      setPicLoading(false);
    }
  };

  const submitHandler = async () => {
    setTouched({ name: true, email: true, password: true, confirmPassword: true, role: true });
    setLoading(true);

    if (!name || !email || !password || !confirmPassword || !role) {
      setMessage("Te rugăm să completezi toate câmpurile!");
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Parolele nu coincid!");
      setMessageType("error");
      setTimeout(() => setMessage(""), 5000);
      setLoading(false);
      return;
    }

    const roleValue = Array.isArray(role) ? role[0] : role;

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

      setMessage("Înregistrare reușită!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 5000);

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/home");
    } catch (error) {
      console.log("Eroare la trimiterea cererii:", error.response?.data || error.message);
      setMessage("A apărut o eroare. Încearcă din nou.");
      setMessageType("error");
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      spacing={5}
      w="100%"
      maxH="62vh"
      overflowY="auto"
      pr={2}
      sx={{
        ...formStackSx,
        '&::-webkit-scrollbar': { width: '6px' },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': {
          background: '#cbd5e1',
          borderRadius: '8px',
        },
        '&::-webkit-scrollbar-thumb:hover': { background: '#94a3b8' },
      }}
    >
      {message && (
        <Alert
          status={messageType === "success" ? "success" : "error"}
          title={message}
          borderRadius="xl"
          boxShadow="sm"
        />
      )}

      <Field label="Nume" errorText={nameError} invalid={!!nameError}>
        <InputGroup startElement={<Icon as={FaUser} color="blue.400" boxSize={4} />}>
          <Input
            name="name"
            placeholder="Introdu numele complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            {...inputStyles}
          />
        </InputGroup>
      </Field>

      <Field label="Adresa de email" errorText={emailError} invalid={!!emailError}>
        <InputGroup startElement={<Icon as={FaEnvelope} color="blue.400" boxSize={4} />}>
          <Input
            name="email"
            type="email"
            placeholder="exemplu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            {...inputStyles}
          />
        </InputGroup>
      </Field>

      <Field label="Parola" errorText={passwordError} invalid={!!passwordError}>
        <PasswordInput
          placeholder="Alege o parolă"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          {...inputStyles}
        />
      </Field>

      <Field label="Confirmare parolă" errorText={confirmError} invalid={!!confirmError}>
        <PasswordInput
          placeholder="Confirmă parola"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
          {...inputStyles}
        />
      </Field>

      <Field label="Fotografie de profil">
        <Flex
          align="center"
          gap={4}
          px={5}
          py={4}
          minH="52px"
          border="2px dashed"
          borderColor={pic ? 'teal.300' : 'gray.200'}
          borderRadius="xl"
          bg={pic ? 'teal.50' : 'gray.50'}
          boxShadow="sm"
          _hover={{
            borderColor: 'blue.400',
            bg: pic ? 'teal.50' : 'blue.50',
            boxShadow: 'md',
          }}
          transition="all 0.25s"
          cursor="pointer"
          position="relative"
        >
          <Flex
            w="40px"
            h="40px"
            minW="40px"
            borderRadius="lg"
            bg={pic ? 'teal.100' : 'blue.100'}
            align="center"
            justify="center"
          >
            <Icon as={pic ? FaImage : FaCloudUploadAlt} color={pic ? 'teal.500' : 'blue.500'} boxSize={4} />
          </Flex>
          <Box flex={1}>
            <Text fontSize="sm" fontWeight="semibold" color={pic ? 'teal.700' : 'gray.700'} fontFamily="Inter, sans-serif">
              {pic ? 'Imagine încărcată cu succes' : 'Alege o imagine de profil'}
            </Text>
            <Text fontSize="xs" color="gray.500" fontFamily="Inter, sans-serif">
              Formate acceptate: JPEG, PNG
            </Text>
          </Box>
          {picLoading && <Spinner size="sm" color="blue.500" />}
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
            position="absolute"
            inset={0}
            opacity={0}
            cursor="pointer"
            height="100%"
          />
        </Flex>
      </Field>

      <Field errorText={roleError} invalid={!!roleError}>
        <SelectRoot
          collection={occupation}
          size="lg"
          width="100%"
          onValueChange={(value) => {
            setRole(value.value);
            setTouched((t) => ({ ...t, role: true }));
          }}
        >
          <SelectLabel fontWeight="semibold" mb={1.5} fontFamily="Inter, sans-serif" fontSize="sm" color="gray.700">
            Eu sunt...
          </SelectLabel>
          <SelectTrigger {...selectTriggerStyles}>
            <SelectValueText placeholder="Profesor / Elev" />
          </SelectTrigger>
          <SelectContent borderRadius="xl" boxShadow="lg">
            {occupation.items.map((roles) => (
              <SelectItem item={roles} key={roles.value} value={roles.value}>
                {roles.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      </Field>

      <Box pt={1}>
        <Button
          size="lg"
          w="100%"
          h="54px"
          borderRadius="xl"
          bgGradient="linear(to-r, #2563eb, #0d9488)"
          color="white"
          fontWeight="bold"
          fontSize="md"
          fontFamily="Inter, sans-serif"
          letterSpacing="0.01em"
          boxShadow="md"
          _hover={{
            bgGradient: "linear(to-r, #1d4ed8, #0f766e)",
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          }}
          _active={{ transform: 'translateY(0)', boxShadow: 'md' }}
          transition="all 0.25s ease"
          onClick={submitHandler}
          disabled={picLoading || loading}
        >
          {picLoading || loading ? <Spinner size="sm" color="white" /> : 'Creează cont'}
        </Button>
      </Box>

      {onSwitchToLogin && (
        <Text textAlign="center" fontSize="sm" color="gray.500" fontFamily="Inter, sans-serif" pb={2}>
          Ai deja cont?{' '}
          <Text
            as="span"
            color="blue.600"
            fontWeight="bold"
            cursor="pointer"
            transition="color 0.2s"
            _hover={{ color: 'teal.600', textDecoration: 'underline' }}
            onClick={onSwitchToLogin}
          >
            Autentifică-te
          </Text>
        </Text>
      )}
    </Stack>
  );
};

export default SignUp;
