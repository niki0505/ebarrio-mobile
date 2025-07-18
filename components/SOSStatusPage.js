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

const SOSStatusPage = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

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

          <Text
            style={[
              MyStyles.header,
              {
                marginTop: 20,
                textAlign: "start",
                color: "#fff",
              },
            ]}
          >
            Help is on the way
          </Text>

          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <LottieView
              source={require("../assets/sos-on-the-way.json")}
              autoPlay
              loop
              style={{
                width: 350,
                height: 350,
              }}
            />
            <Text
              style={{
                fontFamily: "QuicksandBold",
                marginTop: 20,
                textAlign: "center",
                color: "#fff",
                opacity: 0.8,
                fontSize: 18,
                padding: 20,
              }}
            >
              Your help is on the way. {"\n"} In the meantime, please remain
              calm and know that assistance is coming soon.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SOSStatusPage;
