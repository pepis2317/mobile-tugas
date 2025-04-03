import { useCallback, useEffect, useState } from "react";
import { View, FlatList, Text, RefreshControl, ActivityIndicator } from "react-native";
import { API_URL, useAuth } from "../context/AuthContext";
import axios from "axios";
import ChatItem from "../../components/ChatItem";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
export interface Chat {
    id: string;
    user: { id: string; name: string; avatar?: string };
    lastMessage?: string;
    updatedAt?: string;
}
type ChatsProps = NativeStackScreenProps<RootStackParamList, "Chats">
export default function Chats({navigation}:ChatsProps) {
    const [chats, setChats] = useState<Chat[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const { user } = useAuth()
    const fetchChats = async () => {
        try {
            const response = await axios.get(`${API_URL}/chat/user/${user?.userId}`)
            setChats(response.data)
            setLoading(false)
            setRefreshing(false)
        } catch (e) {
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    
    const onRefresh = useCallback(() => {
        setLoading(true)
        setRefreshing(true)
        fetchChats()
    }, [])
    useEffect(() => {
        if (user?.userId) {
            fetchChats()
        }
    }, [user])
    useFocusEffect(
        useCallback(() => {
            setLoading(true)
            setRefreshing(true)
            fetchChats()
        }, [])
    );
    return (
        <View>
            {loading ? <ActivityIndicator size="small" color="#636C7C" style={{ marginTop: 32 }} /> :
                <FlatList
                    data={chats}
                    renderItem={({ item, index }) => (
                        <ChatItem item={item} key={index} />
                    )}
                    contentContainerStyle={{ paddingBottom: 300 }} // Adds spacing at the bottom
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    } />}
        </View>
    )
}