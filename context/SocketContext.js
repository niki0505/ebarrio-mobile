import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AuthContext } from "./AuthContext";
import { io } from "socket.io-client";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../api";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const navigation = useNavigation();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null); // ✅ Persistent ref

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/getnotifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    if (!user?.userID || socketRef.current) return;

    const socket = io("https://api.ebarrio.online", {
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("register", user.userID, user.role);
      socket.emit("join_announcements");
    });

    socket.on("announcement", (announcement) => {
      Alert.alert(
        announcement.title,
        announcement.message,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "View Now",
            onPress: () => navigation.navigate("Announcements"),
          },
        ],
        { cancelable: true }
      );
    });

    socket.on("certificateUpdate", (certificate) => {
      Alert.alert(
        certificate.title,
        certificate.message,
        [
          { text: "Cancel", style: "cancel" },
          { text: "View Now", onPress: () => navigation.navigate("Status") },
        ],
        { cancelable: true }
      );
    });

    socket.on("notificationUpdate", setNotifications);

    socket.on("blotterUpdate", (blotter) => {
      Alert.alert(
        blotter.title,
        blotter.message,
        [
          { text: "Cancel", style: "cancel" },
          { text: "View Now", onPress: () => navigation.navigate("Status") },
        ],
        { cancelable: true }
      );
    });

    socket.on("reservationUpdate", (res) => {
      Alert.alert(
        res.title,
        res.message,
        [
          { text: "Cancel", style: "cancel" },
          { text: "View Now", onPress: () => navigation.navigate("Status") },
        ],
        { cancelable: true }
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.userID, user?.role]);

  useEffect(() => {
    if (!isAuthenticated && socketRef.current && user?.userID) {
      socketRef.current.emit("unregister", user.userID);
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        fetchNotifications,
        notifications,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
