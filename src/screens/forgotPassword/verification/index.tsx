import { StatusBar, View, Dimensions } from "react-native";
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
} from "./styles";

export function Verification({ navigation }: any) {
    const [codeInput, setcodeInput] = useState<string>("");
    const [CodeError, setCodeError] = useState<string | null>(null);
    const [Code, setCode] = useState<string | null>(null);

    const size = Dimensions.get('window').width * 0.0011

    async function handleSend() {
        try {
            setCodeError(null);
            setCode(null);

            if (!codeInput.trim()) {
                setCodeError('O código é obrigatório.');
                return;
            }

            navigation.navigate('NewPassword')

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
                    <Text style={{ color: theme.COLORS.BLACK, padding: 20, borderRadius: 10, textAlign: 'center' }}>Uma mensagem contendo um código de verificação foi enviado para seu email.</Text>
                </View>

                <TextInputContainer>
                    <TextInput
                        value={codeInput}
                        placeholder="Digite o código de verificação"
                        onChangeText={(e) => setcodeInput(e)}
                        placeholderTextColor={"#BDBDBD"}
                        autoCapitalize="none"
                    />
                </TextInputContainer>
                {CodeError && (
                    <View style={{ width: '80%' }}>
                        <Text style={{ color: 'red', marginTop: 5, marginBottom: 5 }}>{CodeError}</Text>
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