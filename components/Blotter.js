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
} from "react-native";
import { useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../api";

const Blotter = () => {
  const { logout, user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [blotterForm, setBlotterForm] = useState({
    resID: user.resID,
    date: new Date(),
    time: new Date(),
    datetime: new Date(),
    type: "",
    subject: "",
    details: "",
  });

  const typeList = ["Theft", "Assault", "Physical Injury", "Missing Person"];

  const handleSubmit = async () => {
    try {
      await api.post("/sendblotter", {
        blotterForm,
      });
      Alert.alert("Blotter submitted successfully!");
    } catch (error) {
      console.log("Error", error);
    }
  };
  const handleDropdownChange = ({ target }) => {
    const { name, value } = target;
    setBlotterForm((prev) => ({
      ...prev,
      [name]: value.value,
    }));
  };

  const handleInputChange = (name, value) => {
    setBlotterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log(blotterForm);

  console.log("Date", blotterForm.date);
  console.log("Time", blotterForm.time);
  console.log("Date & Time", blotterForm.datetime);

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
          <Text style={styles.header}>Blotter</Text>
          <Text>Type of the Incident:</Text>
          <Dropdown
            labelField="label"
            valueField="value"
            value={blotterForm.type}
            data={typeList.map((type) => ({
              label: type,
              value: type,
            }))}
            placeholder="Select type of the incident"
            onChange={(itemValue) =>
              handleDropdownChange({
                target: { name: "type", value: itemValue },
              })
            }
          ></Dropdown>
          <Text>Date of the Incident:</Text>
          <DateTimePicker
            value={blotterForm.date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setBlotterForm((prev) => ({
                  ...prev,
                  date: selectedDate,
                  datetime: new Date(
                    selectedDate.setHours(
                      blotterForm.time.getHours(),
                      blotterForm.time.getMinutes()
                    )
                  ),
                }));
              }
            }}
          />
          <Text>Time of the Incident:</Text>
          <DateTimePicker
            value={blotterForm.time}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              if (selectedTime) {
                setBlotterForm((prev) => ({
                  ...prev,
                  time: selectedTime,
                  datetime: new Date(
                    prev.date.setHours(
                      selectedTime.getHours(),
                      selectedTime.getMinutes()
                    )
                  ),
                }));
              }
            }}
          />
          <Text>Subject of the Complaint:</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: "black", height: 30 }}
            value={blotterForm.subject}
            type="text"
            onChangeText={(text) => handleInputChange("subject", text)}
          />
          <Text>Details of the Incident:</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: "black", height: 30 }}
            value={blotterForm.details}
            type="text"
            maxLength={3000}
            onChangeText={(text) => handleInputChange("details", text)}
          />
          <Text>{blotterForm.details.length}/3000</Text>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <Text style={{ marginTop: 20, color: "red" }}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Blotter;

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
