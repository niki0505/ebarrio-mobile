import api from "../api";
import React, { createContext, useState, useEffect } from "react";
export const InfoContext = createContext(undefined);

export const InfoProvider = ({ children }) => {
  const [emergencyhotlines, setEmergencyHotlines] = useState([]);
  const [weather, setWeather] = useState([]);

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

  return (
    <InfoContext.Provider
      value={{
        emergencyhotlines,
        weather,
        fetchEmergencyHotlines,
        fetchWeather,
      }}
    >
      {children}
    </InfoContext.Provider>
  );
};
