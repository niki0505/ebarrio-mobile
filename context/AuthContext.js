import React, { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const saveAccessToken = async (token) => {
    await SecureStore.setItemAsync("accessToken", token);
    setAccessToken(token);
  };

  const getAccessToken = async () => {
    return await SecureStore.getItemAsync("accessToken");
  };

  const saveRefreshToken = async (token) => {
    console.log("Saving refresh token:", token);
    await SecureStore.setItemAsync("refreshToken", token);
  };

  const getRefreshToken = async () => {
    return await SecureStore.getItemAsync("refreshToken");
  };

  const logout = async (navigation) => {
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("accessToken");
    setAccessToken(null);
    setIsUserLoggedIn(false);
    if (navigation) {
      navigation.navigate("Login");
    }
  };

  const refreshAccessToken = async (navigation) => {
    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        console.error("No refresh token available.");
        return null;
      }
      console.log("Refreshing token with:", refreshToken);
      const response = await axios.post(
        "http://10.0.2.2:4000/api/auth/refresh",
        { refreshToken }
      );
      setAccessToken(response.data.accessToken);
      return response.data.accessToken;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          console.log("Session expired. Please log in again");
        } else {
          console.error("Error refreshing token", error.response.data);
        }
        logout(navigation);
        return null;
      } else {
        console.error("Network or server error:", error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        saveRefreshToken,
        getRefreshToken,
        refreshAccessToken,
        logout,
        saveAccessToken,
        isUserLoggedIn,
        setIsUserLoggedIn,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
