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
import Typhoon from "../assets/disasters/typhoon.png";
import Flood from "../assets/disasters/flood.png";
import Earthquake from "../assets/disasters/earthquake.png";
import Fire from "../assets/disasters/fire.png";

//ICONS
import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const SafetyTips = () => {
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
                color: "#04384E",
              },
            ]}
          >
            Types of Disaster
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
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
              height: 150,
            }}
            onPress={() => navigation.navigate("Typhoon")}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
              }}
            >
              <Image
                source={Typhoon}
                style={{ width: 90, height: 90, resizeMode: "contain" }}
              />
              <Text
                style={{
                  color: "#04384E",
                  fontSize: 24,
                  fontFamily: "REMSemiBold",
                  textAlign: "center",
                  width: 150,
                }}
              >
                Typhoon
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
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
              height: 150,
            }}
            onPress={() => navigation.navigate("Flood")}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
              }}
            >
              <Image
                source={Flood}
                style={{ width: 90, height: 90, resizeMode: "contain" }}
              />
              <Text
                style={{
                  color: "#04384E",
                  fontSize: 24,
                  fontFamily: "REMSemiBold",
                  textAlign: "center",
                  width: 150,
                }}
              >
                Flood
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
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
              height: 150,
            }}
            onPress={() => navigation.navigate("Earthquake")}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
              }}
            >
              <Image
                source={Earthquake}
                style={{ width: 90, height: 90, resizeMode: "contain" }}
              />
              <Text
                style={{
                  color: "#04384E",
                  fontSize: 24,
                  fontFamily: "REMSemiBold",
                  textAlign: "center",
                  width: 150,
                }}
              >
                Earthquake
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#fff",
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
              height: 150,
            }}
            onPress={() => navigation.navigate("Fire")}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
              }}
            >
              <Image
                source={Fire}
                style={{ width: 90, height: 90, resizeMode: "contain" }}
              />
              <Text
                style={{
                  color: "#04384E",
                  fontSize: 24,
                  fontFamily: "REMSemiBold",
                  textAlign: "center",
                  width: 150,
                }}
              >
                Fire
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SafetyTips;
