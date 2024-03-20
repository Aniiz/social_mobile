import { Dimensions } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
  margin-top: 30px;
  align-items: center;
  flex: 1;
  background-color: #fff;
  justify-content: center;
`;

export const Form = styled.View`
  top: -55px;
  background-color: #fff;
  width: 100%;
  padding-top: 30px;
  height: 68%;
  align-items: center;
  border-radius: 40px;
`;

export const CheckboxContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  `;

export const TextInput = styled.TextInput`
  height: 60px;
  flex: 1;
  border-radius: 30px;
  padding-left: 20px;
  background-color: #F3F5F7;
`

export const TextInputContainer = styled.View`
  flex-direction: row;
  height: 60px;
  margin-top: 20px;
  width: 90%;
  align-items: center;
  background-color: #F3F5F7;
  justify-content: space-between;
  border-radius: 30px;
`

export const IconArea = styled.TouchableOpacity`
  width: 40px;
`

export const Label = styled.Text`
  width: 12%;
  padding-left: 5px;
  margin-bottom: -20px;
  margin-left: 15px;
  z-index: 1;
  `;

export const ViewinputLabel = styled.View`
margin-bottom: 30px;
`;

export const ButtonContainer = styled.TouchableOpacity`
  height: 60px;
  width: 90%;
  background-color: #8487F1;
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  margin-top: ${(Dimensions.get("window").height / 40)}px;
`;

export const ButtonLabel = styled.Text`
  color: #FFF;
  font-size: 22px;
  font-weight: 700;
`;

export const Text = styled.Text`
  margin-top: ${(Dimensions.get("window").height / 200)}px;
  font-size: 15px;
`
export const ForgotPasswordLabel = styled.Text`
  color: #5252C7;
  font-size: 15px;
  font-weight: bold;
`

export const ImageAreaContainer = styled.View`
flex: 1;
align-items: center;
`

export const Image = styled.Image`
  width: ${Dimensions.get("window").width}px;
  height: ${(Dimensions.get("window").height / 2.5)}px;
`;