import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import AppLogo from "../assets/applogo-darkbg.png";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import CheckBox from "./CheckBox";

//ICONS
import { useState, useEffect, useContext } from "react";
import { InfoContext } from "../context/InfoContext";
import axios from "axios";

const ResidentForm = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isIDProcessing, setIsIDProcessing] = useState(false);
  const [isSignProcessing, setIsSignProcessing] = useState(false);
  const [residents, setResidents] = useState([]);
  const [residentForm, setResidentForm] = useState({
    id: "",
    signature: "",
    firstname: "",
    middlename: "",
    lastname: "",
    suffix: "",
    alias: "",
    salutation: "",
    sex: "",
    gender: "",
    birthdate: "",
    age: "",
    birthplace: "",
    civilstatus: "",
    bloodtype: "",
    religion: "",
    nationality: "",
    voter: "",
    precinct: "",
    deceased: "",
    email: "",
    mobilenumber: "+63",
    telephone: "+63",
    facebook: "",
    emergencyname: "",
    emergencymobilenumber: "+63",
    emergencyaddress: "",
    housenumber: "",
    street: "",
    HOAname: "",
    address: "",
    mother: "",
    father: "",
    spouse: "",
    siblings: [],
    children: [],
    numberofsiblings: "",
    numberofchildren: "",
    employmentstatus: "",
    employmentfield: "",
    occupation: "",
    monthlyincome: "",
    educationalattainment: "",
    typeofschool: "",
    householdno: "",
    householdposition: "",
    head: "",
    course: "",
    is4Ps: false,
    isSenior: false,
    isInfant: false,
    isChild: false,
    isPregnant: false,
    isPWD: false,
    isSoloParent: false,
    philhealthid: "",
    philhealthtype: "",
    philhealthcategory: "",
    haveHypertension: false,
    haveDiabetes: false,
    haveTubercolosis: false,
    haveSurgery: false,
    lastmenstrual: "",
    haveFPmethod: false,
    fpmethod: "",
    fpstatus: "",
  });

  // DROPDOWN VALUES
  const suffixList = ["Jr.", "Sr.", "I", "II", "III", "IV"];
  const salutationList = [
    "Mr.",
    "Mrs.",
    "Mx.",
    "Dr.",
    "Prof.",
    "Rev.",
    "Hon.",
    "Capt.",
    "Col.",
    "Gen.",
    "Lt.",
    "Sgt.",
  ];
  const sexList = ["Male", "Female"];
  const genderList = [
    "Male",
    "Female",
    "Non-binary",
    "Genderfluid",
    "Agender",
    "Other",
  ];
  const civilstatusList = [
    "Single",
    "Married",
    "Widower",
    "Separated",
    "Annulled",
    "Cohabitation",
  ];
  const bloodtypeList = ["A", "A-", "B", "B-", "AB", "AB-", "O", "O-"];
  const religionList = [
    "Adventist",
    "Aglipayan (Philippine Independence Church)",
    "Baptist World Alliance",
    "Born Again Christian",
    "Church of Christ",
    "Church Jesus Christ and the Latter Day Saints",
    "Church of the Nazarene",
    "El Shaddai",
    "Evangelical",
    "Full Gospel",
    "Iglesia ni Cristo",
    "Islam",
    "Jehovah’s Witnesses",
    "Judaism",
    "MCGI (Dating Daan)",
    "Methodist",
    "Mormons",
    "Pentecost",
    "Protestants",
    "Roman Catholic",
    "Seventh Day Adventists (Central Phil. Union Conf.)",
    "Worldwide Church of God",
    "Other",
  ];
  const nationalityList = [
    "Filipino",
    "American",
    "Chinese",
    "Indian",
    "Japanese",
    "Korean",
    "Australian",
    "British",
    "Canadian",
    "German",
    "French",
    "Spanish",
    "Italian",
    "Mexican",
    "Russian",
    "Other",
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
  ];

  const employmentstatusList = [
    "Employed",
    "Part-Time",
    "Student",
    "Unemployed",
    "Seasonal",
    "Contractual",
    "Compensation",
    "Self-Employed",
    "Retired",
    "Displaced Worker",
    "Homemaker",
    "Intern",
    "Working for Private Household",
    "Working for Private Business/Establishment/Farm",
    "Working for Government/Government Corporation",
    "Self-Employed with No Paid Employee",
    "Employer in Own Family-Oriented Farm/Business",
    "Working with Pay on Own-Family Operated Farm/Business",
    "Working without Pay on Own-Family Operated Farm/Business",
  ];

  const monthlyincomeList = [
    "0-1,000",
    "1,001-5,000",
    "5,001-10,000",
    "10,001-25,000",
    "25,001-50,000",
    "50,001-75,000",
    "75,001-100,000",
    "100,001-250,000",
    "250,001-500,000",
    "500,001-1,000,000",
    "1,000,001+",
  ];

  const educationalattainmentList = [
    "None",
    "Kinder",
    "Elementary Student",
    "Elementary Undergrad",
    "Elementary Graduate",
    "High School Student",
    "High School Undergrad",
    "High School Graduate",
    "Vocational Course",
    "College Student",
    "College Undergrad",
    "College Graduate",
    "Postgraduate",
  ];

  const philhealthcategoryList = [
    "Formal Economy Private",
    "Formal Economy Government",
    "Informal Economy",
    "NHTS",
    "Senior Citizen",
    "Indigenous People",
    "Unknown",
  ];

  const fpmethodList = [
    "COC",
    "POP",
    "Injectables",
    "IUD",
    "Condom",
    "LAM",
    "BTL",
    "Implant",
    "SDM",
    "DPT",
    "Withdrawal",
    "Others",
  ];

  const fpstatusList = [
    "New Acceptor",
    "Current User",
    "Changing Method",
    "Changing Clinic",
    "Dropout",
    "Restarter",
  ];

  const watersourceList = [
    "Point Source",
    "Communal Faucet",
    "Individual Connection",
    "Others",
  ];

  const toiletfacilityList = [
    "Pour/flush type connected to septic tank",
    "Pour/flush toilet connected to septic tank AND to sewerage system",
    "Ventilated Pit Latrine",
    "Water-sealed Toilet",
    "Overhung Latrine",
    "Open Pit Latrine",
    "Without Toilet",
  ];

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await axios.get(
          "https://ebarrio-mobile-backend.onrender.com/api/getresidents"
        );
        setResidents(response.data);
      } catch (error) {
        console.error("❌ Failed to fetch residents:", error);
      }
    };
    fetchResidents();
  }, []);

  const pickIDImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "We need access to your photos to let you upload an image."
        );
        return;
      }

      setIsIDProcessing(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setResidentForm((prev) => ({
          ...prev,
          id: result.assets[0].uri,
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Something went wrong while picking the image.");
    } finally {
      setIsIDProcessing(false);
    }
  };

  const toggleIDCamera = async () => {
    const permissionResult = await ImagePicker.getCameraPermissionsAsync();

    if (!permissionResult.granted) {
      const askPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!askPermission.granted) {
        Alert.alert("Permission Denied", "Camera permission is required.");
        return;
      }
    }
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 1,
      });

      if (!result.canceled) {
        setResidentForm((prev) => ({
          ...prev,
          id: result.assets[0].uri,
        }));
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to open camera.");
    }
  };

  const pickSigImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "We need access to your photos to let you upload an image."
        );
        return;
      }

      setIsSignProcessing(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setResidentForm((prev) => ({
          ...prev,
          signature: result.assets[0].uri,
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Something went wrong while picking the image.");
    } finally {
      setIsSignProcessing(false);
    }
  };

  const toggleSigCamera = async () => {
    const permissionResult = await ImagePicker.getCameraPermissionsAsync();

    if (!permissionResult.granted) {
      const askPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!askPermission.granted) {
        Alert.alert("Permission Denied", "Camera permission is required.");
        return;
      }
    }
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 1,
      });

      if (!result.canceled) {
        setResidentForm((prev) => ({
          ...prev,
          signature: result.assets[0].uri,
        }));
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to open camera.");
    }
  };

  const handleInputChange = (name, value) => {
    setResidentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDropdownChange = (name, value) => {
    setResidentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (name, value) => {
    setResidentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name) => {
    setResidentForm((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const residentOptions = residents.map((resident) => ({
    label: resident.middlename
      ? `${resident.firstname} ${resident.middlename} ${resident.lastname}`
      : `${resident.firstname} ${resident.lastname}`,
    value: resident._id,
  }));

  const renderSiblingsDropdown = () => {
    const numberOfSiblings = parseInt(residentForm.numberofsiblings, 10) || 0;

    const siblingsDropdowns = [];
    for (let i = 0; i < numberOfSiblings; i++) {
      siblingsDropdowns.push(
        <View key={i} style={{ marginVertical: 8 }}>
          <Text style={{ marginBottom: 4 }}>Sibling {i + 1}</Text>
          <Dropdown
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
            }}
            data={residentOptions}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={residentForm.siblings?.[i] || null}
            onChange={(item) =>
              handleMultipleDropdownChange(item.value, i, "siblings")
            }
          />
        </View>
      );
    }
    return siblingsDropdowns;
  };

  const renderChildrenDropdown = () => {
    const numberOfChildren = parseInt(residentForm.numberofchildren, 10) || 0;

    const childrenDropdowns = [];
    for (let i = 0; i < numberOfChildren; i++) {
      childrenDropdowns.push(
        <View key={i} style={{ marginVertical: 8 }}>
          <Text style={{ marginBottom: 4 }}>Child {i + 1}</Text>
          <Dropdown
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
            }}
            data={residentOptions}
            labelField="label"
            valueField="value"
            placeholder="Select"
            value={residentForm.children?.[i] || null}
            onChange={(item) =>
              handleMultipleDropdownChange(item.value, i, "children")
            }
          />
        </View>
      );
    }
    return childrenDropdowns;
  };

  const handleMultipleDropdownChange = (selectedValue, index, field) => {
    const updatedArray = [...(residentForm[field] || [])];
    updatedArray[index] = selectedValue;
    setResidentForm({
      ...residentForm,
      [field]: updatedArray,
    });
  };

  console.log(residentForm);

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#04384E" }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 4, backgroundColor: "#04384E" }}>
          <View style={{ flex: 1, alignSelf: "center" }}>
            <Image source={AppLogo} style={{ width: "180", height: "180" }} />
          </View>

          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#F0F4F7",
              borderRadius: 30,
              flex: 3,
              marginBottom: "-10",
            }}
          >
            <ScrollView
              style={{ width: "100%" }}
              contentContainerStyle={{
                padding: 30,
                alignItems: "center",
              }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={[MyStyles.header, { alignSelf: "flex-start" }]}>
                Create your Account
              </Text>

              {/* Personal Information */}

              {/* ID */}
              <Text style={{ color: "red" }}>Personal Information</Text>
              <View style={styles.uploadBox}>
                <View style={styles.previewContainer}>
                  {isIDProcessing ? (
                    <ActivityIndicator size="small" color="#0000ff" />
                  ) : residentForm.id ? (
                    <Image
                      source={{ uri: residentForm.id }}
                      style={styles.image}
                    />
                  ) : (
                    <View style={styles.placeholder}>
                      <Text style={styles.placeholderText}>
                        Attach ID Picture
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.buttons}>
                  <TouchableOpacity
                    onPress={toggleIDCamera}
                    style={styles.button}
                  >
                    <Text>📷</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={pickIDImage} style={styles.button}>
                    <Text>📤</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Signature */}
              <View style={styles.uploadBox}>
                <View style={styles.previewContainer}>
                  {isSignProcessing ? (
                    <ActivityIndicator size="small" color="#0000ff" />
                  ) : residentForm.signature ? (
                    <Image
                      source={{ uri: residentForm.signature }}
                      style={styles.image}
                    />
                  ) : (
                    <View style={styles.placeholder}>
                      <Text style={styles.placeholderText}>
                        Attach Signature
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.buttons}>
                  <TouchableOpacity
                    onPress={toggleSigCamera}
                    style={styles.button}
                  >
                    <Text>📷</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={pickSigImage}
                    style={styles.button}
                  >
                    <Text>📤</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ marginVertical: 30, gap: 15, width: "100%" }}>
                <View>
                  <Text style={MyStyles.inputLabel}>
                    First Name<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    style={MyStyles.input}
                    placeholder="First name"
                    value={residentForm.firstname}
                    onChangeText={(text) =>
                      handleInputChange("firstname", text)
                    }
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Middle Name</Text>
                  <TextInput
                    style={MyStyles.input}
                    placeholder="Last name"
                    value={residentForm.middlename}
                    onChangeText={(text) =>
                      handleInputChange("middlename", text)
                    }
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>
                    Last Name<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    style={MyStyles.input}
                    placeholder="Last name"
                    value={residentForm.lastname}
                    onChangeText={(text) => handleInputChange("lastname", text)}
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Suffix</Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    value={residentForm.suffix}
                    data={suffixList.map((purp) => ({
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
                    onChange={(item) =>
                      handleDropdownChange("suffix", item.value)
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Alias</Text>
                  <TextInput
                    style={MyStyles.input}
                    value={residentForm.alias}
                    onChangeText={(text) => handleInputChange("alias", text)}
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Salutation</Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    value={residentForm.salutation}
                    data={salutationList.map((purp) => ({
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
                    onChange={(item) =>
                      handleDropdownChange("salutation", item.value)
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>
                    Sex<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    value={residentForm.sex}
                    data={sexList.map((purp) => ({
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
                    onChange={(item) => handleDropdownChange("sex", item.value)}
                    style={MyStyles.input}
                  ></Dropdown>
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Gender</Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    value={residentForm.gender}
                    data={genderList.map((purp) => ({
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
                    onChange={(item) =>
                      handleDropdownChange("gender", item.value)
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>
                    Birthdate<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <DateTimePicker
                    value={residentForm.birthdate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        handleInputChange("birthdate", selectedDate);
                      }
                    }}
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Age</Text>
                  <TextInput
                    style={MyStyles.input}
                    keyboardType="numeric"
                    readOnly
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Birthplace</Text>
                  <TextInput
                    style={MyStyles.input}
                    value={residentForm.birthplace}
                    onChangeText={(text) =>
                      handleInputChange("birthplace", text)
                    }
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>
                    Civil Status<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    value={residentForm.civilstatus}
                    data={civilstatusList.map((purp) => ({
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
                    onChange={(item) =>
                      handleDropdownChange("civilstatus", item.value)
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>PhilHealth ID</Text>
                  <TextInput
                    style={MyStyles.input}
                    keyboardType="numeric"
                    value={residentForm.philhealthid}
                    onChangeText={(text) =>
                      handleInputChange("philhealthid", text)
                    }
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>PhilHealth Category</Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    value={residentForm.philhealthcategory}
                    data={philhealthcategoryList.map((purp) => ({
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
                    onChange={(item) =>
                      handleDropdownChange("philhealthcategory", item.value)
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Last Menstrual Period</Text>
                  <DateTimePicker
                    mode="date"
                    display="default"
                    value={residentForm.lastmenstrual || new Date()}
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        handleInputChange("lastmenstrual", selectedDate);
                      }
                    }}
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Using any FP method?</Text>
                  <View style={styles.radioGroup}>
                    {["Yes", "No"].map((option) => (
                      <Pressable
                        key={option}
                        style={styles.radioOption}
                        onPress={() => handleRadioChange("fpmethod", option)}
                      >
                        <View style={styles.radioCircle}>
                          {residentForm.fpmethod === option && (
                            <View style={styles.radioDot} />
                          )}
                        </View>
                        <Text>{option}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>
                    Family Planning Method
                  </Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    value={residentForm.fpmethod}
                    data={fpmethodList.map((purp) => ({
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
                    onChange={(item) =>
                      handleDropdownChange("fpmethod", item.value)
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>
                    Family Planning Status
                  </Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    value={residentForm.fpstatus}
                    data={fpstatusList.map((purp) => ({
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
                    onChange={(item) =>
                      handleDropdownChange("fpstatus", item.value)
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Blood Type</Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    value={residentForm.bloodtype}
                    data={bloodtypeList.map((purp) => ({
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
                    onChange={(item) =>
                      handleDropdownChange("bloodtype", item.value)
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Religion</Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    value={residentForm.religion}
                    data={religionList.map((purp) => ({
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
                    onChange={(item) =>
                      handleDropdownChange("religion", item.value)
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>
                    Nationality<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    value={residentForm.nationality}
                    data={nationalityList.map((purp) => ({
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
                    onChange={(item) =>
                      handleDropdownChange("nationality", item.value)
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Registered Voter?</Text>
                  <View style={styles.radioGroup}>
                    {["Yes", "No"].map((option) => (
                      <Pressable
                        key={option}
                        style={styles.radioOption}
                        onPress={() => handleRadioChange("voter", option)}
                      >
                        <View style={styles.radioCircle}>
                          {residentForm.voter === option && (
                            <View style={styles.radioDot} />
                          )}
                        </View>
                        <Text>{option}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Precinct</Text>
                  <TextInput
                    style={MyStyles.input}
                    keyboardType="numeric"
                    value={residentForm.precinct}
                    onChangeText={(text) => handleInputChange("precinct", text)}
                  />
                </View>

                <View style={{ marginVertical: 10 }}>
                  <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
                    Classification
                  </Text>

                  <CheckBox
                    label="4Ps Beneficiary"
                    value={residentForm.is4Ps}
                    onValueChange={() => handleCheckboxChange("is4Ps")}
                  />

                  <CheckBox
                    label="Senior Citizen"
                    value={residentForm.isSenior}
                    onValueChange={() => handleCheckboxChange("isSenior")}
                    disabled
                  />

                  <CheckBox
                    label="Infant"
                    value={residentForm.isInfant}
                    onValueChange={() => handleCheckboxChange("isInfant")}
                    disabled
                  />

                  <CheckBox
                    label="Child"
                    value={residentForm.isChild}
                    onValueChange={() => handleCheckboxChange("isChild")}
                    disabled
                  />

                  {residentForm.sex === "Female" && (
                    <CheckBox
                      label="Pregnant"
                      value={residentForm.isPregnant}
                      onValueChange={() => handleCheckboxChange("isPregnant")}
                    />
                  )}

                  <CheckBox
                    label="Person with Disability (PWD)"
                    value={residentForm.isPWD}
                    onValueChange={() => handleCheckboxChange("isPWD")}
                  />

                  <CheckBox
                    label="Solo Parent"
                    value={residentForm.isSoloParent}
                    onValueChange={() => handleCheckboxChange("isSoloParent")}
                  />
                </View>

                <View style={{ marginVertical: 10 }}>
                  <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
                    Medical History
                  </Text>

                  <CheckBox
                    label="Hypertension"
                    value={residentForm.haveHypertension}
                    onValueChange={() =>
                      handleCheckboxChange("haveHypertension")
                    }
                  />

                  <CheckBox
                    label="Diabetes"
                    value={residentForm.haveDiabetes}
                    onValueChange={() => handleCheckboxChange("haveDiabetes")}
                  />

                  <CheckBox
                    label="Tubercolosis"
                    value={residentForm.haveTubercolosis}
                    onValueChange={() =>
                      handleCheckboxChange("haveTubercolosis")
                    }
                  />

                  <CheckBox
                    label="Surgery"
                    value={residentForm.haveSurgery}
                    onValueChange={() => handleCheckboxChange("haveSurgery")}
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Deceased</Text>
                  <View style={styles.radioGroup}>
                    {["Yes", "No"].map((option) => (
                      <Pressable
                        key={option}
                        style={styles.radioOption}
                        onPress={() => handleRadioChange("deceased", option)}
                      >
                        <View style={styles.radioCircle}>
                          {residentForm.deceased === option && (
                            <View style={styles.radioDot} />
                          )}
                        </View>
                        <Text>{option}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Contact Information */}

                <Text style={{ color: "red" }}>Contact Information</Text>
                <View>
                  <Text style={MyStyles.inputLabel}>Email</Text>
                  <TextInput
                    style={MyStyles.input}
                    value={residentForm.email}
                    onChangeText={(text) => handleInputChange("email", text)}
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>
                    Mobile Number<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    style={MyStyles.input}
                    keyboardType="numeric"
                    value={residentForm.mobilenumber}
                    onChangeText={(text) =>
                      handleInputChange("mobilenumber", text)
                    }
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Telephone</Text>
                  <TextInput
                    style={MyStyles.input}
                    keyboardType="numeric"
                    value={residentForm.telephone}
                    onChangeText={(text) =>
                      handleInputChange("telephone", text)
                    }
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Facebook</Text>
                  <TextInput
                    style={MyStyles.input}
                    value={residentForm.facebook}
                    onChangeText={(text) => handleInputChange("facebook", text)}
                  />
                </View>

                {/* In Case Of Emergency Situation */}

                <Text style={{ color: "red" }}>
                  In Case Of Emergency Situation
                </Text>
                <View>
                  <Text style={MyStyles.inputLabel}>
                    Name<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    style={MyStyles.input}
                    value={residentForm.emergencyname}
                    onChangeText={(text) =>
                      handleInputChange("emergencyname", text)
                    }
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>
                    Mobile Number<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    style={MyStyles.input}
                    value={residentForm.emergencymobilenumber}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      handleInputChange("emergencymobilenumber", text)
                    }
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>
                    Address<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    style={MyStyles.input}
                    value={residentForm.emergencyaddress}
                    onChangeText={(text) =>
                      handleInputChange("emergencyaddress", text)
                    }
                  />
                </View>

                {/* Family Information */}

                <Text style={{ color: "red" }}>Family Information</Text>

                <View>
                  <Text style={MyStyles.inputLabel}>Mother</Text>
                  <Dropdown
                    style={MyStyles.input}
                    data={residents
                      .filter((res) => res.sex === "Female")
                      .map((res) => ({
                        label: res.middlename
                          ? `${res.firstname} ${res.middlename} ${res.lastname}`
                          : `${res.firstname} ${res.lastname}`,
                        value: res._id,
                      }))}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Mother"
                    value={residentForm.mother}
                    onChange={(item) => handleInputChange("mother", item.value)}
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Father</Text>
                  <Dropdown
                    style={MyStyles.input}
                    data={residents
                      .filter((res) => res.sex === "Male")
                      .map((res) => ({
                        label: res.middlename
                          ? `${res.firstname} ${res.middlename} ${res.lastname}`
                          : `${res.firstname} ${res.lastname}`,
                        value: res._id,
                      }))}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Father"
                    value={residentForm.father}
                    onChange={(item) => handleInputChange("father", item.value)}
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Spouse</Text>
                  <Dropdown
                    style={MyStyles.input}
                    data={residents.map((res) => ({
                      label: res.middlename
                        ? `${res.firstname} ${res.middlename} ${res.lastname}`
                        : `${res.firstname} ${res.lastname}`,
                      value: res._id,
                    }))}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Spouse"
                    value={residentForm.spouse}
                    onChange={(item) => handleInputChange("spouse", item.value)}
                  />
                </View>

                <View style={{ marginVertical: 8 }}>
                  <Text>Number of Siblings</Text>
                  <TextInput
                    value={residentForm.numberofsiblings}
                    onChangeText={(text) =>
                      setResidentForm({
                        ...residentForm,
                        numberofsiblings: text.replace(/[^0-9]/g, ""),
                      })
                    }
                    keyboardType="numeric"
                    maxLength={1}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 10,
                    }}
                  />
                </View>
                {parseInt(residentForm.numberofsiblings, 10) > 0 &&
                  renderSiblingsDropdown()}

                <View style={{ marginVertical: 8 }}>
                  <Text>Number of Children</Text>
                  <TextInput
                    value={residentForm.numberofchildren}
                    onChangeText={(text) =>
                      setResidentForm({
                        ...residentForm,
                        numberofchildren: text.replace(/[^0-9]/g, ""),
                      })
                    }
                    keyboardType="numeric"
                    maxLength={1}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 10,
                    }}
                  />
                </View>
                {parseInt(residentForm.numberofchildren, 10) > 0 &&
                  renderChildrenDropdown()}

                {/* Address Information */}
                <Text style={{ color: "red" }}>Address Information</Text>
                <View>
                  <Text style={MyStyles.inputLabel}>House Number</Text>
                  <TextInput
                    style={MyStyles.input}
                    keyboardType="numeric"
                    value={residentForm.housenumber}
                    onChangeText={(text) =>
                      handleInputChange("housenumber", text)
                    }
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>
                    Street<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    value={residentForm.street}
                    data={streetList.map((purp) => ({
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
                    onChange={(item) =>
                      handleDropdownChange("street", item.value)
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>HOA Name</Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    value={residentForm.HOAname}
                    data={[
                      {
                        label: "Bermuda Town Homes",
                        value: "Bermuda Town Homes",
                      },
                    ]}
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
                    onChange={(item) =>
                      handleDropdownChange("street", item.value)
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                </View>

                {/* Household Information */}

                {/* Employment Information */}
                <Text style={{ color: "red" }}>Employment Information</Text>

                <View>
                  <Text style={MyStyles.inputLabel}>
                    Employment Status<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    value={residentForm.employmentstatus}
                    data={employmentstatusList.map((purp) => ({
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
                    onChange={(item) =>
                      handleDropdownChange("employmentstatus", item.value)
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Occupation</Text>
                  <TextInput
                    style={MyStyles.input}
                    value={residentForm.occupation}
                    onChangeText={(text) =>
                      handleInputChange("occupation", text)
                    }
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Monthly Income</Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    value={residentForm.monthlyincome}
                    data={monthlyincomeList.map((purp) => ({
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
                    onChange={(item) =>
                      handleDropdownChange("monthlyincome", item.value)
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                </View>

                {/* Educational Information */}
                <Text style={{ color: "red" }}>Educational Information</Text>

                <View>
                  <Text style={MyStyles.inputLabel}>
                    Educational Attainment
                  </Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    value={residentForm.educationalattainment}
                    data={educationalattainmentList.map((purp) => ({
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
                    onChange={(item) =>
                      handleDropdownChange("educationalattainment", item.value)
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Type of School</Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    value={residentForm.typeofschool}
                    data={[
                      { label: "Public", value: "Public" },
                      { label: "Private", value: "Private" },
                    ]}
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
                    onChange={(item) =>
                      handleDropdownChange("typeofschool", item.value)
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Course</Text>
                  <TextInput
                    style={MyStyles.input}
                    value={residentForm.course}
                    onChangeText={(text) => handleInputChange("course", text)}
                  />
                </View>
              </View>

              <TouchableOpacity style={MyStyles.button}>
                <Text style={MyStyles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default ResidentForm;

const styles = StyleSheet.create({
  container: { margin: 20 },
  label: { fontSize: 16, marginBottom: 5 },
  required: { color: "red" },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
  },
  previewContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#999",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 20,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#444",
  },
});
