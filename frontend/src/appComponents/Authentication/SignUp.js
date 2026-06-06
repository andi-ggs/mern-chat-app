import React, { useState } from 'react';
import {
  Button,
  Input,
  Stack,
  Text,
  Icon,
  Spinner,
  Flex,
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
import { FaUser, FaEnvelope, FaImage } from 'react-icons/fa';
import axios from 'axios';
import { useHistory } from "react-router";

const occupation = createListCollection({
  items: [
    { label: "Profesor", value: "teacher" },
    { label: "Elev", value: "student" },
  ],
});

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

  const inputStyles = {
    size: "lg",
    borderRadius: "lg",
    borderColor: "gray.200",
    _hover: { borderColor: 'purple.300' },
    _focus: { borderColor: 'purple.500', boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)' },
  };

  return (
    <Stack spacing={4} w="100%" maxH="60vh" overflowY="auto" pr={1}
      sx={{
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-thumb': { background: '#e2e8f0', borderRadius: '4px' },
      }}
    >
      {message && (
        <Alert
          status={messageType === "success" ? "success" : "error"}
          title={message}
          borderRadius="lg"
        />
      )}

      <Field label="Nume" errorText={nameError} invalid={!!nameError}>
        <InputGroup startElement={<Icon as={FaUser} color="gray.400" boxSize={4} />}>
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
        <InputGroup startElement={<Icon as={FaEnvelope} color="gray.400" boxSize={4} />}>
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
          gap={3}
          p={3}
          border="2px dashed"
          borderColor="gray.200"
          borderRadius="lg"
          _hover={{ borderColor: 'purple.300', bg: 'purple.50' }}
          transition="all 0.2s"
          cursor="pointer"
          position="relative"
        >
          <Icon as={FaImage} color="purple.400" boxSize={5} />
          <Text fontSize="sm" color="gray.500" flex={1}>
            {pic ? 'Imagine încărcată ✓' : 'Alege o imagine (JPEG/PNG)'}
          </Text>
          {picLoading && <Spinner size="sm" color="purple.500" />}
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
          <SelectLabel fontWeight="medium" mb={1}>Eu sunt...</SelectLabel>
          <SelectTrigger borderRadius="lg" borderColor="gray.200" _hover={{ borderColor: 'purple.300' }}>
            <SelectValueText placeholder="Profesor / Elev" />
          </SelectTrigger>
          <SelectContent>
            {occupation.items.map((roles) => (
              <SelectItem item={roles} key={roles.value} value={roles.value}>
                {roles.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
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
        disabled={picLoading || loading}
      >
        {picLoading || loading ? <Spinner size="sm" color="white" /> : 'Creează cont'}
      </Button>

      {onSwitchToLogin && (
        <Text textAlign="center" fontSize="sm" color="gray.500">
          Ai deja cont?{' '}
          <Text
            as="span"
            color="purple.600"
            fontWeight="semibold"
            cursor="pointer"
            _hover={{ textDecoration: 'underline' }}
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
