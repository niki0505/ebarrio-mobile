import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { InfoContext } from "../context/InfoContext";

//SERVICES ICONS
import profilePic from "../assets/changedp.png";
import CourtReservation from "../assets/home/basketball.png";
import Blotter from "../assets/home/letter.png";
import Certificate from "../assets/home/stamp.png";
import Status from "../assets/home/status.png";

//WEATHER SVGS
import ClearDay from "../assets/weather-svg/clear-day";
import Drizzle from "../assets/weather-svg/drizzle";
import PartlyCloudyDay from "../assets/weather-svg/partly-cloudy-day";
import Rain from "../assets/weather-svg/rain";

const Home = () => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const { fetchWeather, weather } = useContext(InfoContext);

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
        return ["#81ADC7", "#81ADC7", "#30576C"];
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
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#fff" }} // para hindi nago-overlap sa status bar when scrolled
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            MyStyles.scrollContainer,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom + 70,
              gap: 10,
            },
          ]}
        >
          <View style={MyStyles.rowAlignment}>
            <View>
              <Text style={[MyStyles.header, { marginBottom: 0 }]}>Home</Text>
              <Text style={{ fontSize: 20, color: "gray" }}>Welcome, User</Text>
            </View>

            <View>
              <Image source={profilePic} style={MyStyles.profilePic} />
            </View>
          </View>

          <View style={[MyStyles.rowAlignment, { gap: 10 }]}>
            <TouchableOpacity style={[MyStyles.card, { padding: 10 }]}>
              <Text
                style={{
                  textAlign: "start",
                  color: "red",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                May
              </Text>
              <Text
                style={{ textAlign: "start", fontSize: 20, fontWeight: "bold" }}
              >
                01
              </Text>
              <Text style={{ textAlign: "start", fontSize: 16 }}>
                Clean-Up Drive
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Weather")}
              style={MyStyles.card}
            >
              <LinearGradient
                colors={getGradientColors(weather.currentcondition)}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={[MyStyles.gradientBackground]}
              >
                <Text style={MyStyles.weatherBodyText}>Bacoor</Text>
                <View style={[MyStyles.rowAlignment, { marginLeft: -10 }]}>
                  {getWeatherIcon(weather.currentcondition, 80, 80)}
                  <Text
                    style={[MyStyles.weatherHeaderText, { marginVertical: 0 }]}
                  >
                    {weather.currenttemp}
                  </Text>
                </View>

                <Text style={[MyStyles.weatherBodyText]}>
                  High:{Math.round(weather.currenthigh)}° Low:
                  {Math.round(weather.currentlow)}°
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={[MyStyles.header, { marginBottom: 0, fontSize: 20 }]}>
            Services
          </Text>
          <View
            style={[
              MyStyles.card,
              MyStyles.rowAlignment,
              {
                flex: 0,
                gap: 10,
                justifyContent: "center",
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("Certificates")}
              style={{ alignItems: "center" }}
            >
              <View style={MyStyles.servicesImgContainer}>
                <Image source={Certificate} style={MyStyles.servicesImg} />
              </View>
              <Text style={MyStyles.servicesTitle}>Certificate</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Blotter")}
              style={{ alignItems: "center" }}
            >
              <View style={MyStyles.servicesImgContainer}>
                <Image source={Blotter} style={MyStyles.servicesImg} />
              </View>
              <Text style={MyStyles.servicesTitle}>Blotter</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("CourtReservations")}
              style={{ alignItems: "center" }}
            >
              <View style={MyStyles.servicesImgContainer}>
                <Image source={CourtReservation} style={MyStyles.servicesImg} />
              </View>
              <Text style={MyStyles.servicesTitle}>Reservation</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Status")}
              style={{ alignItems: "center" }}
            >
              <View style={MyStyles.servicesImgContainer}>
                <Image source={Status} style={MyStyles.servicesImg} />
              </View>
              <Text style={MyStyles.servicesTitle}>Status</Text>
            </TouchableOpacity>
          </View>

          <Text style={[MyStyles.header, { marginBottom: 0, fontSize: 20 }]}>
            Emergency Tools
          </Text>
          <View
            style={{
              flexDirection: "column",
              gap: 10,
            }}
          >
            <TouchableOpacity style={MyStyles.sosContainer}>
              <Text style={[MyStyles.emergencyTitle, { fontSize: 40 }]}>
                SOS
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
              }}
            >
              <TouchableOpacity
                style={[
                  MyStyles.sosContainer,
                  {
                    flex: 1,
                    flexDirection: "column",
                    alignItems: "center",
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="lightbulb-on"
                  size={50}
                  color="#fff"
                />
                <Text style={MyStyles.emergencyTitle}>SAFETY TIPS</Text>
                <Text style={MyStyles.emergencyMessage}>
                  Stay Smart, Stay Safe
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("EmergencyHotlines")}
                style={[
                  MyStyles.sosContainer,
                  {
                    flex: 1,
                    flexDirection: "column",
                    alignItems: "center",
                  },
                ]}
              >
                <MaterialIcons name="call" size={50} color="#fff" />
                <Text style={MyStyles.emergencyTitle}>EMERGENCY HOTLINES</Text>
                <Text style={MyStyles.emergencyMessage}>
                  Call for Assistance
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={MyStyles.sosContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="cctv"
                  size={50}
                  color="#fff"
                  style={{ transform: [{ rotateY: "180deg" }] }}
                />
                <View style={{ textAlign: "start" }}>
                  <Text style={MyStyles.emergencyTitle}>MONITOR RIVER</Text>
                  <Text style={MyStyles.emergencyMessage}>
                    Observe Water-Level
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <Text onPress={() => logout(navigation)}>Logout</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Home;
