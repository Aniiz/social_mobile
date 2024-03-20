
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { SignIn } from "../screens/SignIn";
import { SignUp } from "../screens/signup";
import { Verification } from "../screens/forgotPassword/verification"
import { TypeEmail } from "../screens/forgotPassword/typeEmail"
import { NewPassword } from "../screens/forgotPassword/newPassword";

type AuthRoutes = {
  splash: undefined;
  signIn: undefined;
  signUp: undefined;
  Verification: undefined;
  TypeEmail: undefined;
  NewPassword: undefined;
};

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="signIn" component={SignIn} />
      <Screen name="signUp" component={SignUp} />
      <Screen name="TypeEmail" component={TypeEmail} />
      <Screen name="Verification" component={Verification} />
      <Screen name="NewPassword" component={NewPassword} />
    </Navigator>
  );
}
