import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useAuth, API_URL } from "../context/AuthContext";
import { UserRound } from "lucide-react-native"; 

interface Chat {
  id: string;
  user: { id: string; name: string; avatar?: string };
  lastMessage?: string;
  updatedAt?: string;
}

interface Props {
  onSelectChat: (chatId: string, chatAvatar: string) => void;
}

export default function ChatList({ onSelectChat }: Props) {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const defaultAvatar = "https://via.placeholder.com/50"; 

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(`${API_URL}/chat/user/${user?.userId}`);
        if (!res.ok) throw new Error("Failed to fetch chats");
        const data = await res.json();

        const updatedChats = await Promise.all(
          data.map(async (chat) => {
            try {
              const userRes = await fetch(`${API_URL}/get-user-by-id?UserId=${chat.user.id}`);
              if (!userRes.ok) throw new Error("Failed to fetch user");
              const userData = await userRes.json();
              return {
                ...chat,
                user: {
                  ...chat.user,
                  avatar: userData.userProfile || defaultAvatar,
                },
              };
            } catch (err) {
              console.error("Error fetching user:", err);
              return { ...chat, user: { ...chat.user, avatar: defaultAvatar } };
            }
          })
        );

        setChats(updatedChats);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChats();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Chats</Text>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => onSelectChat(item.id, item.user.avatar || defaultAvatar)}
          >
            {item.user.avatar !== defaultAvatar ? (
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
        )}
      />
    </View>
  );
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
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#2d3748",
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
