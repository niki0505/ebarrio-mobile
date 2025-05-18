import api from "../api";
import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const InfoContext = createContext(undefined);

const socket = io("https://ebarrio-mobile-backend.onrender.com");

export const InfoProvider = ({ children }) => {
  const [emergencyhotlines, setEmergencyHotlines] = useState([]);
  const [weather, setWeather] = useState([]);
  const [residents, setResidents] = useState([]);
  const [courtreservations, setCourtReservations] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements) {
      const announcementEvents = (announcements || [])
        .filter((a) => a.eventStart && a.eventEnd)
        .map((a) => ({
          title: a.title,
          start: new Date(a.eventStart),
          end: new Date(a.eventEnd),
          color:
            a.category === "General"
              ? "#E3DE48"
              : a.category === "Public Safety & Emergency"
              ? "#FA7020"
              : a.category === "Health & Sanitation"
              ? "#E3DE48"
              : a.category === "Social Services"
              ? "#50C700"
              : a.category === "Infrastructure"
              ? "#0E94D3"
              : a.category === "Education & Youth"
              ? "#1E0ED3"
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
    socket.on("dbChange", (updatedData) => {
      if (updatedData.type === "announcements") {
        setAnnouncements(updatedData.data);
      }
    });

    return () => {
      socket.off("dbChange");
    };
  }, []);

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
