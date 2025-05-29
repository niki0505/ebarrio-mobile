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

import EarthquakeImg from "../assets/disasters/earthquake-light.png";

const Earthquake = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const tipsData = [
    {
      phase: "Before",
      steps: [
        "Understand Your Risk\nDetermine if your area is prone to earthquakes and follow local authorities' recommendations.",
        "Talk to Your Children\nExplain what earthquakes are, why they happen, and how to stay safe in age-appropriate terms.",
        "Make a Plan\nIdentify evacuation routes and meeting points. Ensure all family members know the plan.",
        "Secure Your Home\nAnchor heavy furniture and appliances to walls.",
        "Prepare an Emergency Kit\nInclude food, water, flashlight, batteries, and first aid supplies.",
      ],
    },
    {
      phase: "During",
      steps: [
        "Drop, Cover, and Hold\nGet down, take cover under sturdy furniture, and hold on until shaking stops.",
        "Stay Indoors\nIf inside, stay there. If outside, move to an open area away from buildings.",
        "Avoid Elevators\nDo not use elevators during an earthquake.",
      ],
    },
    {
      phase: "After",
      steps: [
        "Check for Injuries\nProvide first aid if necessary and seek medical attention for serious injuries.",
        "Inspect for Hazards\nBe aware of potential dangers like gas leaks or structural damage.",
        "Stay Informed\nListen to emergency broadcasts for updates and instructions.",
      ],
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
            { paddingBottom: 20, gap: 20, backgroundColor: "#BC0F0F" },
          ]}
        >
          <MaterialIcons
            name="arrow-back-ios"
            size={30}
            color="#fff"
            onPress={() => navigation.navigate("SafetyTips")}
          />

          <View style={{ alignItems: "center" }}>
            <Image source={EarthquakeImg} style={{ width: 160, height: 160 }} />
          </View>

          <Text
            style={[MyStyles.header, { textAlign: "center", color: "#fff" }]}
          >
            EARTHQUAKE
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

export default Earthquake;
