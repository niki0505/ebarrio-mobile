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

const Typhoon = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const typhoonImg = require("../assets/disasters/typhoon-light.png");

  const tipsData = [
    {
      phase: "Before",
      steps: [
        "Understand Typhoon Risks\nFamiliarize yourself with the likelihood of typhoons or severe thunderstorms in your community.",
        "Stay Informed\nMonitor weather forecasts and learn about local alert systems to receive timely warnings.",
        "Prepare an Emergency Kit\nInclude non-perishable food, water, medication, a first-aid kit, flashlights, batteries, and important documents.",
        "Secure Your Home\nReinforce your home, trim trees, and remove dead branches to reduce risks.",
        "Plan for Evacuation\nIdentify the safest shelter or evacuation center for all family members and prepare for possible evacuation.",
      ],
    },
    {
      phase: "During",
      steps: [
        "Stay Indoors\nRemain inside and away from windows.",
        "Monitor Updates\nListen to official announcements for instructions.",
        "Avoid Flooded Areas\nDo not go into areas prone to flooding or landslides.",
      ],
    },
    {
      phase: "After",
      steps: [
        "Wait for Official Clearance\nDo not go outside until authorities confirm it's safe.",
        "Check for Injuries\nProvide first aid if necessary and seek medical help for any serious injuries.",
        "Check for Hazards\nBe cautious of downed power lines and structural damages.",
        "Communicate\nInform family and friends of your safety.",
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
            <Image source={typhoonImg} style={{ width: 160, height: 160 }} />
          </View>

          <Text
            style={[MyStyles.header, { textAlign: "center", color: "#fff" }]}
          >
            TYPHOON
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

export default Typhoon;
