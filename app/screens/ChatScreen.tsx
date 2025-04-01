import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import ChatList from "./ChatList";
import ChatView from "./ChatView";

export default function ChatScreen() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {selectedChatId ? (
        <ChatView chatId={selectedChatId} onBack={() => setSelectedChatId(null)} />
      ) : (
        <ChatList onSelectChat={setSelectedChatId} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", 
  },
});
