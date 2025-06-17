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
  FlatList,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import AppLogo from "../assets/applogo-darkbg.png";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import CheckBox from "./CheckBox";
import { storage } from "../firebase";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { MaterialIcons } from "@expo/vector-icons";

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
  const [households, setHouseholds] = useState([]);
  const [showBirthdatePicker, setShowBirthdatePicker] = useState(false);
  const [showLastMenstrualPicker, setShowLastMenstrualPicker] = useState(false);
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
  const [householdForm, setHouseholdForm] = useState({
    members: [],
    vehicles: [],
    ethnicity: "",
    tribe: "",
    sociostatus: "",
    nhtsno: "",
    watersource: "",
    toiletfacility: "",
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

  const kindOptions = [
    { label: "Sedan", value: "Sedan" },
    { label: "SUV", value: "SUV" },
    { label: "Motorcycle", value: "Motorcycle" },
    { label: "Van", value: "Van" },
    { label: "Truck", value: "Truck" },
    { label: "Tricycle", value: "Tricycle" },
    { label: "Bicycle", value: "Bicycle" },
    { label: "Other", value: "Other" },
  ];

  const positionList = [
    { label: "Select", value: "" },
    { label: "Spouse", value: "Spouse" },
    { label: "Child", value: "Child" },
    { label: "Parent", value: "Parent" },
    { label: "Sibling", value: "Sibling" },
    { label: "Grandparent", value: "Grandparent" },
    { label: "Grandchild", value: "Grandchild" },
    { label: "In-law", value: "In-law" },
    { label: "Relative", value: "Relative" },
    { label: "Housemate", value: "Housemate" },
    { label: "Househelp", value: "Househelp" },
    { label: "Other", value: "Other" },
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

  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        const response = await axios.get(
          "https://ebarrio-mobile-backend.onrender.com/api/gethouseholds"
        );
        setHouseholds(response.data);
      } catch (error) {
        console.error("❌ Failed to fetch residents:", error);
      }
    };
    fetchHouseholds();
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
          <Text style={[MyStyles.inputLabel, { marginBottom: 4 }]}>
            Sibling {i + 1}
          </Text>
          <Dropdown
            style={MyStyles.input}
            data={residentOptions}
            labelField="label"
            valueField="value"
            placeholder="Select"
            placeholderStyle={{
              color: "#808080",
              fontFamily: "QuicksandMedium",
              fontSize: 16,
            }}
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
          <Text style={[MyStyles.inputLabel, { marginBottom: 4 }]}>
            Child {i + 1}
          </Text>
          <Dropdown
            style={MyStyles.input}
            data={residentOptions}
            labelField="label"
            valueField="value"
            placeholder="Select"
            placeholderStyle={{
              color: "#808080",
              fontFamily: "QuicksandMedium",
              fontSize: 16,
            }}
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

  const handleHouseholdRadioChange = (name, value) => {
    setHouseholdForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHouseholdInputChange = (name, value) => {
    setHouseholdForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHouseholdDropdownChange = (name, value) => {
    setHouseholdForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addVehicle = () => {
    setHouseholdForm((prev) => ({
      ...prev,
      vehicles: [
        ...prev.vehicles,
        { model: "", color: "", kind: "", platenumber: "" },
      ],
    }));
  };

  const removeVehicle = (index) => {
    setHouseholdForm((prev) => ({
      ...prev,
      vehicles: prev.vehicles.filter((_, i) => i !== index),
    }));
  };
  const handleVehicleChange = (index, field, value) => {
    const updatedVehicles = [...householdForm.vehicles];
    updatedVehicles[index][field] = value;
    setHouseholdForm((prev) => ({
      ...prev,
      vehicles: updatedVehicles,
    }));
  };

  const [memberSuggestions, setMemberSuggestions] = useState([[]]);

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...householdForm.members];

    if (field === "resident") {
      updatedMembers[index] = {
        ...updatedMembers[index],
        resident: value,
        resID: "",
      };

      setHouseholdForm((prev) => ({
        ...prev,
        members: updatedMembers,
      }));

      if (value.trim() === "") {
        setMemberSuggestions((prev) => {
          const newSuggestions = [...prev];
          newSuggestions[index] = [];
          return newSuggestions;
        });
        return;
      }

      const matches = residents
        .filter((r) => !r.householdno)
        .filter((res) => {
          const fullName = `${res.firstname} ${
            res.middlename ? res.middlename + " " : ""
          }${res.lastname}`.toLowerCase();
          return fullName.includes(value.toLowerCase());
        });

      setMemberSuggestions((prev) => {
        const newSuggestions = [...prev];
        newSuggestions[index] = matches;
        return newSuggestions;
      });
    } else {
      updatedMembers[index][field] = value;
      setHouseholdForm((prev) => ({
        ...prev,
        members: updatedMembers,
      }));
    }
  };

  const handleMemberSuggestionClick = (index, res) => {
    const fullName = `${res.firstname} ${
      res.middlename ? res.middlename + " " : ""
    }${res.lastname}`;

    const updatedMembers = [...householdForm.members];
    updatedMembers[index] = {
      ...updatedMembers[index],
      resident: fullName,
      resID: res._id,
    };

    setHouseholdForm((prev) => ({
      ...prev,
      members: updatedMembers,
    }));

    setMemberSuggestions((prev) => {
      const newSuggestions = [...prev];
      newSuggestions[index] = [];
      return newSuggestions;
    });
  };

  const addMember = () => {
    setHouseholdForm((prev) => ({
      ...prev,
      members: [...prev.members, { resident: "", position: "", resID: "" }],
    }));
    setMemberSuggestions((prev) => [...prev, []]);
  };

  const removeMember = (index) => {
    setHouseholdForm((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
    setMemberSuggestions((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (residentForm.birthdate) {
      const birthDate = new Date(residentForm.birthdate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      const isSenior =
        age > 60 ||
        (age === 60 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));

      const isInfant = age === 0;
      const isChild = age >= 1 && age <= 17;

      setResidentForm((prev) => ({
        ...prev,
        age,
        isSenior,
        isInfant,
        isChild,
      }));
    }
  }, [residentForm.birthdate]);

  function formatToDateOnly(isoString) {
    const date = new Date(isoString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  async function uploadToFirebase(url) {
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `id_images/${Date.now()}_${randomString}.png`;
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }

  const handleSubmit = async () => {
    try {
      const fulladdress = `${residentForm.housenumber} ${residentForm.street} Aniban 2, Bacoor, Cavite`;
      const idPicture = await uploadToFirebase(residentForm.id);
      const signaturePicture = await uploadToFirebase(residentForm.signature);

      let formattedMobileNumber = residentForm.mobilenumber;
      formattedMobileNumber = "0" + residentForm.mobilenumber.slice(3);

      let formattedEmergencyMobileNumber = residentForm.emergencymobilenumber;
      formattedEmergencyMobileNumber =
        "0" + residentForm.emergencymobilenumber.slice(3);

      let formattedTelephone = residentForm.telephone;
      if (residentForm.telephone !== "+63") {
        formattedTelephone = "0" + residentForm.telephone.slice(3);
        delete residentForm.telephone;
      } else {
        formattedTelephone = "";
      }

      const formattedBirthdate = residentForm.birthdate
        ? formatToDateOnly(residentForm.birthdate)
        : null;

      const formattedLastMenstrual = residentForm.lastmenstrual
        ? formatToDateOnly(residentForm.lastmenstrual)
        : null;

      delete residentForm.mobilenumber;
      delete residentForm.emergencymobilenumber;
      delete residentForm.id;
      delete residentForm.signature;

      const updatedResidentForm = {
        ...residentForm,
        address: fulladdress,
        mobilenumber: formattedMobileNumber,
        emergencymobilenumber: formattedEmergencyMobileNumber,
        telephone: formattedTelephone,
        birthdate: formattedBirthdate,
        lastmenstrual: formattedLastMenstrual,
      };

      const response = await axios.post(
        "https://ebarrio-mobile-backend.onrender.com/api/createresident",
        {
          picture: idPicture,
          signature: signaturePicture,
          ...updatedResidentForm,
          householdForm,
        }
      );
      alert("Resident successfully created!");
    } catch (error) {
      console.log("Error", error);
    }
  };

  console.log(residentForm);
  // console.log(householdForm);

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#04384E" }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 4, backgroundColor: "#04384E" }}>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#F0F4F7",
              marginTop: 30,
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

              <View style={{ marginVertical: 30, gap: 15, width: "100%" }}>
                {/* Personal Information */}

                {/* ID */}
                <Text
                  style={{
                    color: "red",
                    fontSize: 16,
                    fontFamily: "REMSemiBold",
                    alignSelf: "flex-start",
                  }}
                >
                  Personal Information
                </Text>
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
                    <TouchableOpacity
                      onPress={pickIDImage}
                      style={styles.button}
                    >
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

                <View>
                  <Text style={MyStyles.inputLabel}>
                    First Name<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    style={MyStyles.input}
                    placeholder="First Name"
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
                    placeholder="Middle Name"
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
                    placeholder="Last Name"
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
                    placeholder="Alias"
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

                {/* <View>
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
                </View> */}

                <View>
                  <Text style={MyStyles.inputLabel}>
                    Birthdate<Text style={{ color: "red" }}>*</Text>
                  </Text>

                  <View style={[MyStyles.input, MyStyles.datetimeRow]}>
                    <Text
                      style={{
                        color: residentForm.birthdate ? "black" : "#808080",
                        fontFamily: "QuicksandMedium",
                        fontSize: 16,
                      }}
                    >
                      {residentForm.birthdate
                        ? new Date(residentForm.birthdate).toLocaleDateString()
                        : "Select date"}
                    </Text>

                    <MaterialIcons
                      name="calendar-today"
                      size={24}
                      color="#C1C0C0"
                      onPress={() => setShowBirthdatePicker((prev) => !prev)}
                    />
                  </View>

                  {showBirthdatePicker && (
                    <DateTimePicker
                      value={residentForm.birthdate || new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, selectedDate) => {
                        if (Platform.OS === "android") {
                          setShowBirthdatePicker(false);
                        }
                        if (selectedDate) {
                          handleInputChange("birthdate", selectedDate);
                        }
                      }}
                    />
                  )}
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Age</Text>
                  <TextInput
                    placeholder="Age"
                    value={residentForm.age?.toString() || ""}
                    style={MyStyles.input}
                    editable={false}
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Birthplace</Text>
                  <TextInput
                    placeholder="Birthplace"
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
                    placeholder="Philhealth ID"
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

                {residentForm.sex === "Female" && (
                  <>
                    <View>
                      <Text style={MyStyles.inputLabel}>
                        Last Menstrual Period
                      </Text>

                      <View style={[MyStyles.input, MyStyles.datetimeRow]}>
                        <Text
                          style={{
                            color: residentForm.lastmenstrual
                              ? "black"
                              : "#808080",
                            fontFamily: "QuicksandMedium",
                            fontSize: 16,
                          }}
                        >
                          {residentForm.lastmenstrual
                            ? new Date(
                                residentForm.lastmenstrual
                              ).toLocaleDateString()
                            : "Select date"}
                        </Text>

                        <MaterialIcons
                          name="calendar-today"
                          size={24}
                          color="#C1C0C0"
                          onPress={() =>
                            setShowLastMenstrualPicker((prev) => !prev)
                          }
                        />
                      </View>

                      {showLastMenstrualPicker && (
                        <DateTimePicker
                          mode="date"
                          display={
                            Platform.OS === "ios" ? "spinner" : "default"
                          }
                          value={residentForm.lastmenstrual || new Date()}
                          onChange={(event, selectedDate) => {
                            if (Platform.OS === "android") {
                              setShowLastMenstrualPicker(false);
                            }
                            if (selectedDate) {
                              handleInputChange("lastmenstrual", selectedDate);
                            }
                          }}
                        />
                      )}
                    </View>

                    <View>
                      <Text style={MyStyles.inputLabel}>
                        Using any FP method?
                      </Text>
                      <View style={styles.radioGroup}>
                        {["Yes", "No"].map((option) => (
                          <Pressable
                            key={option}
                            style={styles.radioOption}
                            onPress={() =>
                              handleRadioChange("fpmethod", option)
                            }
                          >
                            <View style={styles.radioCircle}>
                              {residentForm.fpmethod === option && (
                                <View style={styles.radioDot} />
                              )}
                            </View>
                            <Text
                              style={{
                                fontFamily: "QuicksandMedium",
                                fontSize: 16,
                              }}
                            >
                              {option}
                            </Text>
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
                  </>
                )}
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
                        <Text
                          style={{
                            fontFamily: "QuicksandMedium",
                            fontSize: 16,
                          }}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Precinct</Text>
                  <TextInput
                    style={MyStyles.input}
                    placeholder="Precinct"
                    keyboardType="numeric"
                    value={residentForm.precinct}
                    onChangeText={(text) => handleInputChange("precinct", text)}
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Classification</Text>
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

                <View>
                  <Text style={MyStyles.inputLabel}>Medical History</Text>

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
                        <Text
                          style={{
                            fontFamily: "QuicksandMedium",
                            fontSize: 16,
                          }}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Contact Information */}

                <Text
                  style={{
                    color: "red",
                    fontSize: 16,
                    fontFamily: "REMSemiBold",
                    alignSelf: "flex-start",
                    marginTop: 30,
                  }}
                >
                  Contact Information
                </Text>
                <View>
                  <Text style={MyStyles.inputLabel}>Email</Text>
                  <TextInput
                    placeholder="Email"
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
                    placeholder="Facebook"
                    style={MyStyles.input}
                    value={residentForm.facebook}
                    onChangeText={(text) => handleInputChange("facebook", text)}
                  />
                </View>

                {/* In Case Of Emergency Situation */}

                <Text
                  style={{
                    color: "red",
                    fontSize: 16,
                    fontFamily: "REMSemiBold",
                    alignSelf: "flex-start",
                    marginTop: 30,
                  }}
                >
                  In Case Of Emergency Situation
                </Text>
                <View>
                  <Text style={MyStyles.inputLabel}>
                    Name of Guardian<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="Full Name"
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
                    placeholder="Address"
                    style={MyStyles.input}
                    value={residentForm.emergencyaddress}
                    onChangeText={(text) =>
                      handleInputChange("emergencyaddress", text)
                    }
                  />
                </View>

                {/* Family Information */}

                <Text
                  style={{
                    color: "red",
                    fontSize: 16,
                    fontFamily: "REMSemiBold",
                    alignSelf: "flex-start",
                    marginTop: 30,
                  }}
                >
                  Family Information
                </Text>

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
                    placeholderStyle={{
                      color: "#808080",
                      fontFamily: "QuicksandMedium",
                      fontSize: 16,
                    }}
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
                    placeholderStyle={{
                      color: "#808080",
                      fontFamily: "QuicksandMedium",
                      fontSize: 16,
                    }}
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
                    placeholderStyle={{
                      color: "#808080",
                      fontFamily: "QuicksandMedium",
                      fontSize: 16,
                    }}
                    value={residentForm.spouse}
                    onChange={(item) => handleInputChange("spouse", item.value)}
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>Number of Siblings</Text>
                  <TextInput
                    placeholder="Number of Siblings"
                    value={residentForm.numberofsiblings}
                    onChangeText={(text) =>
                      setResidentForm({
                        ...residentForm,
                        numberofsiblings: text.replace(/[^0-9]/g, ""),
                      })
                    }
                    keyboardType="numeric"
                    maxLength={1}
                    style={MyStyles.input}
                  />
                </View>
                {parseInt(residentForm.numberofsiblings, 10) > 0 &&
                  renderSiblingsDropdown()}

                <View>
                  <Text style={MyStyles.inputLabel}>Number of Children</Text>
                  <TextInput
                    placeholder="Number of Children"
                    value={residentForm.numberofchildren}
                    onChangeText={(text) =>
                      setResidentForm({
                        ...residentForm,
                        numberofchildren: text.replace(/[^0-9]/g, ""),
                      })
                    }
                    keyboardType="numeric"
                    maxLength={1}
                    style={MyStyles.input}
                  />
                </View>
                {parseInt(residentForm.numberofchildren, 10) > 0 &&
                  renderChildrenDropdown()}

                {/* Address Information */}
                <Text
                  style={{
                    color: "red",
                    fontSize: 16,
                    fontFamily: "REMSemiBold",
                    alignSelf: "flex-start",
                    marginTop: 30,
                  }}
                >
                  Address Information
                </Text>
                <View>
                  <Text style={MyStyles.inputLabel}>House Number</Text>
                  <TextInput
                    placeholder="House Number"
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
                <Text
                  style={{
                    color: "red",
                    fontSize: 16,
                    fontFamily: "REMSemiBold",
                    alignSelf: "flex-start",
                    marginTop: 30,
                  }}
                >
                  Household Information
                </Text>
                <View>
                  <Text style={MyStyles.inputLabel}>
                    Head of the Household?
                  </Text>
                  <View style={styles.radioGroup}>
                    {["Yes", "No"].map((option) => (
                      <Pressable
                        key={option}
                        style={styles.radioOption}
                        onPress={() => handleRadioChange("head", option)}
                      >
                        <View style={styles.radioCircle}>
                          {residentForm.head === option && (
                            <View style={styles.radioDot} />
                          )}
                        </View>
                        <Text
                          style={{
                            fontFamily: "QuicksandMedium",
                            fontSize: 16,
                          }}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {residentForm.head === "No" && (
                  <>
                    <View>
                      <Text style={MyStyles.inputLabel}>Household</Text>
                      <Dropdown
                        labelField="label"
                        valueField="value"
                        value={residentForm.householdno}
                        data={households.map((h) => {
                          const head = h.members.find(
                            (m) => m.position === "Head"
                          );
                          const headName = head?.resID
                            ? `${head.resID.lastname}'s Residence - ${head.resID.address}`
                            : "Unnamed";
                          return {
                            label: headName,
                            value: h._id,
                          };
                        })}
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
                          handleDropdownChange("householdno", item.value)
                        }
                        style={MyStyles.input}
                      />
                    </View>

                    <View>
                      <Text style={MyStyles.inputLabel}>Position</Text>
                      <Dropdown
                        labelField="label"
                        valueField="value"
                        value={residentForm.householdposition}
                        data={[
                          "Spouse",
                          "Child",
                          "Parent",
                          "Sibling",
                          "Grandparent",
                          "Grandchild",
                          "In-law",
                          "Relative",
                          "Housemate",
                          "Househelp",
                          "Other",
                        ].map((item) => ({ label: item, value: item }))}
                        placeholder="Select Position"
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
                          handleDropdownChange("householdposition", item.value)
                        }
                        style={MyStyles.input}
                      />
                    </View>
                  </>
                )}

                {residentForm.head === "Yes" && (
                  <>
                    <View>
                      <Text style={MyStyles.inputLabel}>
                        Ethnicity<Text style={{ color: "red" }}>*</Text>
                      </Text>
                      <View style={styles.radioGroup}>
                        {["IP Household", "Non-IP Household"].map((option) => (
                          <Pressable
                            key={option}
                            style={styles.radioOption}
                            onPress={() =>
                              handleHouseholdRadioChange("ethnicity", option)
                            }
                          >
                            <View style={styles.radioCircle}>
                              {householdForm.ethnicity === option && (
                                <View style={styles.radioDot} />
                              )}
                            </View>
                            <Text>{option}</Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>

                    {householdForm.ethnicity === "IP Household" && (
                      <>
                        <View>
                          <Text style={MyStyles.inputLabel}>Tribe</Text>
                          <TextInput
                            style={MyStyles.input}
                            value={householdForm.tribe}
                            onChangeText={(text) =>
                              handleHouseholdInputChange("tribe", text)
                            }
                          />
                        </View>
                      </>
                    )}

                    <View>
                      <Text style={MyStyles.inputLabel}>
                        Socioeconomic Status
                        <Text style={{ color: "red" }}>*</Text>
                      </Text>
                      <View style={styles.radioGroup}>
                        {["NHTS 4Ps", "NHTS Non-4Ps", "Non-NHTS"].map(
                          (option) => (
                            <Pressable
                              key={option}
                              style={styles.radioOption}
                              onPress={() =>
                                handleHouseholdRadioChange(
                                  "sociostatus",
                                  option
                                )
                              }
                            >
                              <View style={styles.radioCircle}>
                                {householdForm.sociostatus === option && (
                                  <View style={styles.radioDot} />
                                )}
                              </View>
                              <Text>{option}</Text>
                            </Pressable>
                          )
                        )}
                      </View>
                    </View>

                    {(householdForm.sociostatus === "NHTS 4Ps" ||
                      householdForm.sociostatus === "NHTS Non-4Ps") && (
                      <>
                        <View>
                          <Text style={MyStyles.inputLabel}>NHTS No.</Text>
                          <TextInput
                            style={MyStyles.input}
                            value={householdForm.nhtsno}
                            keyboardType="numeric"
                            onChangeText={(text) =>
                              handleHouseholdInputChange("nhtsno", text)
                            }
                          />
                        </View>
                      </>
                    )}

                    <View>
                      <Text style={MyStyles.inputLabel}>
                        Type of Water Source
                        <Text style={{ color: "red" }}>*</Text>
                      </Text>
                      <Dropdown
                        labelField="label"
                        valueField="value"
                        value={householdForm.watersource}
                        data={watersourceList.map((purp) => ({
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
                          handleHouseholdDropdownChange(
                            "watersource",
                            item.value
                          )
                        }
                        style={MyStyles.input}
                      ></Dropdown>
                    </View>

                    <View>
                      <Text style={MyStyles.inputLabel}>
                        Type of Toilet Facility
                        <Text style={{ color: "red" }}>*</Text>
                      </Text>
                      <Dropdown
                        labelField="label"
                        valueField="value"
                        value={householdForm.toiletfacility}
                        data={toiletfacilityList.map((purp) => ({
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
                          handleHouseholdDropdownChange(
                            "toiletfacility",
                            item.value
                          )
                        }
                        style={MyStyles.input}
                      ></Dropdown>
                    </View>

                    <View>
                      <Text style={MyStyles.inputLabel}>Members</Text>
                      {householdForm.members.map((member, index) => (
                        <View key={index} style={{ marginBottom: 20 }}>
                          <Text>Resident Name</Text>
                          <TextInput
                            value={member.resident}
                            onChangeText={(text) =>
                              handleMemberChange(index, "resident", text)
                            }
                            placeholder="Enter resident name"
                            style={{
                              borderWidth: 1,
                              padding: 8,
                              marginBottom: 5,
                              borderRadius: 5,
                            }}
                          />

                          {memberSuggestions[index]?.length > 0 && (
                            <View
                              style={{
                                backgroundColor: "#fff",
                                borderWidth: 1,
                                borderColor: "#ccc",
                                borderRadius: 5,
                                marginBottom: 10,
                              }}
                            >
                              {memberSuggestions[index].map((item) => {
                                const fullName = `${item.firstname} ${
                                  item.middlename ? item.middlename + " " : ""
                                }${item.lastname}`;

                                return (
                                  <TouchableOpacity
                                    key={item._id}
                                    onPress={() =>
                                      handleMemberSuggestionClick(index, item)
                                    }
                                    style={{
                                      padding: 10,
                                      borderBottomWidth: 1,
                                      borderColor: "#eee",
                                    }}
                                  >
                                    <Text>{fullName}</Text>
                                  </TouchableOpacity>
                                );
                              })}
                            </View>
                          )}

                          <Text style={styles.label}>Position</Text>
                          <Dropdown
                            data={positionList}
                            labelField="label"
                            valueField="value"
                            placeholder="Select"
                            value={member.position}
                            onChange={(item) =>
                              handleMemberChange(index, "position", item.value)
                            }
                            style={styles.dropdown}
                            containerStyle={styles.dropdownContainer}
                          />

                          <TouchableOpacity
                            onPress={() => removeMember(index)}
                            style={{ marginTop: 8 }}
                          >
                            <Text style={{ color: "red" }}>Remove Member</Text>
                          </TouchableOpacity>
                        </View>
                      ))}

                      <TouchableOpacity
                        onPress={addMember}
                        style={styles.addButton}
                      >
                        <Text style={styles.addText}>+ Add Member</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={MyStyles.inputLabel}>Vehicles</Text>
                    {householdForm.vehicles.map((vehicle, index) => (
                      <View key={index} style={styles.card}>
                        <Text style={styles.cardTitle}>
                          Vehicle {index + 1}
                        </Text>

                        <Text style={styles.label}>Model</Text>
                        <TextInput
                          style={styles.input}
                          value={vehicle.model}
                          placeholder="e.g. Toyota Vios"
                          onChangeText={(text) =>
                            handleVehicleChange(index, "model", text)
                          }
                        />

                        <Text style={styles.label}>Color</Text>
                        <TextInput
                          style={styles.input}
                          value={vehicle.color}
                          placeholder="e.g. Red"
                          onChangeText={(text) =>
                            handleVehicleChange(index, "color", text)
                          }
                        />

                        <Text style={styles.label}>Kind</Text>
                        <Dropdown
                          data={kindOptions}
                          labelField="label"
                          valueField="value"
                          placeholder="Select kind"
                          value={vehicle.kind}
                          onChange={(item) =>
                            handleVehicleChange(index, "kind", item.value)
                          }
                          style={styles.dropdown}
                          containerStyle={styles.dropdownContainer}
                        />

                        <Text style={styles.label}>Plate Number</Text>
                        <TextInput
                          style={styles.input}
                          value={vehicle.platenumber}
                          placeholder="e.g. ABC1234"
                          onChangeText={(text) =>
                            handleVehicleChange(index, "platenumber", text)
                          }
                        />

                        <TouchableOpacity
                          onPress={() => removeVehicle(index)}
                          style={styles.removeButton}
                        >
                          <Text style={styles.removeText}>Remove Vehicle</Text>
                        </TouchableOpacity>
                      </View>
                    ))}

                    <TouchableOpacity
                      onPress={addVehicle}
                      style={styles.addButton}
                    >
                      <Text style={styles.addText}>+ Add Vehicle</Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* Employment Information */}
                <Text
                  style={{
                    color: "red",
                    fontSize: 16,
                    fontFamily: "REMSemiBold",
                    alignSelf: "flex-start",
                    marginTop: 30,
                  }}
                >
                  Employment Information
                </Text>

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
                    placeholder="Occupation"
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
                <Text
                  style={{
                    color: "red",
                    fontSize: 16,
                    fontFamily: "REMSemiBold",
                    alignSelf: "flex-start",
                    marginTop: 30,
                  }}
                >
                  Educational Information
                </Text>

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
                    placeholder="Course"
                    style={MyStyles.input}
                    value={residentForm.course}
                    onChangeText={(text) => handleInputChange("course", text)}
                  />
                </View>
              </View>

              <TouchableOpacity style={MyStyles.button} onPress={handleSubmit}>
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
    color: "#808080",
    fontFamily: "QuicksandSemiBold",
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
  container: {
    padding: 10,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#ddd",
    padding: 5,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  dataRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 4,
    marginHorizontal: 2,
    fontSize: 12,
    borderRadius: 5,
  },
  dropdown: {
    flex: 1,
    marginHorizontal: 2,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    height: 40,
    justifyContent: "center",
  },
  dropdownContainer: {
    zIndex: 1000,
  },
  removeButton: {
    backgroundColor: "red",
    padding: 6,
    borderRadius: 4,
    marginLeft: 2,
  },
  addButton: {
    backgroundColor: "green",
    padding: 10,
    alignItems: "center",
    marginTop: 20,
    borderRadius: 6,
  },
});
