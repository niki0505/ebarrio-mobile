import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { Alert } from "react-native";

export const useAuthStore = create((set) => ({
  accessToken: null,
  logoutTimer: null,
  accID: null,

  login: async (accessToken) => {
    await AsyncStorage.setItem("accessToken", accessToken);
    try {
      const decoded = jwtDecode(accessToken);
      set({ accessToken, accID: decoded.accID });
    } catch (error) {
      console.error("⚠️ Error decoding token:", error);
      return;
    }

    useAuthStore.getState().startAutoLogout(accessToken);
  },

  logout: async () => {
    Alert.alert("Success", "Log out Successful!");
    console.log("Log out Successful");
    clearTimeout(useAuthStore.getState().logoutTimer);
    await AsyncStorage.removeItem("accessToken");
    set({ accessToken: null, logoutTimer: null, accID: null });
  },

  autologout: async () => {
    Alert.alert("Message", "Token has expired. Please log in again!");
    console.log("Token has expired. Please log in again");
    clearTimeout(useAuthStore.getState().logoutTimer);
    await AsyncStorage.removeItem("accessToken");
    set({ accessToken: null, logoutTimer: null, accID: null });
  },

  startAutoLogout: (accessToken) => {
    try {
      const decoded = jwtDecode(accessToken);
      const expiryTime = decoded.exp * 1000;
      const timeRemaining = expiryTime - Date.now();

      if (timeRemaining <= 0) {
        return useAuthStore.getState().autologout();
      }

      console.log(`⏳ Auto-logout in ${timeRemaining / 1000} seconds`);
      const logoutTimer = setTimeout(() => {
        useAuthStore.getState().autologout();
      }, timeRemaining);

      set({ logoutTimer });
    } catch (error) {
      console.error("Error decoding token:", error);
      useAuthStore.getState().autologout();
    }
  },
  checkTokenExpiry: async () => {
    const storedToken = await AsyncStorage.getItem("accessToken");
    if (!storedToken) {
      console.log("No token found. User is not logged in.");
      return;
    }

    try {
      const decoded = jwtDecode(storedToken);
      if (Date.now() >= decoded.exp * 1000) {
        return useAuthStore.getState().autologout();
      }

      set({ accessToken: storedToken, accID: decoded.accID });
      useAuthStore.getState().startAutoLogout(storedToken);
    } catch (error) {
      console.error("⚠️ Invalid token:", error);
      useAuthStore.getState().autologout();
    }
  },
}));
