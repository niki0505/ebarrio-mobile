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
import ClearNight from "../assets/weather-svg/clear-night";
import PartlyCloudyDay from "../assets/weather-svg/partly-cloudy-day";
import PartlyCloudyNight from "../assets/weather-svg/partly-cloudy-night";
import Cloudy from "../assets/weather-svg/cloudy";
import OvercastDay from "../assets/weather-svg/overcast-day";
import OvercastNight from "../assets/weather-svg/overcast-night";
import Mist from "../assets/weather-svg/mist";
import Rain from "../assets/weather-svg/rain";
import ExtremeDayRain from "../assets/weather-svg/extreme-day-rain";
import ExtremeNightRain from "../assets/weather-svg/extreme-night-rain";
import ThunderstormsDayRain from "../assets/weather-svg/thunderstorms-day-rain";
import ThunderstormsNightRain from "../assets/weather-svg/thunderstorms-night-rain";
import ThunderstormsDayExtremeRain from "../assets/weather-svg/thunderstorms-day-extreme-rain";
import ThunderstormsNightExtremeRain from "../assets/weather-svg/thunderstorms-night-extreme-rain";
import OvercastDayDrizzle from "../assets/weather-svg/overcast-day-drizzle";
import OvercastNightDrizzle from "../assets/weather-svg/overcast-night-drizzle";
import FogDay from "../assets/weather-svg/fog-day";
import FogNight from "../assets/weather-svg/fog-night";
import ThunderstormsDay from "../assets/weather-svg/thunderstorms-day";
import ThunderstormsNight from "../assets/weather-svg/thunderstorms-night";

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

  const isDayTime = () => {
    const currentHour = new Date().getHours();
    return currentHour >= 6 && currentHour < 18; // Day is between 6 AM and 6 PM
  };

  const getWeatherIcon = (condition, width = 40, height = 40) => {
    if (!condition) return null;

    const normalized = condition.trim().toLowerCase();
    const isDay = isDayTime();

    const iconMap = {
      sunny: isDay ? (
        <ClearDay width={width} height={height} />
      ) : (
        <ClearNight width={width} height={height} />
      ),
      "partly cloudy": isDay ? (
        <PartlyCloudyDay width={width} height={height} />
      ) : (
        <PartlyCloudyNight width={width} height={height} />
      ),
      cloudy: <Cloudy width={width} height={height} />,
      overcast: isDay ? (
        <OvercastDay width={width} height={height} />
      ) : (
        <OvercastNight width={width} height={height} />
      ),
      mist: <Mist width={width} height={height} />,

      "patchy rain possible": isDay ? (
        <Rain width={width} height={height} />
      ) : (
        <Rain width={width} height={height} />
      ),

      "Thundery outbreaks possible": isDay ? (
        <ThunderstormsDay width={width} height={height} />
      ) : (
        <ThunderstormsNight width={width} height={height} />
      ),

      Fog: isDay ? (
        <FogDay width={width} height={height} />
      ) : (
        <FogNight width={width} height={height} />
      ),

      "patchy light drizzle": isDay ? (
        <OvercastDayDrizzle width={width} height={height} />
      ) : (
        <OvercastNightDrizzle width={width} height={height} />
      ),

      "light drizzle": isDay ? (
        <OvercastDayDrizzle width={width} height={height} />
      ) : (
        <OvercastNightDrizzle width={width} height={height} />
      ),

      "patchy light rain": isDay ? (
        <Rain width={width} height={height} />
      ) : (
        <Rain width={width} height={height} />
      ),

      "patchy rain nearby": isDay ? (
        <Rain width={width} height={height} />
      ) : (
        <Rain width={width} height={height} />
      ),

      "light rain": isDay ? (
        <Rain width={width} height={height} />
      ) : (
        <Rain width={width} height={height} />
      ),

      "moderate rain at times": isDay ? (
        <Rain width={width} height={height} />
      ) : (
        <Rain width={width} height={height} />
      ),

      "moderate rain": isDay ? (
        <Rain width={width} height={height} />
      ) : (
        <Rain width={width} height={height} />
      ),

      "heavy rain at times": isDay ? (
        <ExtremeDayRain width={width} height={height} />
      ) : (
        <ExtremeNightRain width={width} height={height} />
      ),

      "heavy rain": isDay ? (
        <ExtremeDayRain width={width} height={height} />
      ) : (
        <ExtremeNightRain width={width} height={height} />
      ),

      "light rain shower": isDay ? (
        <Rain width={width} height={height} />
      ) : (
        <Rain width={width} height={height} />
      ),

      "Moderate or heavy rain shower": isDay ? (
        <Rain width={width} height={height} />
      ) : (
        <Rain width={width} height={height} />
      ),

      "Torrential rain shower": isDay ? (
        <Rain width={width} height={height} />
      ) : (
        <Rain width={width} height={height} />
      ),

      "patchy light rain with thunder": isDay ? (
        <ThunderstormsDayRain width={width} height={height} />
      ) : (
        <ThunderstormsNightRain width={width} height={height} />
      ),

      "moderate or heavy rain with thunder": isDay ? (
        <ThunderstormsDayExtremeRain width={width} height={height} />
      ) : (
        <ThunderstormsNightExtremeRain width={width} height={height} />
      ),

      default: <ClearDay width={width} height={height} />,
    };

    return iconMap[normalized] || iconMap["default"];
  };

  //Background changes based on the condition
  const getGradientColors = (condition) => {
    const normalized = condition?.trim().toLowerCase();

    switch (normalized) {
      case "clear":
        return ["#09A1CB", "#09A1CB", "#045065"];
      case "sunny":
        return ["#09A1CB", "#09A1CB", "#045065"];
      case "partly cloudy":
        return ["#81ADC7", "#81ADC7", "#35576C"];
      case "patchy light drizzle":
        return ["#75ABCC", "#75ABCC", "#04384E"];
      case "light rain shower":
      case "patchy rain nearby":
        return ["#465385", "#465385", "#C1C0C0"];
      case "patchy light rain with thunder":
        return ["#C1C0C0", "#C1C0C0", "#4A4444"];
      default:
        return ["#09A1CB", "#09A1CB", "#045065"];
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors(weather.currentcondition)}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[
        MyStyles.container,
        { paddingTop: insets.top, paddingBottom: 20 },
      ]}
    >
      <ScrollView>
        <MaterialIcons
          onPress={() => navigation.navigate("BottomTabs")}
          name="arrow-back-ios"
          size={24}
          color="#fff"
          style={{ marginTop: 20 }}
        />

        <View style={MyStyles.rowAlignment}>
          <Text style={MyStyles.weatherHeaderText}>Bacoor</Text>
          <Text
            style={{
              color: "#fff",
              fontSize: 16,
              fontFamily: "QuicksandSemiBold",
            }}
          >
            {weather.currentcondition}
          </Text>
        </View>

        <View>
          <Text style={MyStyles.weatherSubheaderText}>Now</Text>
          <Text
            style={[
              MyStyles.weatherHeaderText,
              { fontSize: 50, marginVertical: 0, fontFamily: "REMSemiBold" },
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
          <Text style={[MyStyles.weatherSubheaderText, { marginBottom: 10 }]}>
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
                  style={[
                    MyStyles.weatherBodyText,
                    { fontFamily: "QuicksandMedium" },
                  ]}
                >
                  {Math.round(item.temperature)}°C
                </Text>
                {getWeatherIcon(item.condition, 60, 60)}
                <Text
                  style={[
                    MyStyles.weatherBodyText,
                    { fontFamily: "QuicksandMedium" },
                  ]}
                >
                  {item.time}
                </Text>
              </View>
            )}
          />
        </View>

        {/* 2 Days Forecast */}
        <View style={{ gap: 10 }}>
          <Text style={[MyStyles.weatherSubheaderText]}>2 Days Forecast</Text>

          {/* Tomorrow */}
          <View style={MyStyles.forecastcontentContainer}>
            <Text
              style={[
                MyStyles.weatherBodyText,
                { fontFamily: "QuicksandMedium" },
              ]}
            >
              {formatDate(tomorrowDate)}
            </Text>
            <View style={[MyStyles.rowAlignment, { gap: 10 }]}>
              {getWeatherIcon(tomorrow.condition)}
              <Text
                style={[
                  MyStyles.weatherBodyText,
                  { fontFamily: "QuicksandMedium" },
                ]}
              >
                {Math.round(tomorrow.high)}°C/{Math.round(tomorrow.low)}°C
              </Text>
            </View>
          </View>

          {/* Day After Tomorrow */}
          <View style={MyStyles.forecastcontentContainer}>
            <Text
              style={[
                MyStyles.weatherBodyText,
                { fontFamily: "QuicksandMedium" },
              ]}
            >
              {formatDate(dayAfterTomorrowDate)}
            </Text>
            <View style={[MyStyles.rowAlignment, { gap: 10 }]}>
              {getWeatherIcon(dayAfterTomorrow.condition)}
              <Text
                style={[
                  MyStyles.weatherBodyText,
                  { fontFamily: "QuicksandMedium" },
                ]}
              >
                {Math.round(dayAfterTomorrow.high)}°C/
                {Math.round(dayAfterTomorrow.low)}°C
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Weather;
