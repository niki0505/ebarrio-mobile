// screens/RequestCertificate.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function RequestCertificate() {
  const navigation = useNavigation();
  return (
    <View style={MyStyles.container}>
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
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={40} color="#04384E" />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, color: "#04384E", fontWeight: "bold" }}>
          Request Certificate
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Welcome to Request Certificate</Text>
      </View>
    </View>
  );
}
