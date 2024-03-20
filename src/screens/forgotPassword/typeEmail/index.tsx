import { StatusBar, View, Dimensions } from "react-native";
import WelcomeImage from '../../../assets/imgs/welcomeImage.png';
import { useState } from "react";
import forg_pass_logo from '../../../assets/imgs/forg_pass_logo.png'

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
} from "./styles";

import { isValidEmail } from "../../../utils/email";
import theme from "../../../theme";

export function TypeEmail({ navigation }: any) {
    const [emailInput, setEmailInput] = useState<string>("");
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const size = Dimensions.get('window').width * 0.0011

    async function handleSend() {
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

            navigation.navigate('Verification')

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
            <StatusBar translucent backgroundColor="rgba(255,255,255,0.0)" />
            <Image source={WelcomeImage} />

            <Form >
                <ForgotPasswordLabel>Preencha com seu e-mail</ForgotPasswordLabel>

                <View style={{ width: '80%', marginTop: 10, backgroundColor: theme.COLORS.GRAY_100 }}>
                    <Text style={{ color: theme.COLORS.BLACK, padding: 20, borderRadius: 10, textAlign: 'center' }}>Enviaremos instruções de como resetar sua senha.</Text>
                </View>

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
                        <Text style={{ color: 'red', marginTop: 5, marginBottom: 5 }}>{emailError}</Text>
                    </View>
                )}

                <ButtonContainer onPress={handleSend}>
                    <ButtonLabel>Enviar</ButtonLabel>
                </ButtonContainer>

                <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 100 }}>
                    <Image style={{ height: 200 * size, width: 494 * size }} source={forg_pass_logo} />
                </View>
            </Form>

        </Container >
    );
}
