import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import { InfoContext } from "../context/InfoContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Weather = () => {
  const insets = useSafeAreaInsets();
  const { user } = useContext(AuthContext);
  const { fetchWeather, weather } = useContext(InfoContext);
  const navigation = useNavigation();

  useEffect(() => {
    fetchWeather();

    const intervalId = setInterval(() => {
      fetchWeather();
    }, 300000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    console.log(weather);
  }, [weather]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View
        style={[
          MyStyles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.navigate("BottomTabs")}>
          <Text>Back</Text>
        </TouchableOpacity>
        <Text
          style={{
            padding: 10,
            fontSize: 24,
            color: "#04384E",
            fontWeight: "bold",
          }}
        >
          Weather
        </Text>
        <Text>Current Weather: {weather.currenttemp}</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Weather;
