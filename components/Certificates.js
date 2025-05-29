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
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { Dropdown } from "react-native-element-dropdown";
import api from "../api";
import { MyStyles } from "./stylesheet/MyStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

//ICONS
import { MaterialIcons } from "@expo/vector-icons";

const Certificates = () => {
  const insets = useSafeAreaInsets();
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [typeErrors, setTypeErrors] = useState(null);
  const [purposeError, setPurposeError] = useState(null);
  const [streetError, setStreetError] = useState(null);
  const [busNameError, setBusNameError] = useState(null);
  const [lineBusError, setLineBusError] = useState(null);
  const initialForm = {
    typeofcertificate: "",
    amount: "",
    purpose: "",
    businessname: "",
    lineofbusiness: "",
    addressnumber: "",
    street: "",
    locationofbusiness: "",
  };
  const [certificateForm, setCertificateForm] = useState(initialForm);

  const certificates = [
    { name: "Barangay Indigency", price: "₱10.00" },
    { name: "Barangay Clearance", price: "₱10.00" },
    { name: "Barangay Business Clearance", price: "₱30.00" },
  ];

  const streetList = [
    "Zapote-Molino Road",
    "1st Street",
    "2nd Street",
    "3rd Street",
    "4th Street",
    "5th Street",
    "6th Street",
    "8th Street",
    "8th Street Exnt",
    "5th Street Exnt",
    "Dominga Rivera Street",
    "Tabing-Ilog Street",
    "Arko",
    "9th Street",
    "10th Street",
    "11th Street",
    "My Address",
  ];

  const purpose = ["ALS Requirement", "Financial Assistance"];

  const certificateFields = {
    "Barangay Indigency": ["typeofcertificate", "purpose", "amount"],
    "Barangay Clearance": ["typeofcertificate", "purpose", "amount"],
    "Barangay Business Clearance": [
      "typeofcertificate",
      "addressnumber",
      "street",
      "businessname",
      "lineofbusiness",
      "amount",
    ],
  };

  const handleConfirm = () => {
    if (!certificateForm.typeofcertificate) {
      setTypeErrors("This field is required.");
      return;
    } else {
      setTypeErrors(null);

      if (
        certificateForm.typeofcertificate === "Barangay Indigency" ||
        certificateForm.typeofcertificate === "Barangay Clearance"
      ) {
        if (!certificateForm.purpose) {
          setPurposeError("This field is required.");
          return;
        } else {
          setPurposeError(null);
        }
      } else if (
        certificateForm.typeofcertificate === "Barangay Business Clearance"
      ) {
        let hasError = false;

        if (!certificateForm.street) {
          setStreetError("This field is required.");
          hasError = true;
        } else {
          setStreetError(null);
        }

        if (!certificateForm.businessname) {
          setBusNameError("This field is required.");
          hasError = true;
        } else {
          setBusNameError(null);
        }

        if (!certificateForm.lineofbusiness) {
          setLineBusError("This field is required.");
          hasError = true;
        } else {
          setLineBusError(null);
        }

        if (hasError) return;
      }
    }

    Alert.alert(
      "Confirm",
      "Are you sure you want to request a document?",
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
    const requiredFields =
      certificateFields[certificateForm.typeofcertificate] || [];

    const filteredData = requiredFields.reduce((obj, key) => {
      if (certificateForm[key] !== undefined) {
        obj[key] = certificateForm[key];
      }
      return obj;
    }, {});

    if (
      certificateForm.typeofcertificate === "Barangay Business Clearance" &&
      certificateForm.street
    ) {
      const fullAddress = certificateForm.addressnumber
        ? `${certificateForm.addressnumber} ${certificateForm.street} Aniban 2, Bacoor, Cavite`
        : `${certificateForm.street} Aniban 2, Bacoor, Cavite`;

      filteredData.locationofbusiness = fullAddress;
      delete filteredData.addressnumber;
      delete filteredData.street;
    }

    if (
      certificateForm.typeofcertificate === "Barangay Business Clearance" &&
      certificateForm.street === "My Address"
    ) {
      filteredData.locationofbusiness = "Resident's Address";
      delete filteredData.addressnumber;
      delete filteredData.street;
    }

    try {
      await api.post("/sendcertrequest", {
        filteredData,
        userID: user.userID,
      });

      navigation.navigate("SuccessfulPage", {
        service: "Document",
      });
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleDropdownChange = ({ target }) => {
    const { name, value } = target;
    if (name === "typeofcertificate") {
      const selectedCert = certificates.find(
        (cert) => cert.name === value.value
      );
      setCertificateForm((prev) => ({
        ...prev,
        [name]: value.value,
        amount: selectedCert ? selectedCert.price : "",
      }));
      setTypeErrors(null);
    } else {
      setCertificateForm((prev) => ({
        ...prev,
        [name]: value.value,
      }));
      setPurposeError(null);
      setStreetError(null);
    }
  };

  const handleInputChange = (name, value) => {
    setCertificateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "businessname") {
      setBusNameError(!value ? "This field is required." : null);
    }
    if (name === "lineofbusiness") {
      setLineBusError(!value ? "This field is required." : null);
    }
  };

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
            Request Document
          </Text>

          <Text style={MyStyles.formMessage}>
            Please select the required information for requesting a document
          </Text>

          <View style={{ gap: 15, marginVertical: 30 }}>
            <View>
              <Text style={MyStyles.inputLabel}>
                Type of Document<Text style={{ color: "red" }}>*</Text>
              </Text>
              <Dropdown
                labelField="label"
                valueField="value"
                value={certificateForm.typeofcertificate}
                data={certificates.map((cert) => ({
                  label: cert.name,
                  value: cert.name,
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
                    target: { name: "typeofcertificate", value: itemValue },
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

            {["Barangay Indigency", "Barangay Clearance"].includes(
              certificateForm.typeofcertificate
            ) && (
              <>
                <View>
                  <Text style={MyStyles.inputLabel}>
                    Purpose<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    value={certificateForm.purpose}
                    data={purpose.map((purp) => ({
                      label: purp,
                      value: purp,
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
                        target: { name: "purpose", value: itemValue },
                      })
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                  {purposeError ? (
                    <Text
                      style={{
                        color: "red",
                        fontFamily: "QuicksandMedium",
                        fontSize: 16,
                      }}
                    >
                      {purposeError}
                    </Text>
                  ) : null}
                </View>
              </>
            )}

            {certificateForm.typeofcertificate ===
              "Barangay Business Clearance" && (
              <>
                <View>
                  <Text style={MyStyles.inputLabel}>
                    Street<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    value={certificateForm.street}
                    data={streetList.map((street) => ({
                      label: street,
                      value: street,
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
                        target: { name: "street", value: itemValue },
                      })
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                  {streetError ? (
                    <Text
                      style={{
                        color: "red",
                        fontFamily: "QuicksandMedium",
                        fontSize: 16,
                      }}
                    >
                      {streetError}
                    </Text>
                  ) : null}
                </View>

                {certificateForm.street &&
                  certificateForm.street !== "My Address" && (
                    <>
                      <View>
                        <Text style={MyStyles.inputLabel}>Address Number</Text>
                        <TextInput
                          placeholder="Enter address number"
                          placeholderStyle={{ color: "#808080" }}
                          onChangeText={(text) =>
                            handleInputChange("addressnumber", text)
                          }
                          style={MyStyles.input}
                        />
                      </View>
                    </>
                  )}
                <View>
                  <Text style={MyStyles.inputLabel}>
                    Business Name<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="Enter business name"
                    onChangeText={(text) =>
                      handleInputChange("businessname", text)
                    }
                    style={MyStyles.input}
                    value={certificateForm.businessname}
                  />
                  {busNameError ? (
                    <Text
                      style={{
                        color: "red",
                        fontFamily: "QuicksandMedium",
                        fontSize: 16,
                      }}
                    >
                      {busNameError}
                    </Text>
                  ) : null}
                </View>
                <View>
                  <Text style={MyStyles.inputLabel}>
                    Line of Business<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="Enter line of business"
                    onChangeText={(text) =>
                      handleInputChange("lineofbusiness", text)
                    }
                    style={MyStyles.input}
                    value={certificateForm.lineofbusinesss}
                  />
                  {lineBusError ? (
                    <Text
                      style={{
                        color: "red",
                        fontFamily: "QuicksandMedium",
                        fontSize: 16,
                      }}
                    >
                      {lineBusError}
                    </Text>
                  ) : null}
                </View>
              </>
            )}

            <View>
              <Text style={MyStyles.inputLabel}>Amount</Text>
              <TextInput
                value={certificateForm.amount}
                editable={false}
                style={[MyStyles.input, { backgroundColor: "#f0f0f0" }]}
              />
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

export default Certificates;
