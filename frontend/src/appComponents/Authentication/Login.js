import React, { useState } from 'react';
import {
  Button,
  Input,
  Stack,
  Text,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import { Field } from "../../components/ui/field";
import { PasswordInput } from "../../components/ui/password-input";
import { InputGroup } from "../../components/ui/input-group";
import { Alert } from "../../components/ui/alert";
import { FaEnvelope } from 'react-icons/fa';
import { useHistory } from "react-router-dom";
import axios from 'axios';

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
    <Stack spacing={5} w="100%">
      {message && (
        <Alert
          status={messageType === "success" ? "success" : "error"}
          title={message}
          borderRadius="lg"
        />
      )}

      <Field
        label="Adresa de email"
        errorText={emailError}
        invalid={!!emailError}
      >
        <InputGroup startElement={<Icon as={FaEnvelope} color="gray.400" boxSize={4} />}>
          <Input
            name="email"
            type="email"
            placeholder="exemplu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            onKeyDown={handleKeyDown}
            size="lg"
            borderRadius="lg"
            borderColor="gray.200"
            _hover={{ borderColor: 'purple.300' }}
            _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)' }}
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
          size="lg"
          borderRadius="lg"
          borderColor="gray.200"
          _hover={{ borderColor: 'purple.300' }}
          _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)' }}
        />
      </Field>

      <Button
        size="lg"
        w="100%"
        mt={2}
        borderRadius="xl"
        bgGradient="linear(to-r, #667eea, #764ba2)"
        color="white"
        fontWeight="semibold"
        _hover={{
          bgGradient: "linear(to-r, #5a6fd6, #6a4190)",
          transform: 'translateY(-1px)',
          boxShadow: 'lg',
        }}
        _active={{ transform: 'translateY(0)' }}
        transition="all 0.2s"
        onClick={submitHandler}
        disabled={loading}
      >
        {loading ? <Spinner size="sm" color="white" /> : 'Autentificare'}
      </Button>

      {onSwitchToSignUp && (
        <Text textAlign="center" fontSize="sm" color="gray.500" mt={2}>
          Nu ai cont?{' '}
          <Text
            as="span"
            color="purple.600"
            fontWeight="semibold"
            cursor="pointer"
            _hover={{ textDecoration: 'underline' }}
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
