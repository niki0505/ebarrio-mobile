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

const Certificates = () => {
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
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Request Certificate</Text>

          <Text>Type of Certificate:</Text>
          <Dropdown
            labelField="label"
            valueField="value"
            value={certificateForm.typeofcertificate}
            data={certificates.map((cert) => ({
              label: cert.name,
              value: cert.name,
            }))}
            placeholder="Select certificate"
            onChange={(itemValue) =>
              handleDropdownChange({
                target: { name: "typeofcertificate", value: itemValue },
              })
            }
          ></Dropdown>

          {["Barangay Indigency", "Barangay Clearance"].includes(
            certificateForm.typeofcertificate
          ) && (
            <>
              <Text>Purpose:</Text>
              <Dropdown
                labelField="label"
                valueField="value"
                value={certificateForm.purpose}
                data={purpose.map((purp) => ({
                  label: purp,
                  value: purp,
                }))}
                placeholder="Select purpose"
                onChange={(itemValue) =>
                  handleDropdownChange({
                    target: { name: "purpose", value: itemValue },
                  })
                }
              ></Dropdown>
            </>
          )}

          {certificateForm.typeofcertificate ===
            "Barangay Business Clearance" && (
            <>
              <Text>Street:</Text>
              <Dropdown
                labelField="label"
                valueField="value"
                value={certificateForm.street}
                data={streetList.map((street) => ({
                  label: street,
                  value: street,
                }))}
                placeholder="Select street"
                onChange={(itemValue) =>
                  handleDropdownChange({
                    target: { name: "street", value: itemValue },
                  })
                }
              ></Dropdown>

              {certificateForm.street &&
                certificateForm.street !== "My Address" && (
                  <>
                    <Text>Address Number:</Text>
                    <TextInput
                      onChangeText={(text) =>
                        handleInputChange("addressnumber", text)
                      }
                      style={styles.input}
                    />
                  </>
                )}

              <Text>Business Name:</Text>
              <TextInput
                onChangeText={(text) => handleInputChange("businessname", text)}
                style={styles.input}
              />

              <Text>Line of Business:</Text>
              <TextInput
                onChangeText={(text) =>
                  handleInputChange("lineofbusiness", text)
                }
                style={styles.input}
              />
            </>
          )}

          <Text>Amount:</Text>
          <TextInput
            value={certificateForm.amount}
            editable={false}
            style={[styles.input, { backgroundColor: "#f0f0f0" }]}
          />

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

export default Certificates;

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
