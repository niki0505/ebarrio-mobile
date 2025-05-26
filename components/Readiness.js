import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

//ICONS
import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Readiness = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            MyStyles.scrollContainer,
            {
              paddingBottom: 20,
              gap: 10,
            },
          ]}
        >
          <MaterialIcons
            onPress={() => navigation.navigate("BottomTabs")}
            name="arrow-back-ios"
            size={30}
            color="#04384E"
          />
          <Text
            style={[
              MyStyles.header,
              {
                marginTop: 20,
                marginBottom: 0,
                textAlign: "center",
                color: "#BC0F0F",
              },
            ]}
          >
            Readiness
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#BC0F0F",
              borderRadius: 12,
              padding: 15,
              marginHorizontal: 10,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              height: 200,
            }}
            onPress={() => navigation.navigate("SafetyTips")}
          >
            <MaterialCommunityIcons
              name="lightbulb-on"
              size={50}
              color="#fff"
              style={{ marginBottom: 10 }}
            />
            <Text
              style={{
                color: "#fff",
                fontSize: 24,
                fontFamily: "REMSemiBold",
                textAlign: "center",
              }}
            >
              Disaster Safety Tips
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#BC0F0F",
              borderRadius: 12,
              padding: 15,
              marginHorizontal: 10,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              height: 200,
            }}
          >
            <MaterialCommunityIcons
              name="map-search"
              size={50}
              color="#fff"
              style={{ marginBottom: 10 }}
            />
            <Text
              style={{
                color: "#fff",
                fontSize: 24,
                fontFamily: "REMSemiBold",
                textAlign: "center",
              }}
            >
              Hazard Map
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#BC0F0F",
              borderRadius: 12,
              padding: 15,
              marginHorizontal: 10,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              height: 200,
            }}
          >
            <FontAwesome5
              name="map-marked-alt"
              size={50}
              color="#fff"
              style={{ marginBottom: 10 }}
            />
            <Text
              style={{
                color: "#fff",
                fontSize: 24,
                fontFamily: "REMSemiBold",
                textAlign: "center",
              }}
            >
              Evacuation Map
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Readiness;
