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

//ICONS & IMAGES
import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import QuickTips from "../assets/disasters/quick-tips.png";
import Disaster from "../assets/disasters/disaster.png";
import Hazard from "../assets/disasters/hazard.png";
import Evacuation from "../assets/disasters/evacuation.png";

const Readiness = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const readinessData = [
    {
      title: "QUICK SAFETY",
      subtitle: "Easy access to essential safety information",
      image: require("../assets/disasters/quick-tips.png"),
      route: "QuickTips",
    },
    {
      title: "DISASTER SAFETY",
      subtitle: "Learn practical tips to stay safe during natural disasters",
      image: require("../assets/disasters/disaster.png"),
      route: "SafetyTips",
    },
    {
      title: "HAZARD MAPS",
      subtitle: "View areas at risk for natural hazards",
      image: require("../assets/disasters/hazard.png"),
      route: "HazardMap",
    },
    {
      title: "EVACUATION MAP",
      subtitle: "View the route to the nearest evacuation map",
      image: require("../assets/disasters/evacuation.png"),
      route: "EvacuationMap",
    },
  ];

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
            {
              paddingBottom: 20,
              gap: 10,
              backgroundColor: "#BC0F0F",
            },
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
                marginBottom: 0,
                textAlign: "center",
                color: "#fff",
              },
            ]}
          >
            Readiness
          </Text>

          <View style={{ flexDirection: "column", gap: 30 }}>
            {readinessData.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={MyStyles.readinessCard}
                onPress={
                  item.route ? () => navigation.navigate(item.route) : null
                }
              >
                <Image source={item.image} style={MyStyles.readinessImg} />
                <View style={MyStyles.readinessTextContainer}>
                  <Text style={MyStyles.readinessTitle}>{item.title}</Text>
                  <Text style={MyStyles.readinessSubTitle}>
                    {item.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Readiness;
