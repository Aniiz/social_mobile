import { BackHandler, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Feather from '@expo/vector-icons/Feather';
import WelcomeImage from '../../assets/imgs/welcomeImage.png';
import { useState } from "react";

import {
  Container,
  Image,
  Form,
  Text,
  TextInput,
  ButtonContainer,
  ButtonLabel,
  ForgotPasswordLabel,
  TextInputContainer,
  IconArea,
} from "./styles";

import { useAuth } from "../../hooks/auth";
import { isValidEmail } from "../../utils/email";


export function SignUp({ navigation }: any) {
  const [nameInput, setNameInput] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [viewPassword, setViewPassword] = useState<boolean>(false);

  const { signUp } = useAuth();

  async function handleSignUp() {
    try {
      setNameError(null);
      setEmailError(null);
      setPasswordError(null);
      setConfirmPasswordError(null);

      // Validar o email
      if (!nameInput || !nameInput.trim()) {
        setNameError('O nome é obrigatório.');
        return;
      }

      // Validar o email
      if (!emailInput || !emailInput.trim()) {
        setEmailError('O e-mail é obrigatório.');
        return;
      }

      if (!isValidEmail(emailInput)) {
        setEmailError('O e-mail fornecido não é válido.');
        return;
      }

      // Validar a senha
      if (!passwordInput || !passwordInput.trim()) {
        setPasswordError('A senha é obrigatória.');
        return;
      }

      // Validar a confirmação de senha
      if (!confirmPasswordInput || !confirmPasswordInput.trim()) {
        setConfirmPasswordError('A confirmação de senha é obrigatória.');
        return;
      }

      // Verificar se as senhas coincidem
      if (passwordInput !== confirmPasswordInput) {
        setPasswordError('As senhas não coincidem.');
        setConfirmPasswordError('As senhas não coincidem.');
        return;
      }

      await signUp({
        name: nameInput,
        email: emailInput,
        password: passwordInput,
        confirmPassword: confirmPasswordInput,
      });
    } catch (error: any) {
      console.error(error);

      // Verificar se é um erro de credenciais inválidas
      if (error.response && error.response.status === 402) {
        setEmailError('Email informado já está em uso');
      } else if (error.response && error.response.status === 422) {
        setPasswordError('As senhas não coincidem.');
        setConfirmPasswordError('As senhas não coincidem.');
      } else {
        setEmailError('Erro ao tentar criar a conta. Tente novamente mais tarde.');
      }
    }
  }

  return (
    <Container>
      <Image
        source={WelcomeImage}
      />
      <Form>
        <TextInputContainer>
          <TextInput
            placeholder="Digite seu nome"
            onChangeText={(e) => setNameInput(e)}
            placeholderTextColor={"#BDBDBD"}
            autoCapitalize="none"
          />
        </TextInputContainer>
        {nameError && (
          <View style={{ width: '80%' }}>
            <Text style={{ color: 'red', marginTop: 0, marginBottom: -10 }}>{nameError}</Text>
          </View>
        )}
        <TextInputContainer>
          <TextInput
            placeholder="Digite seu e-mail"
            onChangeText={(e) => setEmailInput(e)}
            placeholderTextColor={"#BDBDBD"}
            autoCapitalize="none"
          />
        </TextInputContainer>
        {emailError && (
          <View style={{ width: '80%' }}>
            <Text style={{ color: 'red', marginTop: 0, marginBottom: -10 }}>{emailError}123</Text>
          </View>
        )}
        <TextInputContainer>
          <TextInput
            onChangeText={(e) => setPasswordInput(e)}
            secureTextEntry={!viewPassword}
            placeholderTextColor={"#BDBDBD"}
            placeholder="Digite sua senha"
            autoCapitalize="none"
          />
          <IconArea>
            <Feather name={viewPassword ? 'eye-off' : "eye"} size={20} onPress={() => setViewPassword(!viewPassword)} />
          </IconArea>
        </TextInputContainer>
        {passwordError && (
          <View style={{ width: '80%' }}>
            <Text style={{ color: 'red', marginTop: 0, marginBottom: -10 }}>{passwordError}123</Text>
          </View>
        )}
        <TextInputContainer>
          <TextInput
            onChangeText={(e) => setConfirmPasswordInput(e)}
            secureTextEntry={!viewPassword}
            placeholderTextColor={"#BDBDBD"}
            placeholder="Confirmar senha"
            autoCapitalize="none"
          />
          <IconArea>
            <Feather name={viewPassword ? 'eye-off' : "eye"} size={20} onPress={() => setViewPassword(!viewPassword)} />
          </IconArea>
        </TextInputContainer>
        {confirmPasswordError && (
          <View style={{ width: '80%' }}>
            <Text style={{ color: 'red', marginTop: 0, marginBottom: -10 }}>{confirmPasswordError}123</Text>
          </View>
        )}
        <ButtonContainer
          onPress={handleSignUp}
        >
          <ButtonLabel>Registrar</ButtonLabel>
        </ButtonContainer>

        <View style={{ flexDirection: 'row' }}>
          <Text>Já possui uma conta?</Text>

          <TouchableOpacity onPress={() => navigation.pop()}>
            <Text style={{ color: '#5252C7' }}> Login</Text>
          </TouchableOpacity>
        </View>
      </Form>

    </Container>
  );
}
