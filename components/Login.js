import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OtpContext } from "../context/OtpContext";
import api from "../api";

const Login = () => {
  const insets = useSafeAreaInsets();
  const { sendOTP } = useContext(OtpContext);
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/checkcredentials", {
        username,
        password,
      });
      if (res.status === 200) {
        if (res.data.message === "Credentials verified") {
          await login({ username, password });
          // const response = await api.get(`/getmobilenumber/${username}`);
          // sendOTP(username, response.data.mobilenumber);
          // navigation.navigate("OTP", {
          //   navigatelink: "BottomTabs",
          //   username,
          //   mobilenumber: response.data.mobilenumber,
          //   password: password,
          // });
        } else if (res.data.message === "Token verified successfully!") {
          console.log("Set Password");
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
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }} // para hindi nago-overlap sa status bar when scrolled
    >
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
            style={MyStyles.button}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
              Log In
            </Text>
          </TouchableOpacity>
          <Text onPress={() => navigation.navigate("Signup")}>
            Go to Sign up
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Login;
