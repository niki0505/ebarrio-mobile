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
import Snapshot from "../assets/cctv-snapshot.png";

const RiverSnapshots = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [viewMode, setViewMode] = useState("current");

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
                  flex: 1,
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
                    textAlign: "center",
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
                  flex: 1,
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
                    textAlign: "center",
                  },
                ]}
              >
                History
              </Text>
            </TouchableOpacity>
          </View>

          {viewMode === "current" ? (
            <View style={{ alignItems: "center" }}>
              <Image
                source={Snapshot}
                style={{
                  width: "100%",
                  height: 250,
                  borderRadius: 15,
                  resizeMode: "cover",
                  marginTop: 50,
                }}
              />

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
                <Image
                  source={Snapshot}
                  style={{
                    width: "100%",
                    height: 250,
                    borderRadius: 15,
                    resizeMode: "cover",
                  }}
                />

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

              <View>
                <Image
                  source={Snapshot}
                  style={{
                    width: "100%",
                    height: 250,
                    borderRadius: 15,
                    resizeMode: "cover",
                  }}
                />

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

              <View>
                <Image
                  source={Snapshot}
                  style={{
                    width: "100%",
                    height: 250,
                    borderRadius: 15,
                    resizeMode: "cover",
                  }}
                />

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
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RiverSnapshots;
