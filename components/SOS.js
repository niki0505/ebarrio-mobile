import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Fire from "../assets/SOS/firefire.png";
import Flood from "../assets/SOS/flood.png";
import Earthquake from "../assets/SOS/earthquake.png";
import Typhoon from "../assets/SOS/typhoon.png";
import Medical from "../assets/SOS/medical.png";
import Suspicious from "../assets/SOS/suspicious.png";
import Location from "../assets/SOS/location.png";
import LottieView from "lottie-react-native";

const SOS = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#BC0F0F" }}
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
          <Text
            style={[
              MyStyles.header,
              {
                marginTop: 20,
                textAlign: "center",
                color: "#fff",
              },
            ]}
          >
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
            <TouchableOpacity
              onPress={() => navigation.navigate("SOSStatusPage")}
              style={{
                width: 280,
                height: 280,
                borderRadius: 140,
                backgroundColor: "#fff",
                marginTop: 20,
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
                  <View
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
                  </View>
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
                  <View
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
                  </View>
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
                  <View
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
                  </View>
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

            <View
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
            </View>
            <Image
              source={Location}
              style={{
                width: "100%",
                height: 250,
                borderBottomLeftRadius: 15,
                borderBottomRightRadius: 15,
              }}
            />
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
