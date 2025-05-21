import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Touchable,
  TouchableOpacity,
  TextInput,
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

  const handlePasswordChange = async () => {
    if (newpassword !== renewpassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      await api.put("/changepassword", {
        newpassword,
        password,
      });
      alert("Password successfully changed! Please log in again.");
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
                onChangeText={(e) => setPassword(e)}
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
            </View>
          </View>

          <View>
            <Text style={MyStyles.inputLabel}>New Password</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                onChangeText={(e) => setNewPassword(e)}
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
            </View>
          </View>

          <View>
            <Text style={MyStyles.inputLabel}>Confirm New Password</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                onChangeText={(e) => setRenewPassword(e)}
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
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={handlePasswordChange}
          style={MyStyles.button}
        >
          <Text style={MyStyles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
