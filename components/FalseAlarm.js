import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import { useContext, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { storage } from "../firebase";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import api from "../api";
import { MyStyles } from "./stylesheet/MyStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AlertModal from "./AlertModal";
import * as ImagePicker from "expo-image-picker";

//ICONS
import { MaterialIcons } from "@expo/vector-icons";

const FalseAlarm = () => {
  const route = useRoute();
  const { selectedID } = route.params;
  const insets = useSafeAreaInsets();
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [falseAlarmForm, setFalseAlarmForm] = useState({
    postreportdetails: "",
    evidence: "",
  });
  const [loading, setLoading] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isEvidenceProcessing, setIsEvidenceProcessing] = useState(false);

  const handleInputChange = (name, value) => {
    setBlotterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // if (name === "subjectname") {
    //   setSubjectError(!value ? "This field is required!" : null);
    // }
    // if (name === "details") {
    //   setDetailsError(!value ? "This field is required!" : null);
    // }
  };

  const pickEvidenceImage = async () => {
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

      setIsEvidenceProcessing(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setFalseAlarmForm((prev) => ({
          ...prev,
          evidence: result.assets[0].uri,
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      setAlertMessage("Something went wrong while picking the image.");
      setIsAlertModalVisible(true);
    } finally {
      setIsEvidenceProcessing(false);
    }
  };

  const toggleEvidenceCamera = async () => {
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
        setFalseAlarmForm((prev) => ({
          ...prev,
          evidence: result.assets[0].uri,
        }));
      }
    } catch (error) {
      console.error("Camera error:", error);
      setAlertMessage("Failed to open camera.");
      setIsAlertModalVisible(true);
    }
  };

  async function uploadToFirebase(url) {
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `id_evidences/${Date.now()}_${randomString}.png`;
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], fileName, { type: blob.type });
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }

  const handleConfirm = () => {
    setIsConfirmModalVisible(true);
  };

  const handleSubmit = async () => {
    setIsConfirmModalVisible(false);
    if (loading) return;
    setLoading(true);
    try {
      let updatedFalseAlarmForm = { ...falseAlarmForm };
      if (falseAlarmForm.evidence !== "") {
        const evidencePicture = await uploadToFirebase(falseAlarmForm.evidence);
        delete falseAlarmForm.evidence;
        updatedFalseAlarmForm = {
          ...falseAlarmForm,
          evidence: evidencePicture,
        };
      }

      await api.put(`/falsealarm/${selectedID}`, {
        falseAlarmForm: updatedFalseAlarmForm,
      });
    } catch (error) {
      console.log("Error in submitting a false alarm report", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: "#DCE5EB",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            MyStyles.scrollContainer,
            {
              gap: 10,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialIcons
              onPress={() =>
                navigation.navigate("SOSReportDetails", { selectedID })
              }
              name="arrow-back-ios"
              color="#04384E"
              size={35}
              style={MyStyles.backArrow}
            />

            <Text style={[MyStyles.servicesHeader, { marginTop: 0 }]}>
              False Report
            </Text>
          </View>

          <Text style={MyStyles.formMessage}>
            Please select and fill out the required information to submit an
            update.
          </Text>
          <View>
            <Text style={MyStyles.inputLabel}>
              Reason for Marking as False Alarm
              <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              placeholder="Describe any actions you or your team took upon arrival."
              style={[
                MyStyles.input,
                { height: 150, textAlignVertical: "top" },
              ]}
              value={postIncidentForm.postreportdetails}
              type="text"
              multiline={true}
              numberOfLines={4}
              maxLength={3000}
              autoCapitalize="sentences"
              onChangeText={(text) =>
                handleInputChange("postreportdetails", text)
              }
            />

            <View style={MyStyles.errorDetailsWrapper}>
              <Text style={MyStyles.detailsLength}>
                {postIncidentForm.postreportdetails.length}/1000
              </Text>
            </View>
          </View>

          {/* Evidence */}
          <View>
            <Text style={MyStyles.inputLabel}>
              Evidence <Text style={{ color: "gray" }}>(if available)</Text>
            </Text>
            <View style={MyStyles.uploadBox}>
              <View style={MyStyles.previewContainer}>
                {isEvidenceProcessing ? (
                  <ActivityIndicator size="small" color="#0000ff" />
                ) : postIncidentForm.evidence ? (
                  <Image
                    source={{ uri: postIncidentForm.evidence }}
                    style={MyStyles.image}
                  />
                ) : (
                  <View style={MyStyles.placeholder}>
                    <Text style={MyStyles.placeholderText}>Attach Picture</Text>
                  </View>
                )}
              </View>

              <View style={MyStyles.personalInfobuttons}>
                <TouchableOpacity
                  onPress={toggleEvidenceCamera}
                  style={MyStyles.personalInfoButton}
                >
                  <Text>📷</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={pickEvidenceImage}
                  style={MyStyles.personalInfoButton}
                >
                  <Text>📤</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={MyStyles.button}
            onPress={handleConfirm}
            disabled={loading}
          >
            <Text style={MyStyles.buttonText}>
              {loading ? "Submitting..." : "Submit"}
            </Text>
          </TouchableOpacity>

          <AlertModal
            isVisible={isConfirmModalVisible}
            isConfirmationModal={true}
            title="False Alarm Report?"
            message="Are you sure you want to submit a false alarm report?"
            onClose={() => setIsConfirmModalVisible(false)}
            onConfirm={handleSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FalseAlarm;
