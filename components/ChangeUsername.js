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
import { useContext, useEffect, useState } from "react";
import { TextInput } from "react-native-paper";
import { InfoContext } from "../context/InfoContext";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

const ChangeUsername = () => {
  const { fetchUserDetails, userDetails } = useContext(InfoContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
        <View>
          <View>
            <Text>Current Username</Text>
            <Text>{userDetails.username}</Text>
          </View>
          <View>
            <Text>New Username</Text>
            <TextInput
              onChangeText={(e) => setUsername(e)}
              placeholder="Enter new username"
            />
          </View>
          <View>
            <Text>Password</Text>
            <TextInput
              onChangeText={(e) => setPassword(e)}
              secureTextEntry={true}
              placeholder="Enter password"
            />
          </View>
          <TouchableOpacity onPress={handleUsernameChange}>
            <Text>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangeUsername;
