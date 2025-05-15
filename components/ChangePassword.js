import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import { TextInput } from "react-native-paper";
import api from "../api";

const ChangePassword = () => {
  const { logout } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [renewpassword, setRenewPassword] = useState("");
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
        <Text style={[MyStyles.header, { marginTop: 10 }]}>
          Change Password
        </Text>
        <View>
          <View>
            <Text>Current Password</Text>
            <TextInput
              onChangeText={(e) => setPassword(e)}
              secureTextEntry={true}
              placeholder="Enter password"
            />
          </View>
          <View>
            <Text>New Password</Text>
            <TextInput
              onChangeText={(e) => setNewPassword(e)}
              secureTextEntry={true}
              placeholder="Enter password"
            />
          </View>
          <View>
            <Text>Confirm New Password</Text>
            <TextInput
              onChangeText={(e) => setRenewPassword(e)}
              secureTextEntry={true}
              placeholder="Enter password"
            />
          </View>
          <TouchableOpacity onPress={handlePasswordChange}>
            <Text>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
