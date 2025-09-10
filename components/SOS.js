import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TextInput,
  Animated,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Fire from "../assets/SOS/firefire.png";
import Flood from "../assets/SOS/flood.png";
import Earthquake from "../assets/SOS/earthquake.png";
import Typhoon from "../assets/SOS/typhoon.png";
import Medical from "../assets/SOS/medical.png";
import Suspicious from "../assets/SOS/suspicious.png";
import api from "../api";
import { useRef } from "react";
import Svg, { Circle } from "react-native-svg";

const CIRCLE_SIZE = 280; // match button size
const STROKE_WIDTH = 6;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SOS = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const timerRef = useRef(null);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const sendSOS = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission not granted");
      }
      let loc = await Location.getCurrentPositionAsync({});
      try {
        await api.post("/sendsos", {
          location: {
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
          },
        });
        navigation.navigate("SOSStatusPage");
      } catch (error) {
        console.error("Error sending SOS:", error);
      }
    } catch (e) {
      console.error("Error getting location:", error);
    }
  };

  const handlePressIn = () => {
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 5000, // 5 seconds
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        sendSOS();
      }
    });
  };

  const handlePressOut = () => {
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: "#BC0F0F",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            MyStyles.scrollContainer,
            { backgroundColor: "#BC0F0F" },
          ]}
        >
          <MaterialIcons
            onPress={() => navigation.navigate("BottomTabs")}
            name="arrow-back-ios"
            size={30}
            color="#fff"
          />
          <Text style={[MyStyles.header, MyStyles.readinessHeader]}>
            Emergency
          </Text>
          <Text
            style={[
              MyStyles.header,
              {
                color: "#fff",
                textAlign: "center",
                fontFamily: "QuicksandSemiBold",
                marginTop: 10,
                fontSize: 16,
                opacity: 0.8,
              },
            ]}
          >
            Warning: Press the{" "}
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>SOS</Text> button
            if you are in an emergency and need urgent assistance. Hence, please
            fill out the form first so that we can assist you better and provide
            help based on your needs.
          </Text>

          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                width: CIRCLE_SIZE,
                height: CIRCLE_SIZE,
              }}
            >
              <Svg
                width={CIRCLE_SIZE}
                height={CIRCLE_SIZE}
                style={{ position: "absolute", top: 0, left: 0 }}
              >
                <AnimatedCircle
                  cx={CIRCLE_SIZE / 2}
                  cy={CIRCLE_SIZE / 2}
                  r={RADIUS}
                  stroke="#0E94D3"
                  strokeWidth={STROKE_WIDTH}
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={borderAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [CIRCUMFERENCE, 0],
                  })}
                  strokeLinecap="round"
                  fill="none"
                />
              </Svg>

              <TouchableOpacity
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={{
                  width: 280,
                  height: 280,
                  borderRadius: 140,
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#BC0F0F",
                    fontFamily: "REMBold",
                    fontSize: 70,
                    textAlign: "center",
                  }}
                >
                  SOS
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={[
                MyStyles.header,
                {
                  color: "#fff",
                  textAlign: "center",
                  fontFamily: "QuicksandSemiBold",
                  marginTop: 10,
                  fontSize: 14,
                  opacity: 0.8,
                },
              ]}
            >
              Press on hold for 5 seconds to activate
            </Text>

            <Text
              style={[
                MyStyles.header,
                {
                  color: "#fff",
                  marginTop: 50,
                  textAlign: "center",
                  fontSize: 24,
                },
              ]}
            >
              What kind of emergency?
            </Text>

            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                gap: 30,
                marginTop: 20,
              }}
            >
              {/* Row 1: Fire and Flood */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "80%",
                }}
              >
                {[
                  { source: Fire, label: "FIRE" },
                  { source: Flood, label: "FLOOD" },
                ].map(({ source, label }, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <Image
                      source={source}
                      style={{ width: 80, height: 80, borderRadius: 15 }}
                    />
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 18,
                        fontFamily: "REMBold",
                      }}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Row 2: Earthquake and Typhoon */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "80%",
                }}
              >
                {[
                  { source: Earthquake, label: "EARTHQUAKE" },
                  { source: Typhoon, label: "TYPHOON" },
                ].map(({ source, label }, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <Image
                      source={source}
                      style={{ width: 80, height: 80, borderRadius: 15 }}
                    />
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 18,
                        fontFamily: "REMBold",
                      }}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Row 3: Medical and Suspicious */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "80%",
                }}
              >
                {[
                  { source: Medical, label: "MEDICAL" },
                  { source: Suspicious, label: "SUSPICIOUS" },
                ].map(({ source, label }, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <Image
                      source={source}
                      style={{ width: 80, height: 80, borderRadius: 15 }}
                    />
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 18,
                        fontFamily: "REMBold",
                      }}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Details */}
            <View style={{ marginTop: 40, width: "100%" }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontFamily: "QuicksandBold",
                }}
              >
                Details of the Emergency
              </Text>
              <TextInput
                placeholder="Enter details"
                style={[
                  MyStyles.input,
                  { height: 150, textAlignVertical: "top" },
                ]}
                multiline={true}
                numberOfLines={4}
                maxLength={3000}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "QuicksandSemiBold",
                    opacity: 0.8,
                  }}
                >
                  /3000
                </Text>
              </View>
            </View>

            {/* Location */}

            {/*<View
              style={{
                width: "100%",
                marginTop: 20,
              }}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  padding: 5,
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                }}
              >
                <Text
                  style={{
                    color: "#BC0F0F",
                    fontSize: 18,
                    fontFamily: "QuicksandBold",
                  }}
                >
                  Where is the emergency?
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#BC0F0F",
                    padding: 5,
                    borderRadius: 8,
                    alignItems: "center",
                    width: "35%",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontFamily: "REMBold",
                      fontSize: 16,
                    }}
                  >
                    My Location
                  </Text>
                </TouchableOpacity>
              </View>
            </View>*/}

            <TouchableOpacity
              style={[
                MyStyles.button,
                { backgroundColor: "#fff", marginTop: 20 },
              ]}
            >
              <Text style={[MyStyles.buttonText, { color: "#BC0F0F" }]}>
                ASK HELP
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SOS;
