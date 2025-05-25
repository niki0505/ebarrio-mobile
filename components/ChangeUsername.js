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
import { useContext, useEffect, useState } from "react";
import { InfoContext } from "../context/InfoContext";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

//ICONS
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";

const ChangeUsername = () => {
  const { fetchUserDetails, userDetails } = useContext(InfoContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [securePass, setsecurePass] = useState(true);

  // Toggle Password Visibility in Reset Password
  const togglesecurePass = () => {
    setsecurePass(!securePass);
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleUsernameChange = async () => {
    if (username === userDetails.username) {
      alert("The new username must be different from the current username.");
      return;
    }

    try {
      await api.get(`/checkusername/${username}`);
      try {
        await api.put("/changeusername", { username, password });
        alert("Username changed successfully!");
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
          Change Username
        </Text>

        <View style={{ gap: 10, marginVertical: 30 }}>
          <View>
            <Text style={MyStyles.inputLabel}>Current Username</Text>
            <Text
              style={{
                fontSize: 16,
                color: "black",
                fontFamily: "QuicksandSemiBold",
              }}
            >
              {userDetails.username}
            </Text>
          </View>
          <View>
            <Text style={MyStyles.inputLabel}>New Username</Text>
            <TextInput
              onChangeText={(e) => setUsername(e)}
              placeholder="Enter new username"
              style={MyStyles.input}
            />
          </View>

          <View>
            <Text style={MyStyles.inputLabel}>Password</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                onChangeText={(e) => setPassword(e)}
                secureTextEntry={securePass}
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
                onPress={togglesecurePass}
              >
                <Ionicons
                  name={securePass ? "eye-off" : "eye"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleUsernameChange}
          style={MyStyles.button}
        >
          <Text style={MyStyles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangeUsername;
