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
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

const SuccessfulPage = () => {
  const route = useRoute();
  const { service } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: "#04384E",
        justifyContent: "center", // Center vertically
        alignItems: "center", // Center horizontally
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ScrollView
          contentContainerStyle={[
            MyStyles.scrollContainer,
            {
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              padding: 50,
            },
          ]}
        >
          <LottieView
            source={require("../assets/successful.json")}
            autoPlay
            loop
            style={{ width: "100%", height: 200 }}
          />

          {service === "Document" && (
            <View
              style={{ alignItems: "center", flexDirection: "column", gap: 15 }}
            >
              <Text style={[MyStyles.header, { textAlign: "center" }]}>
                Document Request Successful
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 10,
                  color: "#808080",
                  fontFamily: "QuicksandSemiBold",
                  fontSize: 16,
                }}
              >
                Your document request has been received by the barangay. We'll
                get back to you soon. Tap the button below to view the status.
              </Text>
            </View>
          )}

          {service === "Blotter" && (
            <View style={{ alignItems: "center" }}>
              <Text style={[MyStyles.header, { textAlign: "center" }]}>
                Blotter Report Successful
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 10,
                  color: "#808080",
                  fontFamily: "QuicksandSemiBold",
                  fontSize: 16,
                }}
              >
                Your blotter report has been received by the barangay. We'll get
                back to you soon. Tap the button below to view the status.
              </Text>
            </View>
          )}

          {service === "Reservation" && (
            <View style={{ alignItems: "center" }}>
              <Text style={[MyStyles.header, { textAlign: "center" }]}>
                Court Reservation Request Successful
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 10,
                  color: "#808080",
                  fontFamily: "QuicksandSemiBold",
                  fontSize: 16,
                }}
              >
                Your court reservation request has been received by the
                barangay. We'll get back to you soon. Tap the button below to
                view the status.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[MyStyles.button, { marginTop: 15 }]}
            onPress={() => navigation.navigate("Status")}
          >
            <Text style={MyStyles.buttonText}>View Status</Text>
          </TouchableOpacity>

          <Text
            style={[MyStyles.buttonText, { color: "#0E94D3" }]}
            onPress={() => navigation.navigate("BottomTabs")}
          >
            Back to Home
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SuccessfulPage;
