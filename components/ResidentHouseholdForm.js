import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Modal,
  BackHandler,
  Dimensions,
  Button,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import CheckBox from "./CheckBox";
import Signature from "react-native-signature-canvas";
import * as ScreenOrientation from "expo-screen-orientation";
import AlertModal from "./AlertModal";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";

import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as FileSystem from "expo-file-system";
//ICONS
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import api from "../api";
import { MaterialIcons } from "@expo/vector-icons";
import { DraftContext } from "../context/DraftContext";
import sign from "../assets/resident-sign.png";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const ResidentHouseholdForm = () => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const landscapeWidth = Math.max(screenWidth, screenHeight);
  const landscapeHeight = Math.min(screenWidth, screenHeight);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [isIDProcessing, setIsIDProcessing] = useState(false);
  const [isSignProcessing, setIsSignProcessing] = useState(false);
  const [residents, setResidents] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [showBirthdatePicker, setShowBirthdatePicker] = useState(false);
  const [showLastMenstrualPicker, setShowLastMenstrualPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const { householdForm, setHouseholdForm } = useContext(DraftContext);
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
    employmentstatus: "",
    employmentfield: "",
    occupation: "",
    monthlyincome: "",
    educationalattainment: "",
    householdno: "",
    householdposition: "",
    head: "",
    course: "",
    isSenior: false,
    isInfant: false,
    isNewborn: false,
    isUnder5: false,
    isSchoolAge: false,
    isAdolescent: false,
    isAdolescentPregnant: false,
    isAdult: false,
    isPostpartum: false,
    isWomenOfReproductive: false,
    isPregnant: false,
    isPWD: false,
    philhealthid: "",
    philhealthtype: "",
    philhealthcategory: "",
    haveHypertension: false,
    haveDiabetes: false,
    haveTubercolosis: false,
    haveSurgery: false,
    lastmenstrual: "",
    haveFPmethod: "",
    fpmethod: "",
    fpstatus: "",
  });

  const householdInitialForm = {
    members: [],
    vehicles: [],
    ethnicity: "",
    tribe: "",
    sociostatus: "",
    nhtsno: "",
    watersource: "",
    toiletfacility: "",
    housenumber: "",
    street: "",
    HOAname: "",
    address: "",
  };

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
    { label: "Son", value: "Son" },
    { label: "Daughter", value: "Daughter" },
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
        setAlertMessage(
          "We need access to your photos to let you upload an image."
        );
        setIsAlertModalVisible(true);
        return;
      }
      setIsIDProcessing(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setResidentForm((prev) => ({ ...prev, id: uri }));
        setErrors((prev) => ({ ...prev, id: null }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      setAlertMessage("Something went wrong while picking the image.");
      setIsAlertModalVisible(true);
    } finally {
      setIsIDProcessing(false);
    }
  };

  const toggleIDCamera = async () => {
    const permissionResult = await ImagePicker.getCameraPermissionsAsync();

    if (!permissionResult.granted) {
      const askPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!askPermission.granted) {
        setAlertMessage("Camera permission is required.");
        setIsAlertModalVisible(true);
        return;
      }
    }
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setResidentForm((prev) => ({ ...prev, id: uri }));

        setErrors((prev) => ({ ...prev, id: null }));
      }
    } catch (error) {
      console.error("Camera error:", error);
      setAlertMessage("Failed to open camera.");
      setIsAlertModalVisible(true);
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

      const matches = residents.filter((res) => {
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

  const handleOpenSignature = async () => {
    setShowSignModal(true);
  };

  const handleCloseSignature = async () => {
    setShowSignModal(false);
  };

  useEffect(() => {
    const backAction = () => {
      if (showSignModal) {
        handleCloseSignature();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [showSignModal]);

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

      const isSenior = age >= 60;

      const ageInDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));

      const isNewborn = age === 0 && ageInDays <= 28;
      const isInfant = (age === 0 && ageInDays > 28) || age === 1;
      const isUnder5 = age >= 2 && age <= 4;
      const isAdolescent = age >= 10 && age <= 19;
      const isAdult = age > 25;
      const isWomenOfReproductive = age >= 15 && age <= 49;

      setResidentForm((prev) => ({
        ...prev,
        age,
        isSenior,
        isNewborn,
        isInfant,
        isUnder5,
        isAdolescent,
        isAdult,
        isWomenOfReproductive,
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

  async function base64ToFile(base64String, extension = "jpg") {
    try {
      // Strip "data:image/...;base64," if included
      const cleanedBase64 = base64String.includes(",")
        ? base64String.split(",")[1]
        : base64String;

      // File path in cache
      const fileUri = `${FileSystem.cacheDirectory}${Date.now()}.${extension}`;

      // Write the base64 string as a binary file
      await FileSystem.writeAsStringAsync(fileUri, cleanedBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log("✅ File saved at:", fileUri);
      return fileUri;
    } catch (err) {
      console.error("❌ Error writing file:", err);
      throw err;
    }
  }

  async function uploadToFirebase(fileUriOrBase64) {
    try {
      let fileUri = fileUriOrBase64;

      if (fileUri.startsWith("data:")) {
        fileUri = await base64ToFile(fileUriOrBase64);
      }

      const randomString = Math.random().toString(36).substring(2, 15);
      const fileName = `id_images/${Date.now()}_${randomString}.jpg`;
      const storageRef = ref(storage, fileName);

      // ✅ Convert local file:// URI → Blob
      const response = await fetch(fileUri);
      const blob = await response.blob();
      console.log("📦 Blob created, size:", blob.size);

      // ✅ Upload blob
      const snapshot = await uploadBytesResumable(storageRef, blob, {
        contentType: "image/jpeg",
      });

      console.log("✅ Upload complete!");
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("🌐 Download URL:", downloadURL);

      return downloadURL;
    } catch (err) {
      console.log("❌ Upload error:", err);
      throw err;
    }
  }

  const [errors, setErrors] = useState({});

  const mobileInputChange = (field, input) => {
    input = input.replace(/(?!^)\+/g, "");
    input = input.replace(/[^\d+]/g, "");

    if (!input.startsWith("+63")) {
      input = "+63" + input.replace(/^\+?0*/, "");
    }

    if (input.length > 13) {
      input = input.slice(0, 13);
    }

    if (input.length >= 4 && input[3] === "0") {
      input = input.slice(0, 3) + input.slice(4);
    }

    setResidentForm((prev) => ({
      ...prev,
      [field]: input,
    }));

    if (input.length !== 13) {
      setErrors((prev) => ({
        ...prev,
        [field]: "Invalid mobile number format!",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleConfirm = () => {
    let newErrors = {};

    if (!residentForm.firstname)
      newErrors.firstname = "This field is required!";
    if (!residentForm.lastname) newErrors.lastname = "This field is required!";
    if (!residentForm.sex) newErrors.sex = "This field is required!";
    if (!residentForm.birthdate)
      newErrors.birthdate = "This field is required!";
    if (!residentForm.civilstatus)
      newErrors.civilstatus = "This field is required!";
    if (!residentForm.nationality)
      newErrors.nationality = "This field is required!";
    if (!residentForm.mobilenumber) {
      newErrors.mobilenumber = "This field is required!";
    }
    if (!residentForm.emergencyname)
      newErrors.emergencyname = "This field is required!";
    if (!residentForm.emergencymobilenumber)
      newErrors.emergencymobilenumber = "This field is required!";
    if (!residentForm.emergencyaddress)
      newErrors.emergencyaddress = "This field is required!";
    if (residentForm.head === "Yes" && !householdForm.street) {
      newErrors.street = "This field is required!";
    }
    if (residentForm.head === "Yes" && !householdForm.ethnicity) {
      newErrors.ethnicity = "This field is required!";
    }
    if (residentForm.head === "Yes" && !householdForm.sociostatus) {
      newErrors.sociostatus = "This field is required!";
    }
    if (residentForm.head === "Yes" && !householdForm.watersource) {
      newErrors.watersource = "This field is required!";
    }
    if (residentForm.head === "Yes" && !householdForm.toiletfacility) {
      newErrors.toiletfacility = "This field is required!";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsConfirmModalVisible(true);
  };

  const handleSubmit = async () => {
    setIsConfirmModalVisible(false);
    if (loading) return;

    setLoading(true);
    try {
      let idPicture;
      let signaturePicture;
      if (residentForm.id) {
        idPicture = await uploadToFirebase(residentForm.id);
      }

      if (residentForm.signature) {
        signaturePicture = await uploadToFirebase(residentForm.signature);
      }

      let formattedMobileNumber = residentForm.mobilenumber;
      formattedMobileNumber = "0" + residentForm.mobilenumber.slice(3);

      let formattedEmergencyMobileNumber = residentForm.emergencymobilenumber;
      formattedEmergencyMobileNumber =
        "0" + residentForm.emergencymobilenumber.slice(3);

      let formattedTelephone = "";

      if (residentForm.telephone && residentForm.telephone !== "+63") {
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

      const { id, signature, ...rest } = residentForm;

      const updatedResidentForm = {
        ...rest,
        mobilenumber: formattedMobileNumber,
        emergencymobilenumber: formattedEmergencyMobileNumber,
        telephone: formattedTelephone,
        birthdate: formattedBirthdate,
        lastmenstrual: formattedLastMenstrual,
      };

      await api.post("/household/createresident", {
        picture: idPicture,
        signature: signaturePicture,
        ...updatedResidentForm,
      });
      navigation.navigate("ResidentForm", {
        fetchAgain: true,
      });
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const [showSignModal, setShowSignModal] = useState(false);
  const handleSignatureOK = async (signature) => {
    setIsSignProcessing(true);
    setResidentForm((prev) => ({
      ...prev,
      signature,
    }));

    setErrors((prev) => ({ ...prev, signature: null }));

    setShowSignModal(false);

    setTimeout(async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
      setIsSignProcessing(false);
    }, 300);
  };

  const handleClear = () => {
    setResidentForm(residentInitialForm);
    setHouseholdForm(householdInitialForm);
  };
  const handleSignatureClear = () => {
    setResidentForm((prev) => ({ ...prev, signature: "" }));
  };

  return (
    <LinearGradient
      colors={["#0e94d3", "#0a70a0", "#095e86", "#074c6d"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: "transparent",
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={MyStyles.loginWrapper}>
            <View style={MyStyles.loginBottomWrapper}>
              <ScrollView
                style={{ width: "100%", marginBottom: 40 }}
                contentContainerStyle={{
                  alignItems: "center",
                }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <Text style={[MyStyles.header, { alignSelf: "flex-start" }]}>
                  Residency Application
                </Text>

                <View style={MyStyles.loginFormWrapper}>
                  {/* Personal Information */}

                  {/* ID */}
                  <Text style={MyStyles.FormSectionTitle}>
                    Personal Information
                  </Text>

                  <Text style={MyStyles.inputLabel}>2x2 Picture</Text>
                  <View style={MyStyles.uploadBox}>
                    <View style={MyStyles.previewContainer}>
                      {isIDProcessing ? (
                        <ActivityIndicator size="small" color="#0000ff" />
                      ) : residentForm.id ? (
                        <Image
                          source={{ uri: residentForm.id }}
                          style={MyStyles.image}
                        />
                      ) : (
                        <View style={MyStyles.placeholder}>
                          <Text style={MyStyles.placeholderText}>
                            Attach ID Picture
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={MyStyles.personalInfobuttons}>
                      <TouchableOpacity
                        onPress={toggleIDCamera}
                        style={MyStyles.personalInfoButton}
                      >
                        <Entypo name="camera" size={20} color="white" />
                        <Text
                          style={{
                            fontFamily: "REMSemiBold",
                            color: "white",
                            fontSize: RFPercentage(1.8),
                          }}
                        >
                          Capture
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={pickIDImage}
                        style={MyStyles.personalInfoButton}
                      >
                        <Feather name="upload" size={20} color="white" />
                        <Text
                          style={{
                            fontFamily: "REMSemiBold",
                            color: "white",
                            fontSize: RFPercentage(1.8),
                          }}
                        >
                          Upload
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {errors.id && (
                    <Text style={MyStyles.errorMsg}>{errors.id}</Text>
                  )}

                  {/* New Signature */}
                  <Text style={MyStyles.inputLabel}>Signature</Text>
                  <View style={MyStyles.uploadBox}>
                    <View style={MyStyles.previewContainer}>
                      {isSignProcessing ? (
                        <ActivityIndicator size="small" color="#0000ff" />
                      ) : residentForm.signature ? (
                        <Image
                          source={{ uri: residentForm.signature }}
                          style={MyStyles.image}
                        />
                      ) : (
                        <View style={MyStyles.placeholder}>
                          <Text style={MyStyles.placeholderText}>
                            Attach Signature
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={MyStyles.personalInfobuttons}>
                      <TouchableOpacity
                        onPress={handleOpenSignature}
                        style={MyStyles.personalInfoButton}
                      >
                        <Image
                          source={sign}
                          style={{ width: 20, height: 20 }}
                        />
                        <Text
                          style={{
                            fontFamily: "REMSemiBold",
                            color: "white",
                            fontSize: RFPercentage(1.8),
                          }}
                        >
                          Sign
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={handleSignatureClear}
                        style={MyStyles.personalInfoButton}
                      >
                        <FontAwesome5 name="trash" size={20} color="white" />
                        <Text
                          style={{
                            fontFamily: "REMSemiBold",
                            color: "white",
                            fontSize: RFPercentage(1.8),
                          }}
                        >
                          Clear
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Signature Modal */}
                    <Modal
                      visible={showSignModal}
                      animationType="slide"
                      presentationStyle="fullScreen"
                      onRequestClose={() => setShowSignModal(false)}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#fff",
                        }}
                      >
                        {/* Rotated container */}
                        <View
                          style={{
                            width: landscapeWidth,
                            height: landscapeHeight,
                            transform: [{ rotate: "90deg" }],
                            backgroundColor: "#fff",
                          }}
                        >
                          <Signature
                            onOK={handleSignatureOK}
                            onClear={() => console.log("Cleared")}
                            descriptionText="Sign Above"
                            clearText="Clear"
                            confirmText="Save"
                            webStyle={`
                .m-signature-pad {
                  margin: 0;
                  height: 100%;
                }
                .m-signature-pad--footer {
                  display: flex;
                  justify-content: space-between !important;
                }
              `}
                          />
                        </View>

                        <View
                          style={{
                            position: "absolute",
                            bottom: 10,
                            left: 10,
                            flexDirection: "row",
                            gap: 8,
                          }}
                        >
                          <Button
                            title="Cancel"
                            onPress={() => setShowSignModal(false)}
                          />
                        </View>
                      </View>
                    </Modal>
                  </View>

                  {errors.signature && (
                    <Text style={MyStyles.errorMsg}>{errors.signature}</Text>
                  )}

                  <View>
                    <Text style={MyStyles.inputLabel}>
                      First Name<Text style={{ color: "red" }}>*</Text>
                    </Text>
                    <TextInput
                      style={MyStyles.input}
                      placeholder="First Name"
                      value={residentForm.firstname}
                      onChangeText={(text) => {
                        handleInputChange("firstname", text);
                        setErrors((prev) => ({ ...prev, firstname: null }));
                      }}
                    />
                    {errors.firstname && (
                      <Text style={MyStyles.errorMsg}>{errors.firstname}</Text>
                    )}
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
                      onChangeText={(text) => {
                        handleInputChange("lastname", text);
                        setErrors((prev) => ({ ...prev, lastname: null }));
                      }}
                    />
                    {errors.lastname && (
                      <Text style={MyStyles.errorMsg}>{errors.lastname}</Text>
                    )}
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
                      placeholderStyle={MyStyles.placeholderText}
                      selectedTextStyle={MyStyles.selectedText}
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
                      placeholderStyle={MyStyles.placeholderText}
                      selectedTextStyle={MyStyles.selectedText}
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
                      placeholderStyle={MyStyles.placeholderText}
                      selectedTextStyle={MyStyles.selectedText}
                      onChange={(item) => {
                        handleDropdownChange("sex", item.value);
                        setErrors((prev) => ({ ...prev, sex: null }));
                      }}
                      style={MyStyles.input}
                    ></Dropdown>
                    {errors.sex && (
                      <Text style={MyStyles.errorMsg}>{errors.sex}</Text>
                    )}
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
                      placeholderStyle={MyStyles.placeholderText}
                      selectedTextStyle={MyStyles.selectedText}
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
                          fontSize: RFPercentage(2),
                        }}
                      >
                        {residentForm.birthdate
                          ? new Date(
                              residentForm.birthdate
                            ).toLocaleDateString()
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
                        value={
                          residentForm.birthdate
                            ? new Date(residentForm.birthdate)
                            : new Date()
                        }
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selectedDate) => {
                          if (Platform.OS === "android") {
                            setShowBirthdatePicker(false);
                          }
                          if (selectedDate) {
                            handleInputChange(
                              "birthdate",
                              selectedDate.toISOString()
                            );
                            setErrors((prev) => ({ ...prev, birthdate: null }));
                          }
                        }}
                      />
                    )}
                    {errors.birthdate && (
                      <Text style={MyStyles.errorMsg}>{errors.birthdate}</Text>
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
                      placeholderStyle={MyStyles.placeholderText}
                      selectedTextStyle={MyStyles.selectedText}
                      onChange={(item) => {
                        handleDropdownChange("civilstatus", item.value);
                        setErrors((prev) => ({ ...prev, sex: null }));
                      }}
                      style={MyStyles.input}
                    ></Dropdown>
                    {errors.civilstatus && (
                      <Text style={MyStyles.errorMsg}>
                        {errors.civilstatus}
                      </Text>
                    )}
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
                      placeholderStyle={MyStyles.placeholderText}
                      selectedTextStyle={MyStyles.selectedText}
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
                              fontSize: RFPercentage(2),
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
                                handleInputChange(
                                  "lastmenstrual",
                                  selectedDate
                                );
                              }
                            }}
                          />
                        )}
                      </View>

                      <View>
                        <Text style={MyStyles.inputLabel}>
                          Using any FP method?
                        </Text>
                        <View style={MyStyles.radioGroup}>
                          {["Yes", "No"].map((option) => (
                            <Pressable
                              key={option}
                              style={MyStyles.radioOption}
                              onPress={() =>
                                handleRadioChange("fpmethod", option)
                              }
                            >
                              <View style={MyStyles.radioCircle}>
                                {residentForm.fpmethod === option && (
                                  <View style={MyStyles.radioDot} />
                                )}
                              </View>
                              <Text
                                style={{
                                  fontFamily: "QuicksandMedium",
                                  fontSize: RFPercentage(2),
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
                          placeholderStyle={MyStyles.placeholderText}
                          selectedTextStyle={MyStyles.selectedText}
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
                          placeholderStyle={MyStyles.placeholderText}
                          selectedTextStyle={MyStyles.selectedText}
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
                      placeholderStyle={MyStyles.placeholderText}
                      selectedTextStyle={MyStyles.selectedText}
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
                      placeholderStyle={MyStyles.placeholderText}
                      selectedTextStyle={MyStyles.selectedText}
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
                      placeholderStyle={MyStyles.placeholderText}
                      selectedTextStyle={MyStyles.selectedText}
                      onChange={(item) => {
                        handleDropdownChange("nationality", item.value);
                        setErrors((prev) => ({ ...prev, sex: null }));
                      }}
                      style={MyStyles.input}
                    ></Dropdown>
                    {errors.nationality && (
                      <Text style={MyStyles.errorMsg}>
                        {errors.nationality}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text style={MyStyles.inputLabel}>Registered Voter?</Text>
                    <View style={MyStyles.radioGroup}>
                      {["Yes", "No"].map((option) => (
                        <Pressable
                          key={option}
                          style={MyStyles.radioOption}
                          onPress={() => handleRadioChange("voter", option)}
                        >
                          <View style={MyStyles.radioCircle}>
                            {residentForm.voter === option && (
                              <View style={MyStyles.radioDot} />
                            )}
                          </View>
                          <Text
                            style={{
                              fontFamily: "QuicksandMedium",
                              fontSize: RFPercentage(2),
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
                      value={residentForm.precinct}
                      onChangeText={(text) =>
                        handleInputChange("precinct", text)
                      }
                    />
                  </View>

                  <View>
                    <Text style={MyStyles.inputLabel}>Classification</Text>
                    <CheckBox
                      label="Newborn"
                      value={residentForm.isNewborn}
                      onValueChange={() => handleCheckboxChange("isNewborn")}
                      disabled
                    />

                    <CheckBox
                      label="Infant"
                      value={residentForm.isInfant}
                      onValueChange={() => handleCheckboxChange("isInfant")}
                      disabled
                    />

                    <CheckBox
                      label="Under 5 y.o"
                      value={residentForm.isUnder5}
                      onValueChange={() => handleCheckboxChange("isUnder5")}
                      disabled
                    />

                    <CheckBox
                      label="Adolescent"
                      value={residentForm.isAdolescent}
                      onValueChange={() => handleCheckboxChange("isAdolescent")}
                      disabled
                    />

                    <CheckBox
                      label="Adult"
                      value={residentForm.isAdult}
                      onValueChange={() => handleCheckboxChange("isAdult")}
                      disabled
                    />

                    <CheckBox
                      label="Senior Citizen"
                      value={residentForm.isSenior}
                      onValueChange={() => handleCheckboxChange("isSenior")}
                      disabled
                    />

                    {residentForm.sex === "Female" && (
                      <CheckBox
                        label="Women of Reproductive Age"
                        value={residentForm.isWomenOfReproductive}
                        onValueChange={() =>
                          handleCheckboxChange("isWomenOfReproductive")
                        }
                      />
                    )}

                    {Boolean(
                      residentForm.age &&
                        residentForm.age >= 0 &&
                        residentForm.age <= 5
                    ) && (
                      <CheckBox
                        label="School of Age"
                        value={residentForm.isSchoolAge}
                        onValueChange={() =>
                          handleCheckboxChange("isSchoolAge")
                        }
                      />
                    )}

                    {Boolean(
                      residentForm.age &&
                        residentForm.sex === "Female" &&
                        residentForm.age > 19
                    ) && (
                      <CheckBox
                        label="Pregnant"
                        value={residentForm.isPregnant}
                        onValueChange={() => handleCheckboxChange("isPregnant")}
                      />
                    )}

                    {Boolean(
                      residentForm.age &&
                        residentForm.sex === "Female" &&
                        residentForm.age >= 10 &&
                        residentForm.age <= 19
                    ) && (
                      <CheckBox
                        label="Adolescent Pregnant"
                        value={residentForm.isAdolescentPregnant}
                        onValueChange={() =>
                          handleCheckboxChange("isAdolescentPregnant")
                        }
                      />
                    )}

                    {residentForm.sex === "Female" && (
                      <CheckBox
                        label="Postpartum"
                        value={residentForm.isPostpartum}
                        onValueChange={() =>
                          handleCheckboxChange("isPostpartum")
                        }
                      />
                    )}

                    <CheckBox
                      label="Person with Disability (PWD)"
                      value={residentForm.isPWD}
                      onValueChange={() => handleCheckboxChange("isPWD")}
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
                    <View style={MyStyles.radioGroup}>
                      {["Yes", "No"].map((option) => (
                        <Pressable
                          key={option}
                          style={MyStyles.radioOption}
                          onPress={() => handleRadioChange("deceased", option)}
                        >
                          <View style={MyStyles.radioCircle}>
                            {residentForm.deceased === option && (
                              <View style={MyStyles.radioDot} />
                            )}
                          </View>
                          <Text
                            style={{
                              fontFamily: "QuicksandMedium",
                              fontSize: RFPercentage(2),
                            }}
                          >
                            {option}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  {/* Contact Information */}

                  <Text style={[MyStyles.FormSectionTitle, { marginTop: 30 }]}>
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
                        mobileInputChange("mobilenumber", text)
                      }
                    />
                    {errors.mobilenumber && (
                      <Text style={MyStyles.errorMsg}>
                        {errors.mobilenumber}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text style={MyStyles.inputLabel}>Telephone</Text>
                    <TextInput
                      placeholder="Telephone"
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
                      onChangeText={(text) =>
                        handleInputChange("facebook", text)
                      }
                    />
                  </View>

                  {/* In Case Of Emergency Situation */}

                  <Text style={[MyStyles.FormSectionTitle, { marginTop: 30 }]}>
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
                      onChangeText={(text) => {
                        handleInputChange("emergencyname", text);
                        setErrors((prev) => ({ ...prev, emergencyname: null }));
                      }}
                    />

                    {errors.emergencyname && (
                      <Text style={MyStyles.errorMsg}>
                        {errors.emergencyname}
                      </Text>
                    )}
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
                        mobileInputChange("emergencymobilenumber", text)
                      }
                    />
                    {errors.emergencymobilenumber && (
                      <Text style={MyStyles.errorMsg}>
                        {errors.emergencymobilenumber}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text style={MyStyles.inputLabel}>
                      Address<Text style={{ color: "red" }}>*</Text>
                    </Text>
                    <TextInput
                      placeholder="Address"
                      style={MyStyles.input}
                      value={residentForm.emergencyaddress}
                      onChangeText={(text) => {
                        handleInputChange("emergencyaddress", text);
                        setErrors((prev) => ({
                          ...prev,
                          emergencyaddress: null,
                        }));
                      }}
                    />
                    {errors.emergencyaddress && (
                      <Text style={MyStyles.errorMsg}>
                        {errors.emergencyaddress}
                      </Text>
                    )}
                  </View>

                  {/* Employment Information */}
                  <Text style={[MyStyles.FormSectionTitle, { marginTop: 30 }]}>
                    Employment Information
                  </Text>

                  <View>
                    <Text style={MyStyles.inputLabel}>Employment Status</Text>
                    <Dropdown
                      labelField="label"
                      valueField="value"
                      value={residentForm.employmentstatus}
                      data={employmentstatusList.map((purp) => ({
                        label: purp,
                        value: purp,
                      }))}
                      placeholder="Select"
                      placeholderStyle={MyStyles.placeholderText}
                      selectedTextStyle={MyStyles.selectedText}
                      onChange={(item) => {
                        handleDropdownChange("employmentstatus", item.value);
                        setErrors((prev) => ({
                          ...prev,
                          employmentstatus: null,
                        }));
                      }}
                      style={MyStyles.input}
                    ></Dropdown>

                    {errors.employmentstatus && (
                      <Text style={MyStyles.errorMsg}>
                        {errors.employmentstatus}
                      </Text>
                    )}
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
                      placeholderStyle={MyStyles.placeholderText}
                      selectedTextStyle={MyStyles.selectedText}
                      onChange={(item) =>
                        handleDropdownChange("monthlyincome", item.value)
                      }
                      style={MyStyles.input}
                    ></Dropdown>
                  </View>

                  {/* Educational Information */}
                  <Text style={[MyStyles.FormSectionTitle, { marginTop: 30 }]}>
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
                      placeholderStyle={MyStyles.placeholderText}
                      selectedTextStyle={MyStyles.selectedText}
                      onChange={(item) =>
                        handleDropdownChange(
                          "educationalattainment",
                          item.value
                        )
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

                <View style={{ width: "100%", gap: 15 }}>
                  <TouchableOpacity
                    style={[MyStyles.button, { backgroundColor: "#808080" }]}
                    onPress={handleClear}
                  >
                    <Text style={MyStyles.buttonText}>Clear</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={MyStyles.button}
                    onPress={handleConfirm}
                    disabled={loading}
                  >
                    <Text style={MyStyles.buttonText}>
                      {loading ? "Submitting..." : "Submit"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <AlertModal
                  isVisible={isAlertModalVisible}
                  message={alertMessage}
                  onClose={() => setIsAlertModalVisible(false)}
                />

                <AlertModal
                  isVisible={isConfirmModalVisible}
                  isConfirmationModal={true}
                  title="Register Resident Profile?"
                  message="Are you sure you want to register to be a member of barangay?"
                  onClose={() => setIsConfirmModalVisible(false)}
                  onConfirm={handleSubmit}
                />
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};
export default ResidentHouseholdForm;

const styles = StyleSheet.create({
  required: { color: "red" },
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
  container: {
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 4,
    marginHorizontal: 2,
    fontSize: RFPercentage(2),
    borderRadius: 5,
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
  //SIGNATURE
  previewContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttons: { flexDirection: "row", justifyContent: "center" },
  button: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
  },
  closeButton: {
    width: 20,
    backgroundColor: "#000",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
