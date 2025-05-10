import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ScrollView,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import { InfoContext } from "../context/InfoContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

//WEATHER ICONS
import ClearDay from "../assets/weather-svg/clear-day";
import Drizzle from "../assets/weather-svg/drizzle";
import PartlyCloudyDay from "../assets/weather-svg/partly-cloudy-day";
import Rain from "../assets/weather-svg/rain";

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

  // Function to format the date
  const formatDate = (date) => {
    const options = { weekday: "long", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  // Date calculations for tomorrow and day after tomorrow - pa-check kung tama or accurate to
  const tomorrowDate = new Date(Date.now() + 86400000);
  const dayAfterTomorrowDate = new Date(Date.now() + 86400000 * 2);

  // High and Low
  const tomorrow = weather.tomorrow || {
    high: "--",
    low: "--",
    condition: "N/A",
  };
  const dayAfterTomorrow = weather.dayAfterTomorrow || {
    high: "--",
    low: "--",
    condition: "N/A",
  };

  //Weather icon changes based on condition - pasabi kung ano mga ibang condiiton (e.g. thunderstorms), ito pa lang nakita ko sa api
  const getWeatherIcon = (condition, width = 40, height = 40) => {
    if (!condition) return null;

    const normalized = condition.trim().toLowerCase();

    switch (normalized) {
      case "clear":
        return <ClearDay width={width} height={height} />;
      case "partly cloudy":
        return <PartlyCloudyDay width={width} height={height} />;
      case "patchy light drizzle":
        return <Drizzle width={width} height={height} />;
      case "light rain shower":
      case "patchy rain nearby":
        return <Rain width={width} height={height} />;
      default:
        return null;
    }
  };
  //Background changes based on the condition
  const getGradientColors = (condition) => {
    const normalized = condition?.trim().toLowerCase();

    switch (normalized) {
      case "clear":
        return ["#09A1CB", "#09A1CB", "#045065"];
      case "partly cloudy":
        return ["#81ADC7", "#81ADC7", "#35576C"];
      case "patchy light drizzle":
        return ["#75ABCC", "#75ABCC", "#04384E"];
      case "light rain shower":
      case "patchy rain nearby":
        return ["#888C9B", "#888C9B", "#081318"];
      default:
        return ["#09A1CB", "#09A1CB", "#045065"];
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <LinearGradient
            colors={getGradientColors(weather.currentcondition)}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={[
              MyStyles.container,
              {
                paddingTop: insets.top,
                paddingBottom: 20, // pinalitan ko ng 20 para may margin when scrolled
                flex: 1,
              },
            ]}
          >
            <MaterialIcons
              onPress={() => navigation.navigate("BottomTabs")}
              name="arrow-back-ios"
              size={24}
              color="#fff"
              style={{ marginTop: 20 }}
            />

            <View style={MyStyles.rowAlignment}>
              <Text style={MyStyles.weatherHeaderText}>Bacoor</Text>
              <Text style={{ color: "#fff" }}>{weather.currentcondition}</Text>
            </View>

            <View>
              <Text style={MyStyles.weatherBodyText}>Now</Text>
              <Text
                style={[
                  MyStyles.weatherHeaderText,
                  { fontSize: 50, marginVertical: 0 },
                ]}
              >
                {weather.currenttemp}°
              </Text>
            </View>

            <View style={MyStyles.rowAlignment}>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Text style={MyStyles.weatherBodyText}>
                  High: {weather.currenthigh}
                </Text>
                <Text style={MyStyles.weatherBodyText}>
                  Low: {weather.currentlow}
                </Text>
              </View>

              <Text style={MyStyles.weatherBodyText}>
                Wind: {weather.currentwind}
                <Text>km/h</Text>
              </Text>
            </View>

            <View style={{ alignItems: "center" }}>
              {getWeatherIcon(weather.currentcondition, 240, 240)}
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text
                style={[MyStyles.weatherSubheaderText, { marginBottom: 10 }]}
              >
                Hourly Forecast
              </Text>

              <FlatList
                data={weather.hourlyForecast}
                keyExtractor={(item, index) => index.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={MyStyles.hourlyforecastContainer}>
                    <Text
                      style={[MyStyles.weatherSubheaderText, { fontSize: 16 }]}
                    >
                      {Math.round(item.temperature)}°C
                    </Text>
                    {getWeatherIcon(item.condition, 60, 60)}
                    <Text style={MyStyles.weatherBodyText}>{item.time}</Text>
                  </View>
                )}
              />
            </View>

            {/* 2 Days Forecast */}
            <View style={{ gap: 10 }}>
              <Text style={[MyStyles.weatherSubheaderText]}>
                2 Days Forecast
              </Text>

              {/* Tomorrow */}
              <View style={MyStyles.forecastcontentContainer}>
                <Text style={[MyStyles.weatherBodyText, { fontSize: 16 }]}>
                  {formatDate(tomorrowDate)}
                </Text>
                <View style={[MyStyles.rowAlignment, { gap: 10 }]}>
                  {getWeatherIcon(tomorrow.condition)}
                  <Text style={[MyStyles.weatherBodyText, { fontSize: 16 }]}>
                    {Math.round(tomorrow.high)}°C/{Math.round(tomorrow.low)}°C
                  </Text>
                </View>
              </View>

              {/* Day After Tomorrow */}
              <View style={MyStyles.forecastcontentContainer}>
                <Text style={[MyStyles.weatherBodyText, { fontSize: 16 }]}>
                  {formatDate(dayAfterTomorrowDate)}
                </Text>
                <View style={[MyStyles.rowAlignment, { gap: 10 }]}>
                  {getWeatherIcon(dayAfterTomorrow.condition)}
                  <Text style={[MyStyles.weatherBodyText, { fontSize: 16 }]}>
                    {Math.round(dayAfterTomorrow.high)}°C/
                    {Math.round(dayAfterTomorrow.low)}°C
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Weather;
