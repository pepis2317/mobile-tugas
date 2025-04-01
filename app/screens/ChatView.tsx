import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from "react-native";
import { useAuth, API_URL } from "../context/AuthContext";
import { UserRound } from "lucide-react-native"; 

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot" | "friend";
  senderId?: string;
}

interface User {
  userId: string;
  userProfile?: string;
}

interface Props {
  chatId: string;
  chatAvatar: string;
  onBack: () => void;
}

export default function ChatView({ chatId, chatAvatar, onBack }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/message/chat/${chatId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");

      const data = await res.json();
      if (!Array.isArray(data)) {
        console.warn("Unexpected API response:", data);
        return;
      }

      const newMessages = data.map((msg) => ({
        id: msg.id,
        text: msg.messageText,
        sender: msg.senderId === user?.userId ? "user" : "friend",
        senderId: msg.senderId,
      }));

      setMessages(newMessages);

      const uniqueSenderIds = [...new Set(newMessages.map((m) => m.senderId))].filter((id) => id && id !== user?.userId);
      fetchUserProfiles(uniqueSenderIds);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserProfiles = async (userIds: string[]) => {
    try {
      const profileMap: { [key: string]: string } = {};
      for (const userId of userIds) {
        const res = await fetch(`${API_URL}/api/v1/get-user-by-id?UserId=${userId}`);
        if (res.ok) {
          const data: User = await res.json();
          profileMap[userId] = data.userProfile || ""; 
        }
      }
      setUserProfiles((prev) => ({ ...prev, ...profileMap }));
    } catch (error) {
      console.error("Failed to fetch user profiles:", error);
    }
  };

  const sendMessageHandler = async () => {
    if (!input.trim() || !chatId || !user?.userId) return;

    const newMessage: Message = {
      id: Math.random().toString(),
      text: input,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");

    try {
      await fetch(`${API_URL}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, senderId: user.userId, messageText: input }),
      });

      fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {messages.length === 0 ? (
        <View style={styles.emptyChatContainer}>
          <Image source={{ uri: chatAvatar }} style={styles.largeAvatar} />
          <Text style={styles.emptyChatText}>No messages yet</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            let avatarUri = chatAvatar; 
            if (item.sender === "friend" && item.senderId) {
              avatarUri = userProfiles[item.senderId] || chatAvatar;
            }
            return (
              <View style={[styles.messageContainer, item.sender === "user" ? styles.userMessage : styles.botMessage]}>
                {item.sender !== "user" && (
                  avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={styles.avatar} />
                  ) : (
                    <UserRound size={40} color="#888" style={styles.iconAvatar} />
                  )
                )}
                <View style={[styles.messageBubble, item.sender === "user" ? styles.userBubble : styles.botBubble]}>
                  <Text style={styles.messageText}>{item.text}</Text>
                </View>
                {item.sender === "user" && (
                  <Image source={{ uri: user?.userProfile || "https://via.placeholder.com/50" }} style={styles.avatar} />
                )}
              </View>
            );
          }}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#888"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessageHandler}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
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
    flexDirection: "row-reverse",
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
