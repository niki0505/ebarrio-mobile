import React, { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import * as Notifications from "expo-notifications";

export default function NotificationSetup() {
  const [expoPushToken, setExpoPushToken] = useState("");

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        console.log("Expo Push Token:", token);
        setExpoPushToken(token);
      })
      .catch((err) => {
        console.log("Error getting push token:", err);
        Alert.alert("Failed to get push token", err.message || "Unknown error");
      });
  }, []);

  async function registerForPushNotificationsAsync() {
    let { status } = await Notifications.getPermissionsAsync();

    if (status !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      status = newStatus;
    }

    const isGranted = status === "granted";

    if (!isGranted) {
      Alert.alert("Permission not granted for notifications!");
      return;
    }

    console.log("Permission granted!");

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  }

  return null; // or your app UI
}
