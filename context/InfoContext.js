import api from "../api";
import React, { createContext, useState, useEffect } from "react";
export const InfoContext = createContext(undefined);

export const InfoProvider = ({ children }) => {
  const [emergencyhotlines, setEmergencyHotlines] = useState([]);

  const fetchEmergencyHotlines = async () => {
    const response = await api.get("/getemergencyhotlines");
    setEmergencyHotlines(response.data);
  };

  return (
    <InfoContext.Provider
      value={{
        emergencyhotlines,
        fetchEmergencyHotlines,
      }}
    >
      {children}
    </InfoContext.Provider>
  );
};
