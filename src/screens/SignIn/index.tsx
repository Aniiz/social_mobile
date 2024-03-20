import { BackHandler, StatusBar, TouchableOpacity, View, Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Feather from '@expo/vector-icons/Feather';
import WelcomeImage from '../../assets/imgs/welcomeImage.png';
import { useState, useCallback } from "react";
import Login_aux from "../../components/login_aux/Login_aux";

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

export function SignIn({ navigation }: any) {
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [viewPassword, setViewPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { signIn, user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true; // Prevent going back to splash screen
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );


  async function handleSignIn() {
    try {
      setEmailError(null);
      setPasswordError(null);

      // Validar o e-mail
      if (!emailInput.trim()) {
        setEmailError('O e-mail é obrigatório.');
        return;
      }

      if (!isValidEmail(emailInput)) {
        setEmailError('O e-mail fornecido não é válido.');
        return;
      }

      // Validar a senha
      if (!passwordInput.trim()) {
        setPasswordError('A senha é obrigatória.');
        return;
      }

      const response = await signIn({
        email: emailInput,
        password: passwordInput,
      });
    } catch (error: any) {
      console.error(error);

      // Verificar se é um erro de credenciais inválidas
      if (error.response && error.response.status === 401) {
        setEmailError('Credenciais inválidas. Verifique sua senha');
      } else if (error.response && error.response.status === 404) {
        setEmailError('Endereço de email não encontrado');
      } else {
        setEmailError('Erro ao tentar fazer login. Tente novamente mais tarde.');
      }
    }
  }


  return (
    <Container>
      <StatusBar
        translucent
        backgroundColor="rgba(255,255,255,0.0)"
      />
      <Image
        source={WelcomeImage}
      />
      <Form>
        <TextInputContainer>
          <TextInput
            value={emailInput}
            placeholder="Digite seu e-mail"
            onChangeText={(e) => setEmailInput(e)}
            placeholderTextColor={"#BDBDBD"}
            autoCapitalize="none"
          />
        </TextInputContainer>
        {emailError && (
          <View style={{ width: '80%' }}>
            <Text style={{ color: 'red', marginTop: 5 }}>{emailError}</Text>
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
            <Text style={{ color: 'red', marginTop: 5 }}>{passwordError}</Text>
          </View>
        )}
        <TouchableOpacity onPress={() => navigation.navigate('TypeEmail')}>
          <ForgotPasswordLabel>ESQUECI MINHA SENHA</ForgotPasswordLabel>
        </TouchableOpacity>

        <ButtonContainer onPress={handleSignIn}>
          <ButtonLabel>LOG IN</ButtonLabel>
        </ButtonContainer>

        <Login_aux marginTop={Dimensions.get('window').height / 40} />

        <View style={{ flexDirection: 'row' }}>
          <Text>Não possui uma conta?</Text>

          <TouchableOpacity onPress={() => navigation.navigate('signUp')}>
            <Text style={{ color: '#5252C7' }}> Registre-se</Text>
          </TouchableOpacity>
        </View>
      </Form>

    </Container >
  );
}
