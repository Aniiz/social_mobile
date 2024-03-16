import { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../hooks/auth";
import { Container, Header, ImageArea, StatusArea } from "./styles";
import theme from "../../theme";
import { useData } from "../../hooks/data";
import { Post } from "../../@types/posts";
import { api } from "../../services/api";
import { ProfileData, User, UserImage } from "../../@types/user";
import background from "../../assets/imgs/background.png";

export default function ProfileOthers({ navigation, route }: any) {

    const { signOut, user } = useAuth()
    const { getProfileData } = useData()
    const [profilePosts, setProfilePosts] = useState<Post[]>([])
    const [isFriend, setIsFriend] = useState<boolean>(false)
    const [profileFollowers, setProfileFollowers] = useState<number>(0)
    const [profileFollowing, setProfileFollowing] = useState<number>(0)
    const [profileImage, setProfileImage] = useState<UserImage>()
    const [refreshing, setRefreshing] = useState(true)

    const userId = route.params.userId

    const fetchData = async () => {
        try {
            const profileData: ProfileData = await getProfileData(userId);

            setProfileImage(profileData.userImage);
            setProfilePosts(profileData.posts);
            setIsFriend(profileData.isFriend);
            setProfileFollowing(profileData.following);
            setProfileFollowers(profileData.followers);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setRefreshing(false)
        }
    };

    useEffect(() => {
        fetchData();
    }, [getProfileData, userId]);

    const handleFollow = async () => {
        try {
            if (isFriend) {
                await api.post(`profile/unfollow`, {
                    targetUserId: userId,
                });
                setProfileFollowers((prevData) => prevData--);
            } else {
                await api.post(`profile/follow`, {
                    targetUserId: userId,
                });
                setProfileFollowers((prevData) => prevData++);
            }
            // Invertendo o valor de isFriend após a ação
            setIsFriend((prevIsFriend) => !prevIsFriend);
        } catch (error) {
            console.error('Error handling follow/unfollow:', error);
        }
    };

    return (
        <Container
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={fetchData}
                />
            }>

            <Image
                style={styles.background}
                source={background}
            />

            <FlatList
                data={profilePosts?.filter(post => post.post_images && post.post_images.length > 0 && post.post_images[0] != null)}
                ListHeaderComponent={() => (
                    <>

                        <Header>
                            <Text style={{ color: theme.COLORS.WHITE, fontSize: theme.FONT_SIZE.LG, textAlign: 'center', }}>@{route.params.userName}</Text >

                            <ImageArea style={{ marginTop: (Dimensions.get("window").height * 0.04) }}>
                                <Image
                                    style={styles.tinyLogo}
                                    source={{ uri: profileImage?.url || 'https://i.stack.imgur.com/YQu5k.png' }}
                                />
                            </ImageArea>


                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                                <Text style={{ fontWeight: theme.FONT_WEIGHT.BOLD, fontSize: theme.FONT_SIZE.MD }}>{route.params.userName}</Text>
                            </View>

                            <StatusArea style={{ backgroundColor: theme.COLORS.GRAY_200 }}>

                                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ fontWeight: theme.FONT_WEIGHT.BOLD, fontSize: theme.FONT_SIZE.MD, marginRight: 4 }}>{profilePosts.length}</Text>
                                    <Text>Publicações</Text>
                                </View>

                                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ fontWeight: theme.FONT_WEIGHT.BOLD, fontSize: theme.FONT_SIZE.MD, marginRight: 4 }}>{profileFollowers}</Text>
                                    <Text>seguidores</Text>
                                </View>

                                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                    <Text style={{ fontWeight: theme.FONT_WEIGHT.BOLD, fontSize: theme.FONT_SIZE.MD, marginRight: 4 }}>{profileFollowing}</Text>
                                    <Text>Seguindo</Text>
                                </View>
                            </StatusArea>
                        </Header>

                        <View style={{ paddingTop: 20, gap: 10, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <TouchableOpacity
                                onPress={userId == user?.id ? undefined : handleFollow}
                                style={{ paddingVertical: 5, flex: 1, borderRadius: 5, justifyContent: 'center', alignItems: "center", backgroundColor: theme.TEXT.GRAY }}
                                disabled={userId == user?.id}
                            >
                                <Text style={{ fontWeight: theme.FONT_WEIGHT.MEDIUM }}>
                                    {userId == user?.id ? 'Editar Perfil' : isFriend ? 'Deixar de Seguir' : 'Seguir'}
                                </Text>
                            </TouchableOpacity>
                            {userId == user?.id && <TouchableOpacity
                                onPress={signOut}
                                style={{ paddingVertical: 5, flex: 1, borderRadius: 5, justifyContent: 'center', alignItems: "center", backgroundColor: theme.COLORS.PRIMARY }}
                            >
                                <Text style={{ fontWeight: theme.FONT_WEIGHT.MEDIUM, color: 'white' }}>Logout</Text>
                            </TouchableOpacity>}
                        </View>
                    </>
                )}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity
                            style={
                                {
                                    borderRightWidth: index % 3 === 2 ? 0 : 2,
                                    borderBottomWidth: 2,
                                    borderColor: "#fff" // Adiciona margem inferior, exceto para as imagens na última linha
                                }
                            }>
                            <Image
                                style={styles.image}
                                source={{ uri: item.post_images[0].url }}
                                onError={(error) => console.error("Erro na imagem:", error.nativeEvent.error)} />
                        </TouchableOpacity>
                    );
                }}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                numColumns={3}
                contentContainerStyle={styles.contentContainer}
                ListHeaderComponentStyle={{ width: "100%", alignItems: "center", marginBottom: 30, paddingHorizontal: 20 }}
            />
        </Container>
    )
}


const styles = StyleSheet.create({
    tinyLogo: {
        width: 110,
        height: 110,
        borderRadius: 100,
        borderColor: theme.COLORS.WHITE,
        borderWidth: 4.2,
    },
    logo: {
        width: 66,
        height: 58,
    },
    image: {
        width: (Dimensions.get("window").width / 3),
        aspectRatio: 1,
        resizeMode: "contain",
    },
    contentContainer: {
        alignItems: "flex-start",
        width: Dimensions.get("window").width,
        justifyContent: 'flex-start'
    },
    background: {
        width: Dimensions.get("window").width * 2,
        height: Dimensions.get("window").height * 0.47,
        marginTop: -(Dimensions.get("window").height * 0.23),
        marginBottom: -(Dimensions.get("window").height * 0.15),
        borderBottomLeftRadius: Dimensions.get("window").width,
        borderBottomRightRadius: Dimensions.get("window").width,
    }
});