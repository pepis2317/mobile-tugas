
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { RootStackParamList } from "../../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, useAuth } from "../context/AuthContext";
import MessageItem from "../../components/MessageItem";

export interface Message {
    id: string;
    chatId: string;
    sender: {
        id: string;
        name: string;
    };
    messageText: string;
    createdAt: string;
};

type ChatProps = NativeStackScreenProps<RootStackParamList, "Chat">
export default function Chat({ navigation, route }: ChatProps) {
    const { ChatId } = route.params
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState("")
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`${API_URL}/message/chat/${ChatId}`)
            setMessages(response.data)
            setLoading(false)
        } catch (e) {
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const sendMessage = async () => {
        try {
            const response = await axios.post(`${API_URL}/message`, {
                chatId: ChatId,
                senderId: user?.userId,
                messageText: input
            })
            return response.data
        } catch (e) {
            console.log(e)
            return { error: true, msg: (e as any).response?.data?.detail || "An error occurred" }
        }
    }
    const handleSendPress = async () => {
        if (!input.trim() || !ChatId || !user?.userId) return;
        const newMessage: Message = {
            id: Math.random().toString(),
            messageText: input,
            sender: {
                id: user.userId,
                name: user.userName ? user.userName : "ass"
            },
            createdAt: "ass",
            chatId: ChatId
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInput("");
        const response = await sendMessage()
        if (response.error) {
            console.log(response.msg)
        }
    }
    // const sendMessageHandler = async () => {
    //     if (!input.trim() || !chatId || !user?.userId) return;

    //     const newMessage: Message = {
    //         id: Math.random().toString(),
    //         text: input,
    //         sender: "user",
    //     };

    //     setMessages((prevMessages) => [...prevMessages, newMessage]);
    //     setInput("");

    //     try {
    //         await fetch(`${API_URL}/message`, {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ chatId, senderId: user.userId, messageText: input }),
    //         });

    //         fetchMessages();
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };
    useEffect(() => {
        if (ChatId != "") {
            fetchMessages()
        }
    }, [ChatId])
    useEffect(() => {
        if (user?.userId) {
            setUserId(user.userId)
        }
    }, [user?.userId])
    console.log(ChatId)
    return (
        <View style={{ flex: 1 }}>
            {loading || userId == "" ? <ActivityIndicator size="small" color="#636C7C" style={{ marginTop: 32 }} /> :
                <FlatList data={messages} contentContainerStyle={{ paddingBottom: 100 }} renderItem={({ item, index }) => (
                    <MessageItem key={index} message={item} userId={userId} />
                )} />}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor="#888"
                    value={input}
                    onChangeText={setInput}
                />
                <TouchableOpacity style={styles.sendButton}
                    onPress={handleSendPress}
                >
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1f2937",
        paddingBottom: 10,
    },

    backButton: {
        padding: 15,
        backgroundColor: "#2d3748",
        alignItems: "flex-start",
    },
    backText: {
        fontSize: 16,
        color: "#0A84FF",
        fontWeight: "bold",
    },

    emptyChatContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    largeAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    emptyChatText: {
        color: "#888",
        fontSize: 16,
    },

    messageContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
        paddingHorizontal: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 10,
    },
    iconAvatar: {
        marginHorizontal: 10,
    },

    messageBubble: {
        padding: 12,
        borderRadius: 15,
        maxWidth: "75%",
    },
    userBubble: {
        backgroundColor: "#0A84FF",
        borderBottomRightRadius: 3,
    },
    botBubble: {
        backgroundColor: "#252525",
        borderBottomLeftRadius: 3,
    },

    userMessage: {
        alignSelf: "flex-end",
        flexDirection: "row",
    },
    botMessage: {
        alignSelf: "flex-start",
        flexDirection: "row",
    },

    messageText: {
        color: "white",
        fontSize: 16,
    },

    inputContainer: {
        marginBottom: 50,
        flexDirection: "row",
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#252525",
        backgroundColor: "#1f2937",
        alignItems: "center",
    },
    input: {
        flex: 1,
        padding: 10,
        backgroundColor: "#2d3748",
        color: "#FFF",
        borderRadius: 5,
    },
    sendButton: {
        padding: 12,
        backgroundColor: "#0A84FF",
        marginLeft: 10,
        borderRadius: 5,
    },
    sendText: {
        color: "white",
        fontWeight: "bold",
    },
});
