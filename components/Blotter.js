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

//ICONS
import { MaterialIcons } from "@expo/vector-icons";

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
    typeofthecomplaint: "",
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
            size={30}
            color="#04384E"
          />

          <Text style={[MyStyles.header, { marginTop: 20, marginBottom: 0 }]}>
            File a Blotter
          </Text>
          <Text style={MyStyles.formMessage}>
            Please select the required information for filing a blotter
          </Text>
          <View style={{ gap: 15, marginVertical: 30 }}>
            <View>
              <Text style={MyStyles.inputLabel}>
                Type of the Incident<Text style={{ color: "red" }}>*</Text>
              </Text>
              <Dropdown
                labelField="label"
                valueField="value"
                value={blotterForm.typeofthecomplaint}
                data={typeList.map((type) => ({
                  label: type,
                  value: type,
                }))}
                placeholder="Select"
                placeholderStyle={{
                  color: "#808080",
                  fontFamily: "QuicksandMedium",
                  fontSize: 16,
                }}
                selectedTextStyle={{
                  color: "#000",
                  fontFamily: "QuicksandMedium",
                  fontSize: 16,
                }}
                onChange={(itemValue) =>
                  handleDropdownChange({
                    target: { name: "typeofthecomplaint", value: itemValue },
                  })
                }
                style={MyStyles.input}
              ></Dropdown>
            </View>

            <View>
              <Text style={MyStyles.inputLabel}>
                Subject Name<Text style={{ color: "red" }}>*</Text>
              </Text>
              <TextInput
                placeholder="Enter subject name"
                style={MyStyles.input}
                value={blotterForm.subjectname}
                type="text"
                onChangeText={handleSubjectChange}
                autoComplete="off"
              />
              {blotterForm.subjectname?.length > 0 &&
                subjectSuggestions?.length > 0 && (
                  <View style={MyStyles.suggestionContainer}>
                    {subjectSuggestions.map((res) => {
                      const fullName = `${res.firstname} ${
                        res.middlename ? res.middlename + " " : ""
                      }${res.lastname}`;
                      return (
                        <TouchableOpacity
                          key={res._id}
                          onPress={() => handleSubjectSuggestionClick(res)}
                          style={MyStyles.suggestionItem}
                        >
                          <Text>{fullName}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
            </View>

            <View>
              <Text style={MyStyles.inputLabel}>
                Subject Address<Text style={{ color: "red" }}>*</Text>
              </Text>
              <TextInput
                placeholder="Enter subject address"
                style={MyStyles.input}
                value={blotterForm.subjectaddress}
                type="text"
                onChangeText={(text) =>
                  handleInputChange("subjectaddress", text)
                }
              />
            </View>

            <View>
              <Text style={MyStyles.inputLabel}>
                Details of the Incident<Text style={{ color: "red" }}>*</Text>
              </Text>
              <TextInput
                placeholder="Enter details of the accident"
                style={MyStyles.input}
                value={blotterForm.details}
                type="text"
                maxLength={3000}
                onChangeText={(text) => handleInputChange("details", text)}
              />
              <Text
                style={{
                  textAlign: "right",
                  color: "#808080",
                  fontFamily: "QuicksandSemiBold",
                }}
              >
                {blotterForm.details.length}/3000
              </Text>
            </View>
          </View>

          <TouchableOpacity style={MyStyles.button} onPress={handleSubmit}>
            <Text style={MyStyles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Blotter;
