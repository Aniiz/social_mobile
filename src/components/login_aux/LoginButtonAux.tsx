import { Dimensions, Image, TouchableOpacity, ImageSourcePropType } from "react-native";

type PropType = {
    source: ImageSourcePropType
}

export default function LoginButtonAux({ source }: PropType) {

    const size = Dimensions.get('window').width / 6

    return (
        <TouchableOpacity>
            <Image style={{ height: size, width: size, marginVertical: 15, marginHorizontal: 12 }} source={source} />
        </TouchableOpacity>
    );
}