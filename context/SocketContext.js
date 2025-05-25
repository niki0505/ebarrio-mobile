import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { io } from "socket.io-client";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../api";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/getnotifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    if (!user?.userID) return;

    const newSocket = io("https://ebarrio-mobile-backend.onrender.com");

    newSocket.on("connect", () => {
      newSocket.emit("register", user.userID);
      newSocket.emit("join_announcements");
    });

    newSocket.on("announcement", (announcement) => {
      Alert.alert(
        announcement.title,
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

    newSocket.on("certificateUpdate", (certificate) => {
      Alert.alert(
        certificate.title,
        certificate.message,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancelled"),
            style: "cancel",
          },
          {
            text: "View Now",
            onPress: () => navigation.navigate("Status"),
          },
        ],
        { cancelable: true }
      );
    });

    newSocket.on("notificationUpdate", (updatedNotifications) => {
      setNotifications(updatedNotifications);
    });

    newSocket.on("blotterUpdate", (blotter) => {
      Alert.alert(
        blotter.title,
        blotter.message,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancelled"),
            style: "cancel",
          },
          {
            text: "View Now",
            onPress: () => navigation.navigate("Status"),
          },
        ],
        { cancelable: true }
      );
    });

    newSocket.on("reservationUpdate", (res) => {
      Alert.alert(
        res.title,
        res.message,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancelled"),
            style: "cancel",
          },
          {
            text: "View Now",
            onPress: () => navigation.navigate("Status"),
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
    <SocketContext.Provider
      value={{ socket, fetchNotifications, notifications }}
    >
      {children}
    </SocketContext.Provider>
  );
};
