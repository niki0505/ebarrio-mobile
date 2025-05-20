import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";
import { InfoContext } from "../context/InfoContext";
import { useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import hotlines from "../assets/hotlines-icon.png";
import safety from "../assets/safety-tips-icon.png";

//ICONS
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from "@expo/vector-icons";

const OfflineScreen = () => {
  const insets = useSafeAreaInsets();
  const [storedEmergencyHotlines, setStoredEmergencyHotlines] = useState([]);
  const [isEmergencyClicked, setEmergencyClicked] = useState(false);

  useEffect(() => {
    const fetchEmergencyHotlines = async () => {
      const storedHotlines = await SecureStore.getItemAsync(
        "emergencyhotlines"
      );
      if (storedHotlines) {
        setStoredEmergencyHotlines(JSON.parse(storedHotlines));
      }
    };
    fetchEmergencyHotlines();
  }, []);

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
              paddingBottom: insets.bottom,
              backgroundColor: "#BC0F0F",
            },
          ]}
        >
          {!isEmergencyClicked && (
            <>
              <Text style={[MyStyles.header, { color: "#fff" }]}>
                Hello, Resident!
              </Text>
              <Text style={{ color: "#fff", fontSize: 16 }}>
                You are currently offline
              </Text>

              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: "80%",
                    height: "90%",
                    flexDirection: "column",
                    gap: 20,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#fff",
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 15,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="lightbulb-on"
                        size={80}
                        color="#BC0F0F"
                      />
                      <Text
                        style={[
                          MyStyles.emergencyTitle,
                          { color: "#BC0F0F", fontSize: 30 },
                        ]}
                      >
                        SAFETY TIPS
                      </Text>
                      <Text
                        style={[
                          MyStyles.emergencyMessage,
                          { color: "#BC0F0F", fontSize: 16 },
                        ]}
                      >
                        Stay Smart, Stay Safe
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setEmergencyClicked(true)}
                    style={{
                      backgroundColor: "#fff",
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 15,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                      }}
                    >
                      <MaterialIcons name="call" size={80} color="#BC0F0F" />
                      <Text
                        style={[
                          MyStyles.emergencyTitle,
                          { color: "#BC0F0F", fontSize: 30 },
                        ]}
                      >
                        HOTLINES
                      </Text>
                      <Text
                        style={[
                          MyStyles.emergencyMessage,
                          { color: "#BC0F0F", fontSize: 16 },
                        ]}
                      >
                        Call for Assistance
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {isEmergencyClicked && (
            <View>
              <MaterialIcons
                onPress={() => setEmergencyClicked(false)}
                name="arrow-back-ios"
                size={24}
                color="#fff"
              />

              <Text
                style={[
                  MyStyles.header,
                  { marginTop: 20, marginBottom: 30, color: "#fff" },
                ]}
              >
                Hotlines
              </Text>

              <View style={{ gap: 15 }}>
                <View style={{ position: "relative" }}>
                  <TextInput
                    style={[MyStyles.input, { paddingLeft: 40, height: 45 }]}
                    placeholder="Search..."
                  />
                  <MaterialIcons
                    name="search"
                    size={20}
                    color="#C1C0C0"
                    style={MyStyles.searchIcon}
                  />
                </View>

                {storedEmergencyHotlines.map((hotline) => (
                  <View
                    key={hotline._id}
                    style={[
                      MyStyles.input,
                      {
                        flexDirection: "row",
                        backgroundColor: "#fff",

                        alignItems: "center",
                      },
                    ]}
                  >
                    <MaterialIcons
                      name="call"
                      size={20}
                      color="#fff"
                      style={MyStyles.phoneIcon}
                    />
                    <View style={{ marginLeft: 10 }}>
                      <Text>{hotline.name.toUpperCase()}</Text>
                      <Text>{hotline.contactnumber}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OfflineScreen;
