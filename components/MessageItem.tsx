import { StyleSheet, View, Text } from "react-native";
import { Message } from "../app/screens/Chat";

export default function MessageItem({ message, userId }: { message: Message, userId: string }) {
    //
    return (

        <View style={[styles.messageContainer, message.sender.id == userId ? styles.userMessage : styles.partnerMessage]}>

            <View style={[styles.messageBubble, message.sender.id == userId ? styles.userBubble : styles.botBubble]}>
                <Text style={styles.messageText}>{message.messageText}</Text>
            </View>
            {/* {item.sender === "user" && (
                <Image source={{ uri: user?.userProfile || "https://via.placeholder.com/50" }} style={styles.avatar} />
            )} */}
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
    partnerMessage: {
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
