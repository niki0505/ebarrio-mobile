import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import * as SecureStore from "expo-secure-store";
import Home from "./Home";
// import CheckBox from "react-native-check-box";

const Login = () => {
  const { setIsAuthenticated, login } = useContext(AuthContext);
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "https://ebarrio-mobile-backend.onrender.com/api/login",
        {
          username,
          password,
        }
      );
      if (!res.data.exists) {
        console.log(`❌ Account not found`);
        Alert.alert("Error", "Account not found. Please register.");
        setUsername("");
        setPassword("");
        return;
      }

      if (!res.data.correctPassword) {
        console.log(`❌ Incorrect Password`);
        Alert.alert(
          "Error",
          "Incorrect Password. Please input the correct password."
        );
        setPassword("");
      } else {
        await login({ username, password });
      }
    } catch (error) {
      Alert.alert("Errors", error.message);
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
        {/* <View>
          <View style={{ flexDirection: "row" }}>
            <CheckBox
              isChecked={remember}
              onClick={() => setRemember(!remember)}
              checkedCheckBoxColor="#59D05E"
              uncheckedCheckBoxColor="#ACACAC"
            />
            <Text>Remember Me</Text>
          </View>
        </View> */}
        <TouchableOpacity
          onPress={() => handleLogin(navigation)}
          style={MyStyles.button}
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
