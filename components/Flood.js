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

import FloodImg from "../assets/disasters/flood-light.png";

const Flood = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const tipsData = [
    {
      phase: "Before",
      steps: [
        "Understand Flood Risks\nLearn about the types of flooding that can occur in your area and the local emergency contacts to reach out to for help.",
        "Practice Your Safety Plan\nIdentify safe evacuation routes and practice them with your family. Establish a meeting point in case you get separated.",
        "Prepare an Emergency Kit\nInclude non-perishable foods, medicines, a first aid kit, flashlight, batteries, and water for several days.",
        "Teach Children to Swim",
        "Secure Important Documents\nStore them in waterproof containers.",
      ],
    },
    {
      phase: "During",
      steps: [
        "Stay Informed\nMonitor weather updates and follow instructions from local authorities.",
        "Avoid Floodwaters\nDo not walk, swim, or drive through floodwaters.",
        "Move to Higher Ground\nIf evacuation is not possible, move to the highest level of your home.",
        "Keep Children Safe\nEnsure they stay away from floodwaters.",
      ],
    },
    {
      phase: "After",
      steps: [
        "Wait for Official Clearance\nReturn home only when authorities declare it safe.",
        "Protect Your Health\nAvoid contact with floodwaters, which may carry diseases. Wash hands regularly and bathe children if exposed.",
        "Ensure Food and Water Safety\nBoil all water for at least three minutes before drinking or cooking. Discard food that has come into contact with floodwater.",
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
            <Image source={FloodImg} style={{ width: 160, height: 160 }} />
          </View>

          <Text
            style={[MyStyles.header, { textAlign: "center", color: "#fff" }]}
          >
            FLOOD
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

export default Flood;
