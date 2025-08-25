import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useState } from "react";
import api from "../api";
import AppLogo from "../assets/applogo-darkbg.png";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import AlertModal from "./AlertModal";

//ICONS
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";

const SetPassword = () => {
  const route = useRoute();
  const { username } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [repasswordErrors, setRePasswordErrors] = useState([]);
  const [securePass, setSecurePass] = useState(true);
  const [secureConfirmPass, setSecureConfirmPass] = useState(true);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglesecurePass = () => {
    setSecurePass(!securePass);
  };

  const togglesecureConfirmPass = () => {
    setSecureConfirmPass(!secureConfirmPass);
  };
  const handleSubmit = async () => {
    setIsConfirmModalVisible(false);
    try {
      await api.put(`/resetpassword/${username}`, { password });
      setIsSuccess(true);
      setAlertMessage("Your password has been set.");
      setIsAlertModalVisible(true);
    } catch (error) {
      console.log("Failed to reset password", error);
      setAlertMessage("Password reset failed.");
      setIsAlertModalVisible(true);
      setIsSuccess(false);
    }
    setAlertMessage(message);
    setIsAlertModalVisible(true);
  };

  const handleConfirm = () => {
    let hasErrors = false;
    let perrors = [];
    let rerrors = [];
    if (!password) {
      perrors.push("This field is required!");
      setPasswordErrors(perrors);
      hasErrors = true;
    }
    if (!repassword) {
      rerrors.push("This field is required!");
      setRePasswordErrors(rerrors);
      hasErrors = true;
    }

    if (repasswordErrors.includes("Passwords do not match!")) {
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    setIsConfirmModalVisible(true);
  };

  const passwordValidation = (val) => {
    let errors = [];
    let errors2 = [];
    let formattedVal = val.replace(/\s+/g, "");
    setPassword(formattedVal);

    if (!formattedVal) {
      errors.push("This field is required!");
    }
    if (
      (formattedVal && formattedVal.length < 8) ||
      (formattedVal && formattedVal.length > 64)
    ) {
      errors.push("Password must be between 8 and 64 characters only!");
    }
    if (formattedVal && !/^[a-zA-Z0-9!@\$%\^&*\+#]+$/.test(formattedVal)) {
      errors.push(
        "Password can only contain letters, numbers, and !, @, $, %, ^, &, *, +, #."
      );
    }
    if (repassword && formattedVal !== repassword) {
      errors2.push("Passwords do not match!");
    }
    setPasswordErrors(errors);
    setRePasswordErrors(errors2);
  };

  const repasswordValidation = (val) => {
    let errors = [];
    let formattedVal = val.replace(/\s+/g, "");
    setRePassword(formattedVal);

    if (!formattedVal) {
      errors.push("This field is required!");
    }
    if (formattedVal !== password && formattedVal.length > 0) {
      errors.push("Passwords do not match!");
    }
    setRePasswordErrors(errors);
  };

  const BackgroundOverlay = () => (
    <View style={{ position: "relative", height: "100%", width: "100%" }}>
      {/* SVG Background */}
      <Svg height="100%" width="100%">
        <Defs>
          <RadialGradient
            id="grad1"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <Stop offset="0%" stopColor="#0981B4" stopOpacity="1" />
            <Stop offset="25%" stopColor="#0978A7" stopOpacity="1" />
            <Stop offset="50%" stopColor="#086F9B" stopOpacity="1" />
            <Stop offset="75%" stopColor="#065474" stopOpacity="1" />
            <Stop offset="100%" stopColor="#064965" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad1)" />
      </Svg>

      {/* Logo */}
      <Image source={AppLogo} style={MyStyles.overlayLogo} />

      {/* Black Overlay */}
      <View style={MyStyles.overlayBlack} />
    </View>
  );

  const handleCloseAlertModal = () => {
    setIsAlertModalVisible(false);
    navigation.navigate("Login");
    setPassword("");
    setRePassword("");
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
      <BackgroundOverlay />
      <View style={MyStyles.forgotCardWrapper}>
        <View style={MyStyles.forgotCard}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <AntDesign
              name="arrowleft"
              style={[MyStyles.backArrow, { alignSelf: "flex-start" }]}
              onPress={() => navigation.navigate("Login")}
            />

            <Text style={[MyStyles.header, { alignSelf: "flex-start" }]}>
              {loading ? "Confirming..." : "Confirm"}
            </Text>

            {/* Form fields */}
            <View style={MyStyles.loginFormWrapper}>
              <View>
                <Text style={MyStyles.inputLabel}>Password</Text>
                <View style={{ position: "relative" }}>
                  <TextInput
                    value={password}
                    onChangeText={passwordValidation}
                    secureTextEntry={securePass}
                    placeholder="Password"
                    style={[MyStyles.input, { paddingRight: 40 }]}
                  />
                  <TouchableOpacity
                    style={MyStyles.eyeToggle}
                    onPress={togglesecurePass}
                  >
                    <Ionicons
                      name={securePass ? "eye-off" : "eye"}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
                {passwordErrors.length > 0 && (
                  <View>
                    {passwordErrors.map((error, index) => (
                      <Text key={index} style={MyStyles.errorMsg}>
                        {error}
                      </Text>
                    ))}
                  </View>
                )}
              </View>

              <View>
                <Text style={MyStyles.inputLabel}>Confirm Password</Text>
                <View style={{ position: "relative" }}>
                  <TextInput
                    value={repassword}
                    onChangeText={repasswordValidation}
                    secureTextEntry={secureConfirmPass}
                    placeholder="Confirm Password"
                    style={[MyStyles.input, { paddingRight: 40 }]}
                  />
                  <TouchableOpacity
                    style={MyStyles.eyeToggle}
                    onPress={togglesecureConfirmPass}
                  >
                    <Ionicons
                      name={secureConfirmPass ? "eye-off" : "eye"}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
                {repasswordErrors.length > 0 && (
                  <View>
                    {repasswordErrors.map((error, index) => (
                      <Text key={index} style={MyStyles.errorMsg}>
                        {error}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              disabled={loading}
              onPress={handleConfirm}
              style={[MyStyles.button]}
            >
              <Text style={MyStyles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <AlertModal
        isVisible={isAlertModalVisible}
        message={alertMessage}
        isSuccess={isSuccess}
        onClose={() => setIsAlertModalVisible(false)}
        onConfirm={handleCloseAlertModal}
      />
      <AlertModal
        isVisible={isConfirmModalVisible}
        isConfirmationModal={true}
        title="Set Password?"
        message="Are you sure you want to set your password?"
        onClose={() => setIsConfirmModalVisible(false)}
        onConfirm={handleSubmit}
      />
    </SafeAreaView>
  );
};

export default SetPassword;
