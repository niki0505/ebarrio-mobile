import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { useAuthStore } from "../store/authStore";

const Login = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (navigation) => {
    try {
      const response = await fetch("http://10.0.2.2:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (!data.exists) {
        console.log(`❌ Account not found, returning exists:${data.exists}`);
        Alert.alert("Error", "Account not found. Please register.");
        setUsername("");
        setPassword("");
        return;
      }

      if (!data.correctPassword) {
        console.log(`❌ Incorrect Password`);
        Alert.alert(
          "Error",
          "Incorrect Password. Please input the correct password."
        );
        setPassword("");
      } else {
        console.log(`✅ Correct Password`);
        await AsyncStorage.setItem("accessToken", data.accessToken);
        useAuthStore.getState().login(data.accessToken, navigation);
        Alert.alert("Success", "Login Successful!");
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <View style={MyStyles.container}>
      <View style={{ flexDirection: "column", gap: 10 }}>
        <TextInput
          style={MyStyles.textfield}
          placeholder="Enter username here"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={MyStyles.textfield}
          placeholder="Enter password here"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => handleLogin(navigation)}
          style={MyStyles.btn}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
            Log In
          </Text>
        </TouchableOpacity>
        <Text onPress={() => navigation.navigate("Signup")}>Go to Sign up</Text>
      </View>
    </View>
  );
};
export default Login;
