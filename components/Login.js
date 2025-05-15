import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OtpContext } from "../context/OtpContext";
import api from "../api";
import AppLogo from "../assets/applogo-darkbg.png";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Fontisto from "@expo/vector-icons/Fontisto";
import * as SecureStore from "expo-secure-store";

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
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#04384E" }}
    >
      <View style={{ flex: 4 }}>
        <View style={{ flex: 1, alignSelf: "center" }}>
          <Image source={AppLogo} style={{ width: "180", height: "180" }} />
        </View>

        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#F0F4F7",
            borderRadius: 15,
            flex: 3,
            paddingHorizontal: 20,
            paddingVertical: 20,
            gap: 20,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              color: "#04384E",
              fontWeight: "bold",
              marginTop: 10,
              alignSelf: "flex-start",
            }}
          >
            Login to your Account
          </Text>
          <View style={{ gap: 10, width: "100%" }}>
            <View style={MyStyles.loginInputContainer}>
              <FontAwesome5
                name="user-alt"
                size={20}
                color="#04384E"
                style={{ marginRight: 10 }}
              />
              <TextInput
                style={MyStyles.loginInput}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <View style={MyStyles.loginInputContainer}>
              <Fontisto
                name="locked"
                size={20}
                color="#04384E"
                style={{ marginRight: 10 }}
              />

              <TextInput
                secureTextEntry={true}
                style={MyStyles.loginInput}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <Text
            style={{
              color: "#006EFF",
              fontWeight: "bold",
              alignSelf: "flex-end",
              fontSize: 16,
              marginTop: "-10",
            }}
          >
            Forgot Password?
          </Text>

          <TouchableOpacity
            onPress={() => handleLogin(navigation)}
            style={MyStyles.button}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 24,
              }}
            >
              Log In
            </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", gap: 4, marginTop: "-10" }}>
            <Text style={{ color: "#ACACAC", fontSize: 16 }}>
              Don't have an account?
            </Text>
            <Text
              onPress={() => navigation.navigate("Signup")}
              style={{ color: "#006EFF", fontWeight: "bold", fontSize: 16 }}
            >
              Sign up
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Login;
