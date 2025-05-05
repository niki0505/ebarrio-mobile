import React, { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import api, { setupInterceptors } from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigation = useNavigation();
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkRefreshToken = async () => {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      console.log("Got Refresh Token", refreshToken);
      if (!refreshToken) {
        console.log("No refresh token found. User needs to login.");
        setIsAuthenticated(false);
        return;
      }
      try {
        const response = await axios.post(
          "https://ebarrio-mobile-backend.onrender.com/api/checkrefreshtoken",
          {
            refreshToken,
          }
        );
        console.log("You have a token");
        setUser(response.data.decoded);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Axios error:", error.message);
        setIsAuthenticated(false);
      }
    };
    checkRefreshToken();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await axios.post(
        "https://ebarrio-mobile-backend.onrender.com/api/login",
        credentials
      );

      const { accessToken, refreshToken, user } = res.data;

      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken);

      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  const logout = async () => {
    try {
      const res = await api.post("/logout", {
        userID: user.userID,
      });
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("accessToken");
      setUser(null);
      setIsAuthenticated(false);
      navigation.navigate("Login");
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    setupInterceptors(logout);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        isAuthenticated,
        logout,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
