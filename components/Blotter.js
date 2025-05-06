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
import { InfoContext } from "../context/InfoContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MyStyles } from "./stylesheet/MyStyles";

const Blotter = () => {
  const insets = useSafeAreaInsets();
  const { logout, user } = useContext(AuthContext);
  const { fetchResidents, residents } = useContext(InfoContext);
  const navigation = useNavigation();
  const [subjectSuggestions, setSubjectSuggestions] = useState([]);
  const [blotterForm, setBlotterForm] = useState({
    complainantID: user.resID,
    subjectID: "",
    subjectname: "",
    subjectaddress: "",
    type: "",
    details: "",
  });

  useEffect(() => {
    fetchResidents();
  }, []);

  const typeList = ["Theft", "Assault", "Physical Injury", "Missing Person"];

  const handleSubmit = async () => {
    let updatedForm = { ...blotterForm };
    if (updatedForm.subjectID) {
      delete updatedForm.subjectname;
      delete updatedForm.subjectaddress;
    } else {
      delete updatedForm.subjectID;
    }
    try {
      await api.post("/sendblotter", {
        updatedForm,
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

  const handleSubjectChange = (value) => {
    const matches = residents.filter((res) => {
      const fullName = `${res.firstname} ${
        res.middlename ? res.middlename + " " : ""
      }${res.lastname}`.toLowerCase();
      return fullName.includes(value.toLowerCase());
    });

    setSubjectSuggestions(matches);
    setBlotterForm((prevForm) => ({
      ...prevForm,
      subjectname: value,
      subjectID: "",
      subjectaddress: "",
    }));
  };

  const handleSubjectSuggestionClick = (res) => {
    const fullName = `${res.firstname} ${
      res.middlename ? res.middlename + " " : ""
    }${res.lastname}`;

    setBlotterForm((prevForm) => ({
      ...prevForm,
      subjectID: res._id,
      subjectname: fullName,
      subjectaddress: res.address,
    }));

    setSubjectSuggestions([]);
  };

  console.log(blotterForm);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[
          MyStyles.scrollContainer,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
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

        <Text>Subject Name:</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: "black", height: 30 }}
          value={blotterForm.subjectname}
          type="text"
          onChangeText={handleSubjectChange}
          autoComplete="off"
        />
        {blotterForm.subjectname?.length > 0 &&
          subjectSuggestions?.length > 0 && (
            <View style={styles.suggestionContainer}>
              {subjectSuggestions.map((res) => {
                const fullName = `${res.firstname} ${
                  res.middlename ? res.middlename + " " : ""
                }${res.lastname}`;
                return (
                  <TouchableOpacity
                    key={res._id}
                    onPress={() => handleSubjectSuggestionClick(res)}
                    style={styles.suggestionItem}
                  >
                    <Text>{fullName}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        <Text>Subject Address:</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: "black", height: 30 }}
          value={blotterForm.subjectaddress}
          type="text"
          onChangeText={(text) => handleInputChange("subjectaddress", text)}
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
  );
};

export default Blotter;

const styles = StyleSheet.create({
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
  suggestionContainer: {
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    maxHeight: 150,
    marginTop: 4,
  },
  suggestionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
});
