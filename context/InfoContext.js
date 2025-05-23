import api from "../api";
import React, { createContext, useState, useEffect, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const InfoContext = createContext(undefined);

export const InfoProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [emergencyhotlines, setEmergencyHotlines] = useState([]);
  const [weather, setWeather] = useState([]);
  const [residents, setResidents] = useState([]);
  const [courtreservations, setCourtReservations] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [events, setEvents] = useState([]);
  const [services, setServices] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.userID) return;
    const newSocket = io("https://ebarrio-mobile-backend.onrender.com", {
      query: { userID: user.userID, resID: user.resID },
      transports: ["websocket"], // ensure persistent connection
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    newSocket.on("mobile-dbChange", (updatedData) => {
      console.log(
        `[${new Date().toISOString()}] 📦 Received dbChange payload:`,
        updatedData
      );

      if (updatedData.type === "announcements") {
        setAnnouncements(updatedData.data);
        console.log("✅ Announcements updated.");
      } else if (updatedData.type === "services") {
        setServices(updatedData.data);
        console.log("✅ Services updated.");
      } else {
        console.warn("⚠️ Unhandled update type:", updatedData.type);
      }
    });

    newSocket.onAny((event, ...args) => {
      console.log(`📡 [SOCKET] Event received: ${event}`, args);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [user]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements) {
      const announcementEvents = (announcements || [])
        .filter((a) => a.status !== "Archived")
        .filter((a) => a.eventStart && a.eventEnd)
        .map((a) => ({
          title: a.title,
          start: new Date(a.eventStart),
          end: new Date(a.eventEnd),
          color:
            a.category === "General"
              ? "#FF0000"
              : a.category === "Health & Sanitation"
              ? "#FA7020"
              : a.category === "Public Safety & Emergency"
              ? "#FFB200"
              : a.category === "Education & Youth"
              ? "#0E94D3"
              : a.category === "Social Services"
              ? "#CF0ED3"
              : a.category === "Infrastructure"
              ? "#06D001"
              : "#3174ad",
        }));

      setEvents(announcementEvents);
    }
  }, [announcements]);

  useEffect(() => {
    fetchEmergencyHotlines();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await api.get("/getuserdetails");
      setUserDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch user details:", err);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get(`/getservices`);
      setServices(response.data);
    } catch (error) {
      console.error("Failed to fetch user services:", err);
    }
  };

  const fetchEmergencyHotlines = async () => {
    try {
      const response = await api.get("/getemergencyhotlines");
      setEmergencyHotlines(response.data);
      await SecureStore.setItemAsync(
        "emergencyhotlines",
        JSON.stringify(response.data)
      );
    } catch (error) {
      console.error("Failed to fetch emergency hotlines:", err);
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await api.get("/getweather");
      setWeather(response.data);
    } catch (error) {
      console.error("Failed to fetch weather:", err);
    }
  };

  const fetchResidents = async () => {
    try {
      const response = await api.get("/getresidents");
      setResidents(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch residents:", error);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await api.get("/getreservations");
      setCourtReservations(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch reservations:", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get("/getannouncements");
      setAnnouncements(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch reservations:", error);
    }
  };

  // useEffect(() => {
  //   if (!socket) return;
  //   const onDbChange = (updatedData) => {
  //     console.log(
  //       `[${new Date().toISOString()}] 📦 FULL SOCKET PAYLOAD:`,
  //       updatedData.type
  //     );

  //     if (updatedData.type === "announcements") {
  //       setAnnouncements(updatedData.data);
  //       console.log("Announcements updated.");
  //     } else if (updatedData.type === "services") {
  //       setServices(updatedData.data);
  //       console.log("Services updated.");
  //     }
  //   };

  //   socket.on("mobile-dbChange", onDbChange);

  //   return () => {
  //     socket.off("mobile-dbChange", onDbChange);
  //   };
  // }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      <InfoContext.Provider
        value={{
          emergencyhotlines,
          weather,
          residents,
          courtreservations,
          announcements,
          userDetails,
          events,
          services,
          fetchServices,
          fetchUserDetails,
          fetchEmergencyHotlines,
          fetchWeather,
          fetchResidents,
          fetchReservations,
          fetchAnnouncements,
        }}
      >
        {children}
      </InfoContext.Provider>
    </SocketContext.Provider>
  );
};
