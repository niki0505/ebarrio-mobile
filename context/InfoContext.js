import api from "../api";
import React, { createContext, useState, useEffect, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import { SocketContext } from "./SocketContext";

export const InfoContext = createContext(undefined);

export const InfoProvider = ({ children }) => {
  const { socket } = useContext(SocketContext);
  const [emergencyhotlines, setEmergencyHotlines] = useState([]);
  const [weather, setWeather] = useState([]);
  const [residents, setResidents] = useState([]);
  const [courtreservations, setCourtReservations] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [events, setEvents] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements) {
      const announcementEvents = (announcements || [])
        .filter((a) => a.status !== "Archived")
        .filter((a) => a.times)
        .flatMap((a) =>
          Object.entries(a.times).map(([dateKey, timeObj]) => ({
            title: a.title,
            start: new Date(timeObj.starttime),
            end: new Date(timeObj.endtime),
            backgroundColor:
              a.category === "General"
                ? "#4A90E2"
                : a.category === "Health & Sanitation"
                ? "#7ED321"
                : a.category === "Public Safety & Emergency"
                ? "#FF0000"
                : a.category === "Education & Youth"
                ? "#FFD942"
                : a.category === "Social Services"
                ? "#B3B6B7"
                : a.category === "Infrastructure"
                ? "#EC9300"
                : "#3174ad",
          }))
        );

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

  useEffect(() => {
    if (!socket) return;

    const handler = (updatedData) => {
      console.log(updatedData.data);
      if (updatedData.type === "announcements") {
        setAnnouncements(updatedData.data);
      } else if (updatedData.type === "services") {
        setServices(updatedData.data);
      } else if (updatedData.type === "emergencyhotlines") {
        setEmergencyHotlines(updatedData.data);
      }
    };

    socket.on("mobile-dbChange", handler);

    return () => {
      socket.off("mobile-dbChange", handler);
    };
  }, [socket]);

  return (
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
  );
};
