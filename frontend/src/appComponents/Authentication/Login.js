import React, { useState } from 'react';
import {
  Button,
  Input,
  Stack,
  Text,
  Icon,
  Spinner,
  Box,
} from '@chakra-ui/react';
import { Field } from "../../components/ui/field";
import { PasswordInput } from "../../components/ui/password-input";
import { InputGroup } from "../../components/ui/input-group";
import { Alert } from "../../components/ui/alert";
import { FaEnvelope } from 'react-icons/fa';
import { useHistory } from "react-router-dom";
import axios from 'axios';

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
  size: 'lg',
  h: '52px',
  borderRadius: 'xl',
  border: '1.5px solid',
  borderColor: 'gray.200',
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

const Login = ({ onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });

  const history = useHistory();

  const emailError = touched.email && !email ? 'Adresa de email este obligatorie' : '';
  const passwordError = touched.password && !password ? 'Parola este obligatorie' : '';

  const submitHandler = async () => {
    setTouched({ email: true, password: true });
    setLoading(true);

    if (!email || !password) {
      setMessage("Te rugăm să completezi toate câmpurile!");
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

      setMessage("Autentificare reușită!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 5000);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/home");
    } catch (error) {
      console.log("Eroare la trimiterea cererii:", error.response?.data || error.message);
      setMessage("Email sau parolă incorectă. Încearcă din nou.");
      setMessageType("error");
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') submitHandler();
  };

  return (
    <Stack spacing={6} w="100%" sx={formStackSx}>
      {message && (
        <Alert
          status={messageType === "success" ? "success" : "error"}
          title={message}
          borderRadius="xl"
          boxShadow="sm"
        />
      )}

      <Field
        label="Adresa de email"
        errorText={emailError}
        invalid={!!emailError}
      >
        <InputGroup startElement={<Icon as={FaEnvelope} color="blue.400" boxSize={4} />}>
          <Input
            name="email"
            type="email"
            placeholder="exemplu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            onKeyDown={handleKeyDown}
            {...inputStyles}
          />
        </InputGroup>
      </Field>

      <Field
        label="Parola"
        errorText={passwordError}
        invalid={!!passwordError}
      >
        <PasswordInput
          placeholder="Introdu parola"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          onKeyDown={handleKeyDown}
          {...inputStyles}
        />
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
          disabled={loading}
        >
          {loading ? <Spinner size="sm" color="white" /> : 'Autentificare'}
        </Button>
      </Box>

      {onSwitchToSignUp && (
        <Text textAlign="center" fontSize="sm" color="gray.500" fontFamily="Inter, sans-serif">
          Nu ai cont?{' '}
          <Text
            as="span"
            color="blue.600"
            fontWeight="bold"
            cursor="pointer"
            transition="color 0.2s"
            _hover={{ color: 'teal.600', textDecoration: 'underline' }}
            onClick={onSwitchToSignUp}
          >
            Înregistrează-te
          </Text>
        </Text>
      )}
    </Stack>
  );
};

export default Login;
