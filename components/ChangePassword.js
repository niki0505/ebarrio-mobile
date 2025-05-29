import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Touchable,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import api from "../api";

//ICONS
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";

const ChangePassword = () => {
  const { logout } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [renewpassword, setRenewPassword] = useState("");
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [passError, setPassError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [repasswordErrors, setRePasswordErrors] = useState([]);
  const [secureCurrPass, setSecureCurrPass] = useState(true);
  const [secureNewPass, setSecureNewPass] = useState(true);
  const [secureConfirmPass, setSecureConfirmPass] = useState(true);

  const togglesecureCurrPass = () => {
    setSecureCurrPass(!secureCurrPass);
  };

  const togglesecureNewPass = () => {
    setSecureNewPass(!secureNewPass);
  };

  const togglesecureConfirmPass = () => {
    setSecureConfirmPass(!secureConfirmPass);
  };

  const passwordValidation = (val) => {
    let errors = [];
    let formattedVal = val.replace(/\s+/g, "");
    setNewPassword(formattedVal);

    if (!formattedVal) {
      errors.push("Password must not be empty.");
    }
    if (
      (formattedVal && formattedVal.length < 8) ||
      (formattedVal && formattedVal.length > 64)
    ) {
      errors.push("Password must be between 8 and 64 characters only.");
    }
    if (formattedVal && !/^[a-zA-Z0-9!@\$%\^&*\+#]+$/.test(formattedVal)) {
      errors.push(
        "Password can only contain letters, numbers, and !, @, $, %, ^, &, *, +, #."
      );
    }
    setPasswordErrors(errors);
  };

  const repasswordValidation = (val) => {
    let errors = [];
    let formattedVal = val.replace(/\s+/g, "");
    setRenewPassword(formattedVal);

    if (!formattedVal) {
      errors.push("Password must not be empty.");
    }
    if (formattedVal !== newpassword && formattedVal.length > 0) {
      errors.push("Passwords do not match.");
    }
    setRePasswordErrors(errors);
  };

  const handlePassChange = (input) => {
    if (input.length === 0) {
      setPassError("This field is empty.");
    } else {
      setPassError("");
    }
    setPassword(input);
  };

  const handleConfirm = async () => {
    let hasErrors = false;
    if (!newpassword) {
      passwordValidation(newpassword);
      hasErrors = true;
    }

    if (!renewpassword) {
      repasswordValidation(renewpassword);
      hasErrors = true;
    }

    if (!password) {
      setPassError("This field is required.");
      hasErrors = true;
    } else {
      setPassError("");
    }

    if (passwordErrors.length !== 0) {
      hasErrors = true;
    }

    if (repasswordErrors.length !== 0) {
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    Alert.alert(
      "Confirm",
      "Are you sure you want to change your password?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            handlePasswordChange();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handlePasswordChange = async () => {
    try {
      await api.put("/changepassword", {
        newpassword,
        password,
      });
      alert("Your password has been updated. Please log in again.");
      logout();
    } catch (error) {
      const response = error.response;
      if (response && response.data) {
        console.log("❌ Error status:", response.status);
        alert(response.data.message || "Something went wrong.");
      } else {
        console.log("❌ Network or unknown error:", error.message);
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }}
    >
      <ScrollView
        contentContainerStyle={[
          MyStyles.scrollContainer,
          {
            paddingBottom: insets.bottom + 70,
          },
        ]}
      >
        <MaterialIcons
          onPress={() => navigation.navigate("AccountSettings")}
          name="arrow-back-ios"
          size={24}
          color="#04384E"
        />
        <Text style={[MyStyles.header, { marginTop: 20 }]}>
          Change Password
        </Text>

        <View style={{ gap: 15, marginVertical: 30 }}>
          <View>
            <Text style={MyStyles.inputLabel}>Current Password</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                onChangeText={handlePassChange}
                value={password}
                secureTextEntry={secureCurrPass}
                placeholder="Enter password"
                style={[MyStyles.input, { paddingRight: 40 }]}
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: [{ translateY: -12 }],
                }}
                onPress={togglesecureCurrPass}
              >
                <Ionicons
                  name={secureCurrPass ? "eye-off" : "eye"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
              {passError ? (
                <Text
                  style={{
                    color: "red",
                    fontFamily: "QuicksandMedium",
                    fontSize: 16,
                  }}
                >
                  {passError}
                </Text>
              ) : null}
            </View>
          </View>

          <View>
            <Text style={MyStyles.inputLabel}>New Password</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                onChangeText={passwordValidation}
                value={newpassword}
                secureTextEntry={secureNewPass}
                placeholder="Enter password"
                style={[MyStyles.input, { paddingRight: 40 }]}
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: [{ translateY: -12 }],
                }}
                onPress={togglesecureNewPass}
              >
                <Ionicons
                  name={secureNewPass ? "eye-off" : "eye"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
              {passwordErrors.length > 0 && (
                <View style={{ marginTop: 5, width: 300 }}>
                  {passwordErrors.map((error, index) => (
                    <Text
                      key={index}
                      style={{
                        color: "red",
                        fontFamily: "QuicksandMedium",
                        fontSize: 16,
                      }}
                    >
                      {error}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View>
            <Text style={MyStyles.inputLabel}>Confirm New Password</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                onChangeText={repasswordValidation}
                value={renewpassword}
                secureTextEntry={secureConfirmPass}
                placeholder="Enter password"
                style={[MyStyles.input, { paddingRight: 40 }]}
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: [{ translateY: -12 }],
                }}
                onPress={togglesecureConfirmPass}
              >
                <Ionicons
                  name={secureConfirmPass ? "eye-off" : "eye"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
              {repasswordErrors.length > 0 && (
                <View style={{ marginTop: 5, width: 300 }}>
                  {repasswordErrors.map((error, index) => (
                    <Text
                      key={index}
                      style={{
                        color: "red",
                        fontFamily: "QuicksandMedium",
                        fontSize: 16,
                      }}
                    >
                      {error}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={handleConfirm} style={MyStyles.button}>
          <Text style={MyStyles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
