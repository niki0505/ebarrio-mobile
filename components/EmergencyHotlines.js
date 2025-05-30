import {
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from "react-native";
import { useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { InfoContext } from "../context/InfoContext";
import { AuthContext } from "../context/AuthContext";
import api from "../api";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MyStyles } from "./stylesheet/MyStyles";

//ICONS
import { MaterialIcons } from "@expo/vector-icons";

const EmergencyHotlines = () => {
  const insets = useSafeAreaInsets();
  const { fetchEmergencyHotlines, emergencyhotlines } = useContext(InfoContext);
  const [filteredEmergencyHotlines, setFilteredEmergencyHotlines] = useState(
    []
  );
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    fetchEmergencyHotlines();
  }, []);

  const handleCall = async (contactName, contactNumber) => {
    const phoneNumber = `tel:${contactNumber}`;
    Linking.openURL(phoneNumber).catch((err) =>
      console.error("Error opening dialer: ", err)
    );
    const action = "Emergency Hotlines";
    const description = `User tapped the contact number of ${contactName}, initiating a phone call.`;
    try {
      await api.post("/logactivity", { action, description });
      navigation.navigate("EmergencyHotlines");
    } catch (error) {
      console.log("Error in viewing emergency hotlines", error);
    }
  };

  const handleSearch = (text) => {
    const sanitizedText = text.replace(/[^a-zA-Z\s.]/g, "");
    const formattedText = sanitizedText
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    setSearch(formattedText);
  };

  useEffect(() => {
    if (search) {
      const filtered = emergencyhotlines.filter((emergency) => {
        return emergency.name.includes(search);
      });
      setFilteredEmergencyHotlines(filtered);
    } else {
      setFilteredEmergencyHotlines(emergencyhotlines);
    }
  }, [search, emergencyhotlines]);

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }} // para hindi nago-overlap sa status bar when scrolled
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            MyStyles.scrollContainer,
            {
              paddingBottom: 20, // pinalitan ko ng 20 para may margin when scrolled
              gap: 10,
            },
          ]}
        >
          <MaterialIcons
            onPress={() => navigation.navigate("BottomTabs")}
            name="arrow-back-ios"
            size={24}
            color="#04384E"
          />
          <Text style={[MyStyles.header, { marginTop: 20, marginBottom: 30 }]}>
            Hotlines
          </Text>

          <View style={{ gap: 15 }}>
            <View style={{ position: "relative" }}>
              <TextInput
                value={search}
                onChangeText={handleSearch}
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

            {filteredEmergencyHotlines.length === 0 ? (
              <Text>No results found</Text>
            ) : (
              filteredEmergencyHotlines
                .filter((element) => element.status !== "Archived")
                .map((element) => (
                  <TouchableOpacity
                    key={element._id}
                    onPress={() =>
                      handleCall(element.name, element.contactnumber)
                    }
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
                      color="#BC0F0F"
                      style={{ marginRight: 10 }}
                    />
                    <View style={{ marginLeft: 10 }}>
                      <Text
                        style={{
                          color: "#04384E",
                          fontFamily: "REMSemiBold",
                          fontSize: 16,
                        }}
                      >
                        {element.name.toUpperCase()}
                      </Text>
                      <Text
                        style={{
                          color: "#04384E",
                          fontFamily: "QuicksandSemiBold",
                          fontSize: 16,
                        }}
                      >
                        {element.contactnumber}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EmergencyHotlines;
