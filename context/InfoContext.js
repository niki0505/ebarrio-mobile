import api from "../api";
import React, { createContext, useState, useEffect } from "react";
export const InfoContext = createContext(undefined);

export const InfoProvider = ({ children }) => {
  const [emergencyhotlines, setEmergencyHotlines] = useState([]);
  const [weather, setWeather] = useState([]);
  const [residents, setResidents] = useState([]);
  const [courtreservations, setCourtReservations] = useState([]);

  const fetchEmergencyHotlines = async () => {
    try {
      const response = await api.get("/getemergencyhotlines");
      console.log(response.data);
      setEmergencyHotlines(response.data);
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

  return (
    <InfoContext.Provider
      value={{
        emergencyhotlines,
        weather,
        residents,
        courtreservations,
        fetchEmergencyHotlines,
        fetchWeather,
        fetchResidents,
        fetchReservations,
      }}
    >
      {children}
    </InfoContext.Provider>
  );
};
