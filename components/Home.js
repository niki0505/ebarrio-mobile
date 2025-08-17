import {
  Text,
  View,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { InfoContext } from "../context/InfoContext";
import api from "../api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Aniban2Logo from "../assets/aniban2logo.png";

//ICONS
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import EvilIcons from "@expo/vector-icons/EvilIcons";

//SERVICES ICONS
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
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const { fetchWeather, weather, events } = useContext(InfoContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentEvents, setCurrentEvents] = useState([]);
  dayjs.extend(relativeTime);
  const { fetchAnnouncements, announcements } = useContext(InfoContext);
  const [expandedAnnouncements, setExpandedAnnouncements] = useState([]);
  const [visible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true); // Start loading
      await fetchAnnouncements();
      await fetchWeather();
      setLoading(false);
    };
    load();
  }, []);

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
    const fetchData = async () => {
      setLoadingWeather(true);
      await fetchWeather();
      setLoadingWeather(false);
    };

    fetchData();

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

  //Announcements Carousel
  const { width } = Dimensions.get("window");
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const importantAnnouncements = announcements.filter(
    (element) => element.status === "Pinned"
  );

  const renderContent = (importantAnnouncements) => {
    const words = importantAnnouncements.content.split(" ");
    const isLong = words.length > 100;
    const isExpanded = expandedAnnouncements.includes(
      importantAnnouncements._id
    );
    const displayText = isExpanded
      ? importantAnnouncements.content
      : words.slice(0, 100).join(" ") + (isLong ? "..." : "");

    const contentStyle = importantAnnouncements.picture
      ? { maxHeight: 60, overflow: "hidden" }
      : {};

    return (
      <View style={{ marginVertical: 10 }}>
        {importantAnnouncements.eventdetails !== "" && (
          <Text style={MyStyles.eventDateTime}>
            {importantAnnouncements.eventdetails}
          </Text>
        )}
        <Text
          style={[MyStyles.eventText, contentStyle]}
          numberOfLines={importantAnnouncements.picture ? 3 : 0}
        >
          {displayText}
        </Text>
        {isLong && (
          <Text
            style={MyStyles.seeMoreText}
            onPress={() => navigation.navigate("Announcements")}
          >
            {isExpanded ? "" : "See more"}
          </Text>
        )}
      </View>
    );
  };

  useEffect(() => {
    if (importantAnnouncements.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex =
        currentIndex === importantAnnouncements.length - 1
          ? 0
          : currentIndex + 1;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, importantAnnouncements.length]);

  // Calendar data
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = Array(firstDay)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  return (
    // To allow detection of taps anywhere outside the dropdown
    <TouchableWithoutFeedback
      onPress={() => {
        setShowDropdown(false);
        Keyboard.dismiss();
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: "#DCE5EB",
        }}
      >
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#04384E" />
            <Text
              style={{
                marginTop: 20,
                fontSize: 12,
                color: "#808080",
                fontFamily: "QuicksandSemiBold",
                textAlign: "center",
                lineHeight: 20,
                width: "80%",
              }}
            >
              Hang in there! We're fetching the latest data for you.
              {"\n"}This may take a few seconds...
            </Text>
          </View>
        ) : (
          <>
            <View style={MyStyles.notScrollWrapper}>
              <View
                style={[
                  MyStyles.rowAlignment,
                  { paddingHorizontal: 20, paddingVertical: 10 },
                ]}
              >
                <View style={MyStyles.rowAlignment}>
                  <Entypo
                    name="menu"
                    size={35}
                    color="#04384E"
                    onPress={() => navigation.openDrawer()}
                    style={MyStyles.burgerIcon}
                  />
                  <View>
                    <Text style={MyStyles.header}>Home</Text>
                  </View>
                </View>

                {user.role === "Resident" && (
                  <Ionicons
                    name="chatbubble-ellipses"
                    size={30}
                    color="#04384E"
                    onPress={() => navigation.navigate("Chat")}
                  ></Ionicons>
                )}
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                  MyStyles.scrollContainer,
                  {
                    paddingBottom: insets.bottom + 70,
                    gap: 10,
                  },
                ]}
              >
                <View style={{ width: width - 40, paddingHorizontal: 10 }}>
                  <TouchableOpacity
                    style={[styles.container]}
                    onPress={viewCalendar}
                  >
                    {/* Left panel */}
                    <View style={styles.left}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={styles.bigDate}>
                          {currentDate.getDate()}
                        </Text>

                        <View style={{ marginLeft: 10 }}>
                          <Text style={styles.monthText}>
                            {currentDate.toLocaleString("en-US", {
                              month: "long",
                            })}
                          </Text>
                          <Text style={styles.weekText}>
                            {currentDate.toLocaleString("en-US", {
                              weekday: "long",
                            })}
                          </Text>
                        </View>
                      </View>

                      <View>
                        {events.length > 0 ? (
                          <>
                            {events
                              .filter(
                                (event) => new Date(event.end) >= new Date()
                              )
                              .slice(0, 2)
                              .map((event, index) => {
                                const startDate = new Date(event.start);
                                const endDate = new Date(event.end);

                                const dateString = startDate.toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                );

                                const timeString = `${startDate.toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                    timeZone: "Asia/Manila",
                                  }
                                )} – ${endDate.toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                  timeZone: "Asia/Manila",
                                })}`;

                                return (
                                  <View key={index} style={{ marginBottom: 8 }}>
                                    <View style={styles.dotAndTitle}>
                                      <View
                                        style={[
                                          styles.blueDot,
                                          {
                                            backgroundColor:
                                              event.backgroundColor ||
                                              "#0E94D3",
                                          },
                                        ]}
                                      />
                                      <Text
                                        style={styles.eventTitle}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                      >
                                        {event.title}
                                      </Text>
                                    </View>
                                    <Text style={styles.eventDate}>
                                      {dateString}
                                    </Text>
                                    <Text style={styles.eventTime}>
                                      {timeString}
                                    </Text>
                                  </View>
                                );
                              })}

                            {events.filter(
                              (event) => new Date(event.end) >= new Date()
                            ).length > 2 && (
                              <Text
                                style={{
                                  fontStyle: "italic",
                                  color: "#666",
                                }}
                              >
                                More events...
                              </Text>
                            )}
                          </>
                        ) : (
                          <Text style={styles.noEvents}>
                            NO EVENTS AT THE MOMENT
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Right panel */}
                    <View style={styles.right}>
                      <Text style={styles.monthHeader}>
                        {currentDate.toLocaleString("en-US", { month: "long" })}{" "}
                        {year}
                      </Text>

                      <View style={styles.weekRow}>
                        {weekDays.map((d, i) => (
                          <Text key={i} style={styles.weekDay}>
                            {d}
                          </Text>
                        ))}
                      </View>

                      <View style={styles.calendarContainer}>
                        {calendarDays.map((item, index) => (
                          <View key={index} style={styles.dayCell}>
                            {item ? (
                              <View
                                style={[
                                  styles.dayWrapper,
                                  item === currentDate.getDate() &&
                                    styles.currentDay,
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.dayText,
                                    item === currentDate.getDate() &&
                                      styles.currentDayText,
                                  ]}
                                >
                                  {item}
                                </Text>
                              </View>
                            ) : (
                              <Text style={styles.emptyCell}></Text>
                            )}
                          </View>
                        ))}
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                {loadingWeather ? (
                  <View
                    style={{
                      width: width - 40,
                      paddingHorizontal: 10,
                    }}
                  >
                    <View style={[MyStyles.card]}>
                      <ActivityIndicator size="large" color="#04384E" />
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      width: width - 40,
                      paddingHorizontal: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={viewWeather}
                      style={[
                        {
                          height: "auto",
                          flex: 1,
                          borderRadius: 10,
                          backgroundColor: "#fff",
                          justifyContent: "center",
                          alignItems: "center",
                          overflow: "hidden",
                        },
                      ]}
                    >
                      <LinearGradient
                        colors={getGradientColors(weather.currentcondition)}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={[
                          MyStyles.gradientBackground,
                          {
                            width: "100%",
                            height: "100%",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            padding: 10,
                          },
                        ]}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            marginBottom: -10,
                          }}
                        >
                          <View style={{ flexDirection: "row" }}>
                            <EvilIcons
                              name="location"
                              size={24}
                              color="white"
                            />
                            <Text
                              style={{
                                fontSize: 14,
                                color: "white",
                                fontFamily: "QuicksandSemiBold",
                              }}
                            >
                              Aniban 2
                            </Text>
                          </View>

                          <View
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {getWeatherIcon(weather.currentcondition, 40, 40)}
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Text
                            style={[
                              MyStyles.weatherCurrTemp,
                              { fontSize: 40, marginLeft: 6 },
                            ]}
                          >
                            {weather.currenttemp}°
                          </Text>

                          <Text
                            style={{
                              fontFamily: "QuicksandBold",
                              fontSize: 14,
                              color: "#fff",
                              marginTop: 20,
                            }}
                          >
                            {weather.currentcondition}
                          </Text>
                        </View>
                        <FlatList
                          data={weather.hourlyForecast.slice(0, 5)}
                          keyExtractor={(item, index) => index.toString()}
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          renderItem={({ item }) => (
                            <View
                              style={[
                                MyStyles.hourlyforecastContainer,
                                { width: 65 },
                              ]}
                            >
                              <Text
                                style={[
                                  MyStyles.weatherBodyText,
                                  {
                                    fontFamily: "QuicksandRegular",
                                    fontSize: 14,
                                  },
                                ]}
                              >
                                {item.time
                                  .replace(/^0/, "")
                                  .replace(":00 ", "")}
                              </Text>

                              {getWeatherIcon(item.condition, 30, 30)}
                              <Text
                                style={[
                                  MyStyles.weatherBodyText,
                                  {
                                    fontFamily: "QuicksandBold",
                                    fontSize: 14,
                                  },
                                ]}
                              >
                                {Math.round(item.temperature)}°C
                              </Text>
                            </View>
                          )}
                        />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={MyStyles.rowAlignment}>
                  <Text style={MyStyles.subHeader}>
                    Important Announcements
                  </Text>

                  <Text
                    onPress={() => navigation.navigate("Announcements")}
                    style={[
                      MyStyles.subHeader,
                      { textDecorationLine: "underline", fontSize: 16 },
                    ]}
                  >
                    View All
                  </Text>
                </View>

                {loading ? (
                  <View style={{ padding: 20, alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#04384E" />
                  </View>
                ) : importantAnnouncements.length === 0 ? (
                  <View style={[MyStyles.carouselCard, { width: width - 40 }]}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "QuicksandMedium",
                        textAlign: "justify",
                        color: "#808080",
                      }}
                    >
                      NO IMPORTANT ANNOUNCEMENTS YET. GO TO ANNOUNCEMENTS PAGE
                      TO VIEW ALL ANNOUNCEMENTS.
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    ref={flatListRef}
                    data={importantAnnouncements}
                    keyExtractor={(item) => item._id}
                    horizontal
                    pagingEnabled
                    snapToInterval={width}
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    getItemLayout={(data, index) => ({
                      length: width - 40,
                      offset: (width - 40) * index,
                      index,
                    })}
                    renderItem={({ item }) => (
                      <View
                        style={[
                          {
                            width: width - 40,
                            padding: 10,
                          },
                        ]}
                      >
                        <View
                          style={{
                            height: 400,
                            overflow: "hidden",
                            backgroundColor: "white",
                            borderRadius: 10,
                            padding: 10,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                          }}
                        >
                          {/* Top Header Row */}
                          <View style={MyStyles.rowAlignment}>
                            <View style={MyStyles.rowAlignment}>
                              <Image
                                source={Aniban2Logo}
                                style={MyStyles.announcementLogo}
                              />
                              <View style={{ marginLeft: 5 }}>
                                <Text style={MyStyles.announcementUploader}>
                                  Barangay Aniban 2
                                </Text>
                                <Text style={MyStyles.announcementCreatedAt}>
                                  {dayjs(item.createdAt).fromNow()}
                                </Text>
                              </View>
                            </View>
                          </View>

                          {/* Body */}
                          <View style={{ marginVertical: 10 }}>
                            <Text style={MyStyles.announcementCategory}>
                              {item.category}
                            </Text>
                            <Text style={MyStyles.announcementTitle}>
                              {item.title}
                            </Text>

                            {item.picture && item.picture.trim() !== "" && (
                              <TouchableOpacity
                                onPress={() => {
                                  setSelectedImage([{ uri: item.picture }]);
                                  setIsVisible(true);
                                }}
                              >
                                <Image
                                  source={{ uri: item.picture }}
                                  style={MyStyles.homeAnnouncementImg}
                                  resizeMode="cover"
                                />
                              </TouchableOpacity>
                            )}

                            {renderContent(item)}
                          </View>
                        </View>
                      </View>
                    )}
                  />
                )}

                <Text style={MyStyles.subHeader}>Emergency Tools</Text>
                <View style={MyStyles.emergencyToolsCol}>
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
                        <Text style={MyStyles.emergencyTitle}>
                          MONITOR RIVER
                        </Text>
                        <Text style={MyStyles.emergencyMessage}>
                          Observe Water-Level
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 5,
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Android shadow
    elevation: 3,
  },
  alignItems: "center",
  left: {
    width: "45%",
    padding: 10,
    backgroundColor: "#F8F8F8",
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
    borderTopLeftRadius: 10, // add this
    borderBottomLeftRadius: 10, // add this
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  bigDate: {
    fontSize: 50,
    fontFamily: "QuicksandBold",
    color: "#04384E",
    lineHeight: 50,
    marginTop: 0,
  },
  monthText: {
    fontSize: 16,
    fontFamily: "QuicksandSemiBold",
    color: "#04384E",
    marginTop: 0,
    marginBottom: 0,
    lineHeight: 18,
  },
  weekText: {
    fontSize: 12,
    color: "#888",
    fontFamily: "QuicksandSemiBold",
  },
  dotAndTitle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 2,
    fontFamily: "QuicksandBold",
    alignSelf: "flex-start",
    fontSize: 18,
    marginTop: 5,
  },
  blueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  eventTitle: {
    fontFamily: "QuicksandSemiBold",
    fontSize: 13,
    color: "#04384E",
    marginRight: 3,
  },
  eventDate: {
    fontSize: 12,
    marginLeft: 15,
    fontFamily: "QuicksandMedium",
    color: "#04384E",
  },
  eventTime: {
    fontSize: 12,
    color: "#666",
    marginLeft: 15,
    fontFamily: "QuicksandMedium",
  },
  noEvents: {
    fontStyle: "italic",
    color: "#888",
    fontFamily: "QuicksandMedium",
    textAlign: "center",
  },
  right: {
    width: "55%",
    padding: 5,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
  },
  monthHeader: {
    textAlign: "center",
    fontFamily: "QuicksandBold",
    marginBottom: 5,
    color: "#04384E",
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  weekDay: {
    fontFamily: "QuicksandSemiBold",
    color: "#999",
    fontSize: 12,
  },
  calendarContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`, // 7 columns in a row
    aspectRatio: 1, // make cells square
    justifyContent: "center",
    alignItems: "center",
  },
  dayWrapper: {
    padding: 3,
    borderRadius: 0,
  },
  currentDay: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  dayText: {
    fontSize: 14,
    fontFamily: "QuicksandMedium",
    color: "#04384E",
  },
  currentDayText: {
    color: "#0E94D3",
  },
  emptyCell: {
    height: 40,
  },
});
