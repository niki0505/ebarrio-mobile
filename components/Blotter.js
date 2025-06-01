import {
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
import api from "../api";
import { InfoContext } from "../context/InfoContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MyStyles } from "./stylesheet/MyStyles";

//ICONS
import { MaterialIcons } from "@expo/vector-icons";

const Blotter = () => {
  const insets = useSafeAreaInsets();
  const { user } = useContext(AuthContext);
  const { fetchResidents, residents } = useContext(InfoContext);
  const navigation = useNavigation();
  const [subjectSuggestions, setSubjectSuggestions] = useState([]);
  const [typeErrors, setTypeErrors] = useState(null);
  const [subjectError, setSubjectError] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [detailsError, setDetailsError] = useState(null);
  const initialForm = {
    complainantID: user.resID,
    subjectID: "",
    subjectname: "",
    subjectaddress: "",
    typeofthecomplaint: "",
    details: "",
  };

  const [blotterForm, setBlotterForm] = useState(initialForm);

  useEffect(() => {
    fetchResidents();
  }, []);

  const typeList = ["Theft", "Assault", "Physical Injury", "Missing Person"];

  const handleConfirm = async () => {
    let hasError = false;

    if (!blotterForm.typeofthecomplaint) {
      setTypeErrors("This field is required.");
      hasError = true;
    } else {
      setTypeErrors(null);
    }

    if (!blotterForm.subjectID) {
      setSubjectError("This field is required.");
      hasError = true;
    } else {
      setSubjectError(null);
    }

    if (!blotterForm.subjectname) {
      setSubjectError("This field is required.");
      hasError = true;
    } else {
      setSubjectError(null);
    }

    if (!blotterForm.subjectaddress) {
      setAddressError("This field is required.");
      hasError = true;
    } else {
      setAddressError(null);
    }

    if (!blotterForm.details) {
      setDetailsError("This field is required.");
      hasError = true;
    } else {
      setDetailsError(null);
    }

    if (hasError) {
      return;
    }

    Alert.alert(
      "Confirm",
      "Are you sure you want to file a blotter?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            handleSubmit();
          },
        },
      ],
      { cancelable: false }
    );
  };

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
      setBlotterForm(initialForm);
      navigation.navigate("SuccessfulPage", {
        service: "Blotter",
      });
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
    setTypeErrors(null);
  };

  const handleInputChange = (name, value) => {
    setBlotterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "subjectname") {
      setSubjectError(!value ? "This field is required." : null);
    }
    if (name === "subjectaddress") {
      setAddressError(!value ? "This field is required." : null);
    }
    if (name === "details") {
      setDetailsError(!value ? "This field is required." : null);
    }
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
    setSubjectError(null);
    setAddressError(null);
    setSubjectSuggestions([]);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#04384E" }} // para hindi nago-overlap sa status bar when scrolled
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
              {typeErrors ? (
                <Text
                  style={{
                    color: "red",
                    fontFamily: "QuicksandMedium",
                    fontSize: 16,
                  }}
                >
                  {typeErrors}
                </Text>
              ) : null}
            </View>

            <View>
              <Text style={MyStyles.inputLabel}>
                Name of the Accused<Text style={{ color: "red" }}>*</Text>
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
              {subjectError ? (
                <Text
                  style={{
                    color: "red",
                    fontFamily: "QuicksandMedium",
                    fontSize: 16,
                  }}
                >
                  {subjectError}
                </Text>
              ) : null}
            </View>

            <View>
              <Text style={MyStyles.inputLabel}>Address of the Accused</Text>
              <TextInput
                placeholder="Enter subject address"
                style={MyStyles.input}
                value={blotterForm.subjectaddress}
                editable={!blotterForm.subjectID}
                type="text"
                onChangeText={(text) =>
                  handleInputChange("subjectaddress", text)
                }
              />
              {addressError ? (
                <Text
                  style={{
                    color: "red",
                    fontFamily: "QuicksandMedium",
                    fontSize: 16,
                  }}
                >
                  {addressError}
                </Text>
              ) : null}
            </View>

            <View>
              <Text style={MyStyles.inputLabel}>
                Details of the Incident<Text style={{ color: "red" }}>*</Text>
              </Text>
              <TextInput
                placeholder="Enter details of the accident"
                style={[
                  MyStyles.input,
                  { height: 150, textAlignVertical: "top" },
                ]}
                value={blotterForm.details}
                type="text"
                multiline={true}
                numberOfLines={4}
                maxLength={3000}
                onChangeText={(text) => handleInputChange("details", text)}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {detailsError ? (
                  <Text
                    style={{
                      color: "red",
                      fontFamily: "QuicksandMedium",
                      fontSize: 16,
                    }}
                  >
                    {detailsError}
                  </Text>
                ) : null}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      color: "#808080",
                      fontFamily: "QuicksandSemiBold",
                    }}
                  >
                    {blotterForm.details.length}/3000
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity style={MyStyles.button} onPress={handleConfirm}>
            <Text style={MyStyles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Blotter;
