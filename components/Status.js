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

const Status = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("BottomTabs")}>
          <Text>Back</Text>
        </TouchableOpacity>
        <View
          style={{
            position: "absolute",
            top: 30,
            left: 15,
            flex: 1.5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              padding: 10,
              fontSize: 24,
              color: "#04384E",
              fontWeight: "bold",
            }}
          >
            Status
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Status;
