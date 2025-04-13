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
import Home from "./Home";
// import CheckBox from "react-native-check-box";

const Login = () => {
  const { saveRefreshToken, saveAccessToken, saveUserID, setIsUserLoggedIn } =
    useContext(AuthContext);
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //   const [remember, setRemember] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://10.0.2.2:4000/api/auth/login", {
        username,
        password,
      });
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
        console.log(`✅ Correct Password`);
        console.log("Refresh Token", res.data.refreshToken);
        console.log("Access Token", res.data.accessToken);
        await saveAccessToken(res.data.accessToken);
        await saveRefreshToken(res.data.refreshToken);
        Alert.alert("Success", "Login Successful.");
        setIsUserLoggedIn(true);
        navigation.navigate("Home");
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
