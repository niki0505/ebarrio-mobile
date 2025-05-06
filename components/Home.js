import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Home = () => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View
        style={[
          MyStyles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View>
          <Text
            style={{
              padding: 10,
              fontSize: 24,
              color: "#04384E",
              fontWeight: "bold",
            }}
          >
            Home
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{ backgroundColor: "yellow" }}
            onPress={() => navigation.navigate("Certificates")}
          >
            <Text>Certificate Request</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: "lightblue" }}
            onPress={() => navigation.navigate("CourtReservations")}
          >
            <Text>Court Reservation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: "violet" }}
            onPress={() => navigation.navigate("EmergencyHotlines")}
          >
            <Text>EmergencyHotlines</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: "lightpink" }}
            onPress={() => navigation.navigate("Blotter")}
          >
            <Text>Blotter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: "green" }}
            onPress={() => navigation.navigate("Status")}
          >
            <Text>Status</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: "orange" }}
            onPress={() => navigation.navigate("Weather")}
          >
            <Text>Weather</Text>
          </TouchableOpacity>
          <Text onPress={() => logout(navigation)}>Logout</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Home;
