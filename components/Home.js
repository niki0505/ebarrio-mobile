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
import api from "../api";

//ICONS
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";

//SERVICES ICONS
import CourtReservation from "../assets/home/basketball.png";
import Blotter from "../assets/home/letter.png";
import Certificate from "../assets/home/stamp.png";
import Status from "../assets/home/status.png";
import Check from "../assets/home/check.png";
import SOS from "../assets/home/sos.png";

//WEATHER SVGS
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

      "patchy rain nearby": isDay ? (
        <Rain width={width} height={height} />
      ) : (
        <Rain width={width} height={height} />
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

  const viewEmergencyHotlines = async () => {
    const action = "Emergency Hotlines";
    const description = "User viewed emergency hotlines.";
    try {
      await api.post("/logactivity", { action, description });
      navigation.navigate("EmergencyHotlines");
    } catch (error) {
      console.log("Error in viewing emergency hotlines", error);
    }
  };

  const viewReadiness = async () => {
    const action = "Readiness";
    const description = "User viewed readiness.";
    try {
      await api.post("/logactivity", { action, description });
      navigation.navigate("Readiness");
    } catch (error) {
      console.log("Error in viewing readiness", error);
    }
  };

  const viewWeather = async () => {
    const action = "Weather";
    const description = "User viewed weather.";
    try {
      await api.post("/logactivity", { action, description });
      navigation.navigate("Weather");
    } catch (error) {
      console.log("Error in viewing weather", error);
    }
  };

  const viewCalendar = async () => {
    const action = "Barangay Calendar";
    const description = "User viewed barangay calendar.";
    try {
      await api.post("/logactivity", { action, description });
      navigation.navigate("BrgyCalendar");
    } catch (error) {
      console.log("Error in viewing barangay calendar", error);
    }
  };

  const handleConfirm = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            logout();
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    // To allow detection of taps anywhere outside the dropdown
    <TouchableWithoutFeedback
      onPress={() => {
        setShowDropdown(false);
        Keyboard.dismiss();
      }}
    >
      <SafeAreaView
        style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }}
      >
        <>
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
                    source={{ uri: user.picture }}
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
                      >
                        Account Settings
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setShowDropdown(false);
                        handleConfirm();
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
                onPress={viewCalendar}
                style={[
                  MyStyles.card,
                  {
                    padding: 10,
                    flex: 0,
                    width: 180,
                  },
                ]}
              >
                <ScrollView horizontal={false} style={{ marginTop: 5 }}>
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
                        marginRight: 10,
                      }}
                    >
                      {event.title}
                      {index !== currentEvents.length - 1 ? "," : ""}{" "}
                    </Text>
                  ))}
                </ScrollView>
              </TouchableOpacity>

              <TouchableOpacity onPress={viewWeather} style={MyStyles.card}>
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
                    contentContainerStyle={[MyStyles.rowAlignment, { gap: 10 }]}
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
                      <Text style={MyStyles.servicesTitle}>Document</Text>
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
            <View style={{ flexDirection: "column", gap: 10 }}>
              <View>
                {user.role !== "Resident" && (
                  <View style={{ flexDirection: "column", gap: 10 }}>
                    <TouchableOpacity style={MyStyles.sosContainer}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "80%",
                          marginLeft: 30,
                        }}
                      >
                        <Image source={SOS} style={MyStyles.servicesImg} />
                        <Text
                          style={[
                            MyStyles.emergencyTitle,
                            { fontSize: 25, marginLeft: 15 },
                          ]}
                        >
                          SOS REQUESTS
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={MyStyles.sosContainer}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "80%",
                          marginLeft: 30,
                        }}
                      >
                        <Image source={Check} style={MyStyles.servicesImg} />
                        <Text
                          style={[
                            MyStyles.emergencyTitle,
                            { fontSize: 25, marginLeft: 15 },
                          ]}
                        >
                          RESPONDED SOS
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {user.role === "Resident" && (
                <TouchableOpacity
                  style={MyStyles.sosContainer}
                  onPress={() => navigation.navigate("SOS")}
                >
                  <Text style={[MyStyles.emergencyTitle, { fontSize: 60 }]}>
                    SOS
                  </Text>
                </TouchableOpacity>
              )}

              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity
                  style={[
                    MyStyles.sosContainer,
                    {
                      flex: 1,
                      flexDirection: "column",
                      alignItems: "center",
                    },
                  ]}
                  onPress={viewReadiness}
                >
                  <MaterialCommunityIcons
                    name="lightbulb-on"
                    size={50}
                    color="#fff"
                  />
                  <Text style={MyStyles.emergencyTitle}>READINESS</Text>
                  <Text style={MyStyles.emergencyMessage}>
                    Stay Smart, Stay Safe
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={viewEmergencyHotlines}
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

              <TouchableOpacity
                style={MyStyles.sosContainer}
                onPress={() => navigation.navigate("RiverSnapshots")}
              >
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

          {user.role === "Resident" && (
            <>
              {/* Fixed Floating Chat Button */}
              <TouchableOpacity
                onPress={() => navigation.navigate("Chat")}
                style={{
                  position: "absolute",
                  bottom: insets.bottom + 60,
                  right: 20,
                  backgroundColor: "#fff",
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  elevation: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View onPress={() => navigation.navigate("Chat")}>
                  <Ionicons
                    name="chatbubble-ellipses"
                    size={30}
                    color="#0E94D3"
                  />
                </View>
              </TouchableOpacity>
            </>
          )}
        </>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Home;
