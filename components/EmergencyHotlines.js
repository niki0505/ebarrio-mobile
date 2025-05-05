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

const EmergencyHotlines = () => {
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
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity onPress={() => navigation.navigate("BottomTabs")}>
            <Text>Back</Text>
          </TouchableOpacity>
          <TextInput
            value={search}
            onChangeText={handleSearch}
            style={{
              borderWidth: 1,
              borderColor: "black",
              width: 150,
              height: 30,
            }}
            placeholder="Search..."
          />
          {filteredEmergencyHotlines.length === 0 ? (
            <Text>No results found</Text>
          ) : (
            filteredEmergencyHotlines.map((element) => (
              <View key={element._id} style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => handleCall(element.contactnumber)}
                  style={{
                    backgroundColor: "red",
                  }}
                >
                  <Text>Call</Text>
                </TouchableOpacity>
                <View>
                  <Text>{element.name}</Text>
                  <Text>{element.contactnumber}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EmergencyHotlines;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
