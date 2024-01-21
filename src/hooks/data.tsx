import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
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

interface IDataContextData {
    posts: Post[];
    userPosts: Post[];
    loading: boolean;
    hasMorePosts: boolean;
    getPosts: (page?: string, pageSize?: string) => Promise<unknown>;
    likePost: (postId: string) => Promise<void>;
    unlikePost: (postId: number) => Promise<void>;
    getUserInfo: (userId: number) => Promise<any>;
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
    const [ userPosts, setUserPosts] = useState<Post[]>([]);

    const userCacheKey = "@MyApp:userCache";

    const userCache: Record<number, any> = {};

    async function getInitialPosts() {
        if (!user?.id) {
            return
        }
        try {
            setLoading(true);

            const response = await api.get(`/feed/posts?page=1&userId=${user?.id}`);
            const userPostsResponse = await api.get(`user/${user?.id}/posts`);

            const responsePosts = userPostsResponse.data.data.posts 
            setUserPosts(responsePosts);
            if (responsePosts.lenght % 6 != 0 || responsePosts.lenght == 0 ) {
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

    // async function addPost(postData: {description: string}) {
    //     await createPost('/feed/post' ,postData)
    // }
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
            console.error("Erro ao criar post:", error);

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
            const {data: {data: {post}}} = await api.get(`/feed/post/${postId}`);
            setPosts((prevPosts) => [post, ...prevPosts]);
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
            console.log(postId);
            
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
        const cachedUser = userCache[userId];
      
        if (cachedUser) { 
          return cachedUser;
        }
      
        try {
          const response = await api.get(`/profile/${userId}`);
          const userInfo = response.data;
      
          // Armazena as informações do usuário em cache
          userCache[userId] = userInfo;
          await AsyncStorage.setItem(userCacheKey, JSON.stringify(userCache));
      
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

    useEffect(() => {
        // Carrega o cache de usuários ao inicializar
        const loadUserCache = async () => {
            try {
                const cachedUsers = await AsyncStorage.getItem(userCacheKey);

                if (cachedUsers) {
                    const parsedCache = JSON.parse(cachedUsers);
                    Object.assign(userCache, parsedCache);
                }
            } catch (error) {
                console.error("Error loading user cache:", error);
            }
        };

        loadUserCache();
    }, []);

    useEffect(() => {
        user ? getInitialPosts() : false;
        
    }, [user]);

    return (
        <DataContext.Provider
            value={{
                posts,
                loading,
                hasMorePosts,
                userPosts,
                getPosts: loadMorePosts, // Renomeando para refletir a funcionalidade de carregar mais posts
                likePost,
                unlikePost,
                getPostLikes,
                getPostComments,
                getUserInfo,
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