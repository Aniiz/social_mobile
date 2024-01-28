import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect
} from "react";
import { api } from "../services/api";
import mime from "mime";
import { Post } from "../@types/posts";
import { useAuth } from "./auth";
import { Platform } from "react-native";
import { getPost } from "../utils/posts/getPost";
import { ProfileData, User } from "../@types/user";

interface IDataContextData {
    posts: Post[];
    userPosts: Post[];
    // userProfileData: ProfileData;
    loading: boolean;
    hasMorePosts: boolean;
    userFollowing: User[];
    userFollowers: User[];
    getPosts: (page?: string, pageSize?: string) => Promise<unknown>;
    getInitialPosts: () => Promise<unknown>;
    likePost: (postId: string) => Promise<void>;
    fetchUserData: () => Promise<void>;
    unlikePost: (postId: number) => Promise<void>;
    getUserInfo: (userId: number) => Promise<any>;
    getProfileData: (userId: string) => Promise<any>;
    addPost: (description: string, images: string[]) => Promise<void>
    getPostLikes: (postId: string, userId?: number | undefined) => Promise<any>;
    getPostComments: (postId: number) => Promise<any>;
}

interface IDataProviderProps {
    children: ReactNode;
}

const DataContext = createContext<IDataContextData>({} as IDataContextData);

function DataProvider({ children }: IDataProviderProps) {
    const { user } = useAuth()
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [userFollowers, setUserFollowers] = useState<User[]>([])
    const [userFollowing, setUserFollowing] = useState<User[]>([])
    const [userCache, setUserCache] = useState(new Map());

    const userCacheKey = "@MyApp:userCache";

    async function getInitialPosts() {
        if (!user?.id) {
            return
        }
        try {
            setLoading(true);
            const response = await api.get(`/feed/posts?page=1&userId=${user?.id}`);

            const postResponse = response.data.posts

            if (postResponse.length % 6 != 0 || postResponse.length == 0) {
                setHasMorePosts(false)
            }
            setPosts(response.data.posts);
            setPage(2);

            return { success: true };
        } catch (error) {
            console.error(error);
            return error;
        } finally {
            setLoading(false);
        }
    }

    async function addPost(description: string, images: string[]) {
        try {

            const newPost = {
                user_id: user?.id,
                description
            }

            const response = await api.post("/feed/post", newPost);

            // Obter o ID do post criado
            const postId = response.data.post.id;

            // // Enviar imagens
            await sendImages(postId, images);

        } catch (error: any) {
            console.error("Erro ao criar post 1:", error);
        }
    }

    async function sendImages(postId: number, images: string[]) {
        try {
            for (let index = 0; index < images.length; index++) {
                const image = images[index];

                const imageObject = {
                    name: `image_${index}.jpg`,
                    uri: Platform.OS === "android" ? image : image.replace("file://", ""),
                    type: mime.getType(image),
                };

                const imageFormData = new FormData();
                imageFormData.append('file', imageObject);
                imageFormData.append("postId", String(postId));

                await api.post(`/feed/post/image`, imageFormData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }
            const newPost = await getPost(postId);
            
            setPosts((prevPosts) => [newPost, ...prevPosts]);
            setUserPosts((prevPosts) => ([newPost, ...prevPosts ]))
        } catch (error) {
            console.error("Erro ao enviar imagens:", error);
            throw error;
        }
    }

    async function loadMorePosts() {
        if (!user?.id || !hasMorePosts) {            
            return
        }
        try {
            setLoading(true);

            const response = await api.get(`/feed/posts?page=${page}&userId=${user?.id}`);

            if (response.data.posts.length > 0) {
                setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
                setPage((prevPage) => prevPage + 1);
                response.data.posts.length % 6 != 0 ? setHasMorePosts(false) : true;
            } else {
                setHasMorePosts(false);
            }

            return { success: true };
        } catch (error) {
            console.error(error);
            return error;
        } finally {
            setLoading(false);
        }
    }

    async function likePost(postId: string) {
        try {
            api.post(`/feed/post/${postId}/like`)
        } catch (error) {
            throw error;
        }
    }

    async function getPostLikes(postId: string) {
        try {
            const response = await api.get(`/feed/post/${postId}/likes?userId=${user?.id || ''}`);

            return response.data;
        } catch (error: any) {
            throw error;
        }
    }

    async function unlikePost(postId: number) {
        try {
            const reponse = await api.delete(`/feed/post/${postId}/unlike`);


            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId ? { ...post, likedPost: false } : post
                )
            );
        } catch (error: any) {
            console.error(error);
            throw error
        }
    }

    const getUserInfo = async (userId: number) => {
        const cachedUser = userCache.get(String((userId)));
        
        if (cachedUser) {
            return cachedUser;
        }
    
        try {
            const response = await api.get(`/profile/${userId}`);
            const userInfo = response.data;
    
            setUserCache((prevCache) => new Map(prevCache.set(userId, userInfo)));

            try {
                setUserCache((prevCache) => {
                    const updatedCache = new Map(prevCache.set(String(userId), userInfo));                    
        
                    try {
                        AsyncStorage.setItem(userCacheKey, JSON.stringify(Object.fromEntries(updatedCache)));
                    } catch (saveError) {
                        console.error("Error saving user info to AsyncStorage:", saveError);
                    }
        
                    return updatedCache;
                });
        
            } catch (saveError) {
                console.error("Error saving user info to AsyncStorage:", saveError);
            }
    
            return userInfo;
        } catch (error) {
            console.error(`Error fetching user info for userId ${userId}:`, error);
            throw error;
        }
    };

    async function getPostComments(postId: number) {
        try {
            const response = await api.get(`/comments/post/${postId}`);
            return response.data.data;
        } catch (error) {
            console.error(`Error fetching comments for post ${postId}:`, error);
            throw error;
        }
    }

    const loadUserCache = async () => {
        try {
            const cachedUsers = await AsyncStorage.getItem(userCacheKey);
            

            if (cachedUsers) {
                try {
                    const parsedCache = JSON.parse(cachedUsers);
                    const cacheMap = new Map(Object.entries(parsedCache));
                    setUserCache(() => (cacheMap));
                } catch (parseError) {
                    console.error("Error parsing user cache:", parseError);
                }
            }
        } catch (error) {
            console.error("Error loading user cache:", error);
        }
    };

    const getProfileData = async (userId: string) => {
        try {
            const { data: {data: profileData}} = await api.get(`profile/${userId}/summary?requestUser=${user.id}`)            
            return profileData;
        } catch (error) {
            console.error("Error parsing user cache:", error);
            return;
        }
    }

    const fetchData = async () => {
        try {
            const profileData: ProfileData = await getProfileData(String(user?.id));

            setUserPosts(profileData.posts);
            setUserFollowing(profileData.following.data);
            setUserFollowers(profileData.followers.data);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    useEffect(() => {

        loadUserCache();
        
    }, []);

    useEffect(() => {
        user ? (Promise.all([getInitialPosts(), fetchData()])) : false;
    }, [user]);

    return (
        <DataContext.Provider
            value={{
                posts,
                loading,
                hasMorePosts,
                userPosts,
                userFollowing,
                userFollowers,
                getPosts: loadMorePosts, // Renomeando para refletir a funcionalidade de carregar mais posts
                getInitialPosts,
                likePost,
                unlikePost,
                fetchUserData: fetchData,
                getPostLikes,
                getPostComments,
                getUserInfo,
                getProfileData,
                addPost
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

function useData(): IDataContextData {
    const context = useContext(DataContext);

    return context;
}

export { DataProvider, useData };