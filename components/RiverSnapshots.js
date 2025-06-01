import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Snapshot from "../assets/cctv-snapshot.png"; // Update with actual image

const RiverSnapshots = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // State to track if 'Current' or 'History' button is selected
  const [viewMode, setViewMode] = useState("current"); // 'current' or 'history'

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
            { backgroundColor: "#F0F4F7" },
          ]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons
              name="arrow-back-ios"
              size={30}
              color="#04384E"
              style={{ marginLeft: 20, marginTop: 20 }}
            />
          </TouchableOpacity>

          <Text
            style={[
              MyStyles.header,
              {
                marginTop: 20,
                marginBottom: 0,
                textAlign: "center",
                color: "#04384E",
              },
            ]}
          >
            River Snapshots
          </Text>

          {/* Button to toggle between current and history view */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 30,
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={[
                MyStyles.button,
                {
                  flex: 1, // Ensure buttons take equal width
                  backgroundColor:
                    viewMode === "current" ? "#D9D9D9" : "#F0F4F7",
                  marginHorizontal: 10,
                },
              ]}
              onPress={() => setViewMode("current")}
            >
              <Text
                style={[
                  MyStyles.buttonText,
                  {
                    fontSize: 16,
                    color: viewMode === "current" ? "#04384E" : "#04384E",
                    textAlign: "center", // Ensure the text is centered
                  },
                ]}
              >
                Current
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                MyStyles.button,
                {
                  flex: 1, // Ensure buttons take equal width
                  backgroundColor:
                    viewMode === "history" ? "#D9D9D9" : "#F0F4F7",
                  marginHorizontal: 10,
                },
              ]}
              onPress={() => setViewMode("history")}
            >
              <Text
                style={[
                  MyStyles.buttonText,
                  {
                    fontSize: 16,
                    color: viewMode === "history" ? "#04384E" : "#04384E",
                    textAlign: "center", // Ensure the text is centered
                  },
                ]}
              >
                History
              </Text>
            </TouchableOpacity>
          </View>

          {/* Conditional Rendering of Images based on View Mode */}
          {viewMode === "current" ? (
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color: "#00BA00",
                  fontSize: 40,
                  fontFamily: "QuicksandBold",
                  textAlign: "center",
                  marginTop: 30,
                }}
              >
                SAFE
              </Text>

              <View
                style={{
                  backgroundColor: "#00BA00",
                  padding: 10,
                  width: "100%",
                  height: 250,
                  borderRadius: 15,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <Image
                  source={Snapshot}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 15,
                    resizeMode: "cover",
                  }}
                />
              </View>

              <Text
                style={{
                  color: "#04384E",
                  fontSize: 25,
                  fontFamily: "REMBold",
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                Zapote River
              </Text>

              <View style={{ marginTop: 30 }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: "#BC0F0F",
                    fontFamily: "QuicksandBold",
                    textAlign: "center",
                  }}
                >
                  CCTV Snapshot as of 2:00 PM
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    color: "#808080",
                    textAlign: "center",
                    fontFamily: "QuicksandSemiBold",
                    marginTop: 10,
                  }}
                >
                  The next update will be in 10 minutes.
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ marginTop: 50, flexDirection: "column", gap: 30 }}>
              <View>
                <View
                  style={{
                    backgroundColor: "#BC0F0F",
                    padding: 10,
                    width: "100%",
                    height: 250,
                    borderRadius: 15,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={Snapshot}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 15,
                      resizeMode: "cover",
                    }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#04384E",
                      fontFamily: "QuicksandBold",
                      textAlign: "right",
                    }}
                  >
                    Status: CRITICAL
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#04384E",
                      fontFamily: "QuicksandBold",
                      textAlign: "right",
                    }}
                  >
                    CCTV Snapshot as of 10:30 AM
                  </Text>
                </View>
              </View>

              <View>
                <View
                  style={{
                    backgroundColor: "#F46608",
                    padding: 10,
                    width: "100%",
                    height: 250,
                    borderRadius: 15,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={Snapshot}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 15,
                      resizeMode: "cover",
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#04384E",
                      fontFamily: "QuicksandBold",
                      textAlign: "right",
                    }}
                  >
                    Status: WARNING
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#04384E",
                      fontFamily: "QuicksandBold",
                      textAlign: "right",
                    }}
                  >
                    CCTV Snapshot as of 9:30 AM
                  </Text>
                </View>
              </View>

              <View>
                <View
                  style={{
                    backgroundColor: "#00BA00",
                    padding: 10,
                    width: "100%",
                    height: 250,
                    borderRadius: 15,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={Snapshot}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 15,
                      resizeMode: "cover",
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#04384E",
                      fontFamily: "QuicksandBold",
                      textAlign: "right",
                    }}
                  >
                    Status: SAFE
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#04384E",
                      fontFamily: "QuicksandBold",
                      textAlign: "right",
                    }}
                  >
                    CCTV Snapshot as of 8:30 AM
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RiverSnapshots;
