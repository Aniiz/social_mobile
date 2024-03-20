import { View, Text } from "react-native";
import LoginButtonAux from "./LoginButtonAux";
import g_login from '../../assets/imgs/google_login.png';
import f_login from '../../assets/imgs/facebook_login.png';

type PropType = {
    marginTop: number
}

export default function Login_aux({ marginTop }: PropType) {

    return (
        <View style={{ alignContent: 'center', alignItems: 'center', marginTop: marginTop }}>
            <Text>Outras opções de login:</Text>

            <View style={{ flexDirection: 'row' }}>

                <LoginButtonAux source={f_login} />

                <LoginButtonAux source={g_login} />

            </View>
        </View>
    );
}