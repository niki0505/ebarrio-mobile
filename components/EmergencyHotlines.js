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
import { MaterialIcons } from "@expo/vector-icons";

const EmergencyHotlines = () => {
  const insets = useSafeAreaInsets();
  const { logout, user } = useContext(AuthContext);
  const { fetchEmergencyHotlines, emergencyhotlines } = useContext(InfoContext);
  const [filteredEmergencyHotlines, setFilteredEmergencyHotlines] = useState(
    []
  );
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    fetchEmergencyHotlines();
  }, []);

  const handleCall = (contactNumber) => {
    const phoneNumber = `tel:${contactNumber}`;
    Linking.openURL(phoneNumber).catch((err) =>
      console.error("Error opening dialer: ", err)
    );
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
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#fff" }} // para hindi nago-overlap sa status bar when scrolled
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            MyStyles.scrollContainer,
            {
              paddingTop: insets.top,
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
            Emergency Hotlines
          </Text>

          <View style={{ gap: 15 }}>
            <View style={{ position: "relative" }}>
              <TextInput
                value={search}
                onChangeText={handleSearch}
                style={[MyStyles.input]}
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
              filteredEmergencyHotlines.map((element) => (
                <View
                  key={element._id}
                  style={[
                    MyStyles.input,
                    {
                      flexDirection: "row",
                    },
                  ]}
                >
                  <MaterialIcons
                    onPress={() => handleCall(element.contactnumber)}
                    name="call"
                    size={20}
                    color="#fff"
                    style={MyStyles.phoneIcon}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={MyStyles.inputTitle}>
                      {element.name.toUpperCase()}
                    </Text>
                    <Text style={{ color: "#04384E" }}>
                      {element.contactnumber}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EmergencyHotlines;
