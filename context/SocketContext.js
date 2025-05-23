import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { io } from "socket.io-client";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user?.userID) return;

    const newSocket = io("https://ebarrio-mobile-backend.onrender.com");

    newSocket.on("connect", () => {
      newSocket.emit("register", user.userID);
      newSocket.emit("join_announcements");
    });

    newSocket.on("announcement", (announcement) => {
      Alert.alert(
        "🎉 Announcement!",
        announcement.message,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancelled"),
            style: "cancel",
          },
          {
            text: "View Now",
            onPress: () => navigation.navigate("Announcement"),
          },
        ],
        { cancelable: true }
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?.userID, user?.role]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
