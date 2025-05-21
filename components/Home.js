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
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { InfoContext } from "../context/InfoContext";

//ICONS
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from "@expo/vector-icons";

//SERVICES ICONS
import CourtReservation from "../assets/home/basketball.png";
import Blotter from "../assets/home/letter.png";
import Certificate from "../assets/home/stamp.png";
import Status from "../assets/home/status.png";

//WEATHER SVGS
import ClearDay from "../assets/weather-svg/clear-day";
import Drizzle from "../assets/weather-svg/drizzle";
import PartlyCloudyDay from "../assets/weather-svg/partly-cloudy-day";
import Rain from "../assets/weather-svg/rain";

import * as SecureStore from "expo-secure-store";
const Home = () => {
  const insets = useSafeAreaInsets();
  const { logout } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const { fetchWeather, weather, events } = useContext(InfoContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentEvents, setCurrentEvents] = useState([]);

  useEffect(() => {
    const currentevents = events.filter((event) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getFullYear() === currentDate.getFullYear() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getDate() === currentDate.getDate()
      );
    });

    setCurrentEvents(currentevents);
  }, [events, currentDate]);
  useEffect(() => {
    fetchWeather();

    const intervalId = setInterval(() => {
      fetchWeather();
    }, 300000);

    return () => clearInterval(intervalId);
  }, []);

  const getWeatherIcon = (condition, width = 40, height = 40) => {
    if (!condition) return null;

    const normalized = condition.trim().toLowerCase();

    switch (normalized) {
      case "clear":
        return <ClearDay width={width} height={height} />;
      case "sunny":
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
      case "sunny":
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

  const toggleProfile = () => {
    setShowDropdown((prev) => !prev);
  };

  return (
    //to allow detection of taps anywhere outside the dropdown
    <TouchableWithoutFeedback
      onPress={() => {
        setShowDropdown(false);
        Keyboard.dismiss();
      }}
    >
      <SafeAreaView
        style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={[
              MyStyles.scrollContainer,
              {
                paddingBottom: insets.bottom + 70,
                gap: 10,
              },
            ]}
          >
            <View style={MyStyles.rowAlignment}>
              <View>
                <Text style={MyStyles.header}>Home</Text>
                <Text
                  style={{
                    fontSize: 20,
                    color: "#585252",
                    fontFamily: "QuicksandSemiBold",
                  }}
                >
                  Welcome, {user.name}
                </Text>
              </View>

              <View style={{ position: "relative" }}>
                <TouchableOpacity onPress={toggleProfile}>
                  <Image
                    source={{
                      uri: user.picture,
                    }}
                    style={MyStyles.profilePic}
                  />
                </TouchableOpacity>

                {showDropdown && (
                  <View
                    style={{
                      height: "auto",
                      justifyContent: "center",
                      position: "absolute",
                      top: 45,
                      right: 0,
                      backgroundColor: "#fff",
                      padding: 5,
                      borderRadius: 6,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 5,
                      zIndex: 1,
                      minWidth: 150,
                      alignSelf: "flex-end",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setShowDropdown(false);
                        navigation.navigate("AccountSettings");
                      }}
                      style={{
                        paddingVertical: 8,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <MaterialIcons
                        name="settings"
                        size={20}
                        color="#04384E"
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          marginLeft: 3,
                          color: "#04384E",
                          fontFamily: "QuicksandBold",
                        }}
                        onPress={() => navigation.navigate("AccountSettings")}
                      >
                        Account Settings
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setShowDropdown(false);
                        logout(navigation);
                      }}
                      style={{
                        paddingVertical: 8,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <MaterialIcons name="logout" size={24} color="red" />
                      <Text
                        style={{
                          fontSize: 16,
                          color: "red",
                          marginLeft: 3,
                          fontFamily: "QuicksandBold",
                        }}
                      >
                        Logout
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            <View style={[MyStyles.rowAlignment, { gap: 10 }]}>
              <TouchableOpacity
                onPress={() => navigation.navigate("BrgyCalendar")}
                style={[
                  MyStyles.card,
                  {
                    padding: 10,
                    flex: 0,
                    width: 180,
                  },
                ]}
              >
                <Text
                  style={{
                    color: "#BC0F0F",
                    fontSize: 20,
                    fontFamily: "REMSemiBold",
                  }}
                >
                  {currentDate.toLocaleString("en-US", { month: "long" })}
                </Text>
                <Text
                  style={{
                    fontSize: 35,
                    fontWeight: "bold",
                    color: "#04384E",
                    fontFamily: "REMRegular",
                  }}
                >
                  {currentDate.getDate()}
                </Text>

                {currentEvents?.map((event, index) => (
                  <Text
                    key={index}
                    style={{
                      fontSize: 14,
                      color: "#ACACAC",
                      marginRight: 10, // space between items
                    }}
                  >
                    {event.title}
                    {index !== currentEvents.length - 1 ? "," : ""}{" "}
                  </Text>
                ))}
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
                  <Text
                    style={{
                      fontFamily: "REMRegular",
                      fontSize: 16,
                      color: "#fff",
                    }}
                  >
                    Bacoor
                  </Text>
                  <View style={[MyStyles.rowAlignment, { marginLeft: -10 }]}>
                    {getWeatherIcon(weather.currentcondition, 70, 70)}
                    <Text
                      style={{
                        fontFamily: "REMRegular",
                        fontSize: 35,
                        color: "#fff",
                      }}
                    >
                      {weather.currenttemp}°
                    </Text>
                  </View>

                  <Text
                    style={{
                      fontFamily: "QuicksandSemiBold",
                      fontSize: 16,
                      color: "#fff",
                    }}
                  >
                    High:{Math.round(weather.currenthigh)}° Low:
                    {Math.round(weather.currentlow)}°
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {user.role === "Resident" && (
              <>
                <Text
                  style={{
                    color: "#04384E",
                    fontSize: 20,
                    fontFamily: "REMMedium",
                    marginTop: 15,
                  }}
                >
                  Services
                </Text>
                <View
                  style={[
                    MyStyles.card,
                    { justifyContent: "center", alignItems: "center" },
                  ]}
                >
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[
                      MyStyles.rowAlignment,
                      {
                        gap: 10,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Certificates")}
                      style={{ alignItems: "center" }}
                    >
                      <View style={MyStyles.servicesImgContainer}>
                        <Image
                          source={Certificate}
                          style={MyStyles.servicesImg}
                        />
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
                        <Image
                          source={CourtReservation}
                          style={MyStyles.servicesImg}
                        />
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
                  </ScrollView>
                </View>
              </>
            )}

            <Text
              style={{
                color: "#04384E",
                fontSize: 20,
                fontFamily: "REMMedium",
                marginTop: 15,
              }}
            >
              Emergency Tools
            </Text>
            <View
              style={{
                flexDirection: "column",
                gap: 10,
              }}
            >
              <TouchableOpacity style={MyStyles.sosContainer}>
                <Text style={[MyStyles.emergencyTitle, { fontSize: 60 }]}>
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
                  <Text style={MyStyles.emergencyTitle}>HOTLINES</Text>
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
                    alignItems: "center",
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
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Home;
