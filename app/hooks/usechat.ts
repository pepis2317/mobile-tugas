
import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { Message } from "../../models/Message";

const SIGNALR_URL = "http://192.168.1.3:5252/chatHub";

const useChat = (chatId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!chatId) return;

    // Cegah pembuatan koneksi baru jika sudah ada koneksi yang aktif
    if (connectionRef.current) {
      console.warn("Reusing existing SignalR connection");
      return;
    }

    console.log(`Connecting to SignalR at ${SIGNALR_URL}...`);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_URL, { withCredentials: true }) // Sesuaikan jika butuh credentials
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection
      .start()
      .then(() => {
        console.log("Connected to SignalR 🎉");
        setIsConnected(true);
        return connection.invoke("JoinChat", chatId);
      })
      .catch((err) => {
        console.error("❌ SignalR Connection Error: ", err);
        setIsConnected(false);
      });

    connection.on("ReceiveMessage", (message) => {
      if (!message?.id) return;
      console.log("📩 Received message:", message);

      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        if (existingIds.has(message.id)) return prev;
        return [...prev, message];
      });
    });

    // Handle ketika koneksi terputus
    connection.onclose(() => {
      console.warn("⚠ SignalR Disconnected. Reconnecting...");
      setIsConnected(false);
    });

    connectionRef.current = connection;

    return () => {
      console.log("Disconnecting from SignalR...");
      connection.stop().then(() => {
        setIsConnected(false);
        connectionRef.current = null;
      });
    };
  }, [chatId]);

  const invokeSignalR = async (senderId: string, senderName: string, messageText: string) => {
    if (!connectionRef.current || connectionRef.current.state !== signalR.HubConnectionState.Connected) {
      console.error("❌ Cannot send message: Not connected");
      return;
    }

    try {
      await connectionRef.current.invoke("SendMessage", chatId, senderId, senderName, messageText);
      console.log("✅ Message sent successfully!");
    } catch (err) {
      console.error("❌ SignalR Send Error: ", err);
    }
  };

  return { messages, isConnected, invokeSignalR };
};

export default useChat;