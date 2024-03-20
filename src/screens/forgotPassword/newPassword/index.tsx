import { StatusBar, View, Dimensions } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import WelcomeImage from '../../../assets/imgs/welcomeImage.png';
import { useState, } from "react";
import theme from "../../../theme";
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
    IconArea,
} from "./styles";

export function NewPassword({ navigation }: any) {
    const [CodeError, setCodeError] = useState<string | null>(null);
    const [viewPassword, setViewPassword] = useState<boolean>(false);
    const [passwordInput, setPasswordInput] = useState<string>("");
    const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

    const size = Dimensions.get('window').width * 0.0011

    async function handleSend() {
        try {
            setPasswordError(null);
            setConfirmPasswordError(null);

            // Validar a senha
            if (!passwordInput || !passwordInput.trim()) {
                console.log(passwordInput)
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

            navigation.navigate('signIn')
        } catch (error: any) {
            console.error(error);

        }
    }

    return (
        <Container>
            <StatusBar translucent backgroundColor="rgba(255,255,255,0.0)" />
            <Image source={WelcomeImage} />

            <Form>
                <ForgotPasswordLabel>Verificação</ForgotPasswordLabel>

                <View style={{ width: '80%', marginTop: 10, backgroundColor: theme.COLORS.GRAY_100 }}>
                    <Text style={{ color: theme.COLORS.BLACK, padding: 20, borderRadius: 10, textAlign: 'center' }}>Digite senha sua nova.</Text>
                </View>

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
                        <Text style={{ color: 'red', marginTop: 0, marginBottom: -10 }}>{passwordError}</Text>
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
                        <Text style={{ color: 'red', marginTop: 0, marginBottom: -10 }}>{confirmPasswordError}</Text>
                    </View>
                )}

                <ButtonContainer onPress={handleSend}>
                    <ButtonLabel>Verificar</ButtonLabel>
                </ButtonContainer>

                <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 100 }}>
                    <Image style={{ height: 200 * size, width: 494 * size }} source={forg_pass_logo} />
                </View>
            </Form>

        </Container >
    );
}