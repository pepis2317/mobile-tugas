import { UserRound } from "lucide-react-native";
import { Chat } from "../app/screens/Chats";
import { StyleSheet, TouchableOpacity, Image, Text, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useNavigation } from "@react-navigation/native";

type NavigationType = NativeStackNavigationProp<RootStackParamList>;
export default function ChatItem({ item }: { item: Chat }) {
    const navigation = useNavigation<NavigationType>();

    return (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={()=>navigation.navigate("Chat", {ChatId :item.id})}
        >
            {item.user.avatar != undefined ? (
                <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            ) : (
                <View style={styles.iconAvatar}>
                    <UserRound size={50} color="#AAA" />
                </View>
            )}

            <View style={styles.chatInfo}>
                <Text style={styles.chatTitle}>{item.user.name}</Text>
                {item.lastMessage && <Text style={styles.lastMessage}>{item.lastMessage}</Text>}
            </View>
            <Text style={styles.timestamp}>
                {item.updatedAt ? new Date(item.updatedAt).toLocaleTimeString() : ""}
            </Text>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1f2937",
        paddingTop: 20,
    },
    header: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 10,
    },
    chatItem: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 15,
        borderStyle: 'solid', borderColor: '#31363F', borderBottomWidth: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    iconAvatar: {
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    chatInfo: {
        flex: 1,
    },
    chatTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFF",
    },
    lastMessage: {
        fontSize: 14,
        color: "#AAA",
    },
    timestamp: {
        fontSize: 12,
        color: "#666",
    },
});
