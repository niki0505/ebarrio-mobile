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
import { MaterialIcons } from "@expo/vector-icons";

const Certificates = () => {
  const insets = useSafeAreaInsets();
  const { logout, user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [certificateForm, setCertificateForm] = useState({
    typeofcertificate: "",
    amount: "",
    purpose: "",
    businessname: "",
    lineofbusiness: "",
    addressnumber: "",
    street: "",
    locationofbusiness: "",
  });

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
      Alert.alert("Certificate requested successfully!");
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
    } else {
      setCertificateForm((prev) => ({
        ...prev,
        [name]: value.value,
      }));
    }
  };

  const handleInputChange = (name, value) => {
    setCertificateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [openTypeofCertificate, setOpenTypeofCertificate] = useState(false);
  console.log(certificateForm);

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

          <Text style={[MyStyles.header, { marginTop: 20 }]}>
            Request Certificate
          </Text>

          <Text style={MyStyles.formMessage}>
            Please select the required information for requesting a document
          </Text>

          <View style={{ gap: 15 }}>
            <View>
              <Text style={MyStyles.inputTitle}>
                Type of Certificate<Text style={{ color: "red" }}>*</Text>
              </Text>
              <Dropdown
                labelField="label"
                valueField="value"
                value={certificateForm.typeofcertificate}
                data={certificates.map((cert) => ({
                  label: cert.name,
                  value: cert.name,
                }))}
                placeholder="Select certificate"
                placeholderStyle={{ color: "gray" }}
                onChange={(itemValue) =>
                  handleDropdownChange({
                    target: { name: "typeofcertificate", value: itemValue },
                  })
                }
                style={MyStyles.input}
              ></Dropdown>
            </View>

            {["Barangay Indigency", "Barangay Clearance"].includes(
              certificateForm.typeofcertificate
            ) && (
              <>
                <View>
                  <Text style={MyStyles.inputTitle}>
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
                    placeholder="Select purpose"
                    placeholderStyle={{ color: "gray" }}
                    onChange={(itemValue) =>
                      handleDropdownChange({
                        target: { name: "purpose", value: itemValue },
                      })
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                </View>
              </>
            )}

            {certificateForm.typeofcertificate ===
              "Barangay Business Clearance" && (
              <>
                <View>
                  <Text style={MyStyles.inputTitle}>
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
                    placeholder="Select street"
                    placeholderStyle={{ color: "gray" }}
                    onChange={(itemValue) =>
                      handleDropdownChange({
                        target: { name: "street", value: itemValue },
                      })
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                </View>

                {certificateForm.street &&
                  certificateForm.street !== "My Address" && (
                    <>
                      <View>
                        <Text style={MyStyles.inputTitle}>
                          Address Number<Text style={{ color: "red" }}>*</Text>
                        </Text>
                        <TextInput
                          placeholder="Enter address number"
                          placeholderStyle={{ color: "gray" }}
                          onChangeText={(text) =>
                            handleInputChange("addressnumber", text)
                          }
                          style={MyStyles.input}
                        />
                      </View>
                    </>
                  )}

                <View>
                  <Text style={MyStyles.inputTitle}>
                    Business Name<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="Enter business name"
                    onChangeText={(text) =>
                      handleInputChange("businessname", text)
                    }
                    style={MyStyles.input}
                  />
                </View>
                <View>
                  <Text style={MyStyles.inputTitle}>
                    Line of Business<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="Enter line of business"
                    onChangeText={(text) =>
                      handleInputChange("lineofbusiness", text)
                    }
                    style={MyStyles.input}
                  />
                </View>
              </>
            )}

            <View>
              <Text style={MyStyles.inputTitle}>Amount</Text>
              <TextInput
                value={certificateForm.amount}
                editable={false}
                style={[MyStyles.input, { backgroundColor: "#f0f0f0" }]}
              />
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

export default Certificates;
