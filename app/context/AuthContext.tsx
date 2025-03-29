import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store'
import { AppState } from "react-native";
import { jwtDecode } from "jwt-decode";

interface AuthProps {
    user?: User | null
    authState?: { token: string | null; refreshToken: string | null; authenticated: boolean | null; }
    onRegister?: (username: string, email: string, password: string, phone: string, address:string, birthDate:string, gender:string) => Promise<any>
    onLogin?: (email: string, password: string) => Promise<any>
    onLogout?: () => Promise<any>
    onUserUpdate?:(user: User)=> Promise<any>
}
export interface User {
    userEmail: string | null
    userProfile: string | null
    userPhoneNumber: string | null
    userAddress: string | null
    birthDate : string | null
    gender: string | null
    userBalance: number | null
    userId: string | null
    userName: string | null,
    userPassword: string | null
}
const TOKEN_KEY = "access_token"
const REFRESH_TOKEN_KEY = "refresh_token"
const USER_DATA_KEY = "user_data"
export const API_URL = "http://192.168.68.231:5252/api/v1"
const AuthContext = createContext<AuthProps>({})

export const useAuth = () => {
    return useContext(AuthContext)
}
export default function AuthProvider({ children }: any) {
    const [authState, setAuthState] = useState<{
        token: string | null
        refreshToken: string | null
        authenticated: boolean | null
    }>({
        token: null,
        refreshToken: null,
        authenticated: null
    })
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    
    const register = async (username: string, email: string, password: string, phone: string, address:string, birthDate:string, gender:string) => {
        try {
            const response = await axios.post(`${API_URL}/register-user`, {
                UserName: username,
                UserPassword: password,
                UserPhoneNumber: phone,
                UserEmail: email,
                UserAddress: address,
                BirthDate: birthDate,
                Gender: gender
            })
            
            return response.data
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const updateUser = async (user:User)=>{
        setUser(user)
        await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user))
    }
    const login = async (email: string, password: string) => {
        try {
            const result = await axios.post(`${API_URL}/user-login`, null, {
                params: {
                    Email: email,
                    Password: password
                }
            })

            let token = result.data.token
            let refreshToken = result.data.refreshToken
            await SecureStore.setItemAsync(TOKEN_KEY, token)
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken)
            const user = await getUserData()
            user.userPassword = password
            // console.log(user)
            await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(user))
            setAuthState({
                token,
                refreshToken,
                authenticated: true,
            })
            setUser(user)
            return result.data
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const getFromToken = async () => {
        try {
            const token = await SecureStore.getItemAsync(TOKEN_KEY)
            const result = await axios.get(`${API_URL}/user-data`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return result.data
        } catch (e) {
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const getUserData = async () => {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        if (token && refreshToken) {
            try {
                let data = await getFromToken()
                if (data.error) {
                    console.log("expired token")
                    const refresh = await refreshAccessToken()
                    if (refresh.error) {
                        console.log("Expired refresh token, logging you out");
                        logout()
                        return
                    }
                    data = await getFromToken()
                }
                return data
            } catch (e) {
                return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
            }
        } else {
            logout()
        }
    }
    const refreshAccessToken = async () => {
        try {
            const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
            if (refreshToken == null) {
                return null;
            }
            const response = await axios.post(`${API_URL}/refresh-token`, {
                RefreshToken: refreshToken
            })
            let token = response.data.token
            await SecureStore.setItemAsync(TOKEN_KEY, token)

            return token;
        } catch (e) {
            return { error: true, msg: (e as any).response?.data?.msg || "An error occurred" }
        }
    }
    const logout = async () => {
        setAuthState({ token: null, refreshToken: null, authenticated: false })
        setUser(null)
        await SecureStore.deleteItemAsync(TOKEN_KEY)
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
        await SecureStore.deleteItemAsync(USER_DATA_KEY)
    };
    const checkAuthState = async () => {
        console.log("checking auth state")
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        if (token && refreshToken) {
            try {
                const decoded = jwtDecode(token)
                const currentTime = Date.now() / 1000
                if (!decoded.exp) {
                    logout()
                    return
                }
                if (decoded.exp <= currentTime) {
                    console.log("Expired token, retrying with refresh token");
                    const refresh = await refreshAccessToken()
                    if (refresh.error) {
                        console.log("Expired refresh token, logging you out");
                        logout()
                        return
                    }
                }
            } catch (e) {
                console.log("Error decoding token, logging out");
                logout()
                return
            }

            setAuthState({ token, refreshToken, authenticated: true });
        } else {
            logout();
        }
    };
    useEffect(() => {
        // console.log(user?.userId)
        //72dc2364-fdde-40c9-a6e7-5d9c3c87a06b
        checkAuthState()
        const loadUserData = async () => {
            const storedUser = await SecureStore.getItemAsync(USER_DATA_KEY);
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        };
        loadUserData();
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (nextAppState == "active") {
                checkAuthState();
            }
        })
        return () => subscription.remove();
    }, []);

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        onUserUpdate: updateUser,
        authState,
        user,
        loading
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}