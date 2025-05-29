import React from "react";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { MyStyles } from "./stylesheet/MyStyles";

import FireImg from "../assets/disasters/fire-light.png";

const Fire = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const tipsData = [
    {
      phase: "Before",
      steps: [
        "Install Smoke Alarms\nPlace smoke detectors on every level of your home and test them monthly.",
        "Fire Extinguishers\nKeep them accessible and ensure everyone knows how to use them.",
        "Escape Plan\nDevelop and practice a fire escape plan with all household members.",
        "Avoid Overloading Outlets\nDo not overload electrical outlets to prevent fires.",
      ],
    },
    {
      phase: "During",
      steps: [
        "Evacuate Immediately\nLeave the building as quickly as possible and do not stop to collect belongings.",
        "Stay Low\nIf there's smoke, crawl low under it to your exit.",
        "Do Not Re-enter\nOnce out, stay out and call emergency services.",
      ],
    },
    {
      phase: "After",
      steps: [
        "Wait for Clearance\nDo not re-enter until authorities declare it safe.",
        "Check for Injuries\nAdminister first aid if needed and seek medical attention for serious injuries.",
        "Check for Damage\nAssess the property for structural damage and hazards.",
        "Seek Support\nContact local disaster relief services for assistance.",
      ],
    },
  ];

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
            { paddingBottom: 20, gap: 20, backgroundColor: "#BC0F0F" },
          ]}
        >
          <MaterialIcons
            name="arrow-back-ios"
            size={30}
            color="#fff"
            onPress={() => navigation.navigate("BottomTabs")}
          />

          <View style={{ alignItems: "center" }}>
            <Image source={FireImg} style={{ width: 160, height: 160 }} />
          </View>

          <Text
            style={[MyStyles.header, { textAlign: "center", color: "#fff" }]}
          >
            FIRE
          </Text>

          {tipsData.map((section, index) => (
            <View
              key={index}
              style={{
                backgroundColor: "#fff",
                borderRadius: 15,
                padding: 20,
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: "REMBold",
                  marginBottom: 10,
                  color: "#BC0F0F",
                }}
              >
                {section.phase}
              </Text>

              {section.steps.map((step, stepIndex) => (
                <View
                  key={stepIndex}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      backgroundColor: "#BC0F0F",
                      borderRadius: 15,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 10,
                      marginTop: 4,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {stepIndex + 1}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "QuicksandMedium",
                      color: "#333",
                      flex: 1,
                    }}
                  >
                    <Text style={{ fontFamily: "QuicksandBold" }}>
                      {step.split("\n")[0]}
                    </Text>
                    {"\n" + step.split("\n")[1]}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Fire;
