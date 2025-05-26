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
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as SecureStore from "expo-secure-store";

const Login = () => {
  const insets = useSafeAreaInsets();
  const { sendOTP } = useContext(OtpContext);
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureLoginPass, setsecureLoginPass] = useState(true);

  // Toggle Password Visibility
  const togglesecureLoginPass = () => {
    setsecureLoginPass(!secureLoginPass);
  };

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
          navigation.navigate("SetPassword", {
            username,
          });
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
      <View style={{ flex: 4, backgroundColor: "#04384E" }}>
        <View style={{ flex: 1, alignSelf: "center" }}>
          <Image source={AppLogo} style={{ width: "180", height: "180" }} />
        </View>

        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#F0F4F7",
            borderRadius: 30,
            flex: 3,
            padding: 30,
            bottom: "-10",
          }}
        >
          <Text style={[MyStyles.header, { alignSelf: "flex-start" }]}>
            Login to your Account
          </Text>
          <View style={{ marginVertical: 30, gap: 15, width: "100%" }}>
            <View
              style={{
                position: "relative",
              }}
            >
              <TextInput
                style={[
                  MyStyles.input,
                  {
                    paddingLeft: 40,
                    paddingRight: 40,
                  },
                ]}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />

              <FontAwesome5
                name="user-alt"
                size={20}
                color="#04384E"
                style={{
                  position: "absolute",
                  left: 15,
                  top: "50%",
                  transform: [{ translateY: -10 }],
                }}
              />
            </View>

            <View
              style={{
                position: "relative",
              }}
            >
              <TextInput
                secureTextEntry={secureLoginPass}
                style={[
                  MyStyles.input,
                  {
                    paddingLeft: 40,
                    paddingRight: 40,
                  },
                ]}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
              />

              <Fontisto
                name="locked"
                size={20}
                color="#04384E"
                style={{
                  position: "absolute",
                  left: 15,
                  top: "50%",
                  transform: [{ translateY: -10 }],
                }}
              />
              <TouchableOpacity
                onPress={togglesecureLoginPass}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: [{ translateY: -12 }],
                }}
              >
                <Ionicons
                  name={secureLoginPass ? "eye-off" : "eye"}
                  size={20}
                  color="#808080"
                />
              </TouchableOpacity>
            </View>

            <Text
              onPress={() => navigation.navigate("ForgotPassword")}
              style={{
                color: "#006EFF",
                alignSelf: "flex-end",
                fontSize: 16,
                fontFamily: "QuicksandBold",
                marginTop: "-10",
              }}
            >
              Forgot Password?
            </Text>
          </View>

          <TouchableOpacity onPress={handleLogin} style={MyStyles.button}>
            <Text style={MyStyles.buttonText}>Log In</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", gap: 4, marginTop: 10 }}>
            <Text
              style={{
                color: "#808080",
                fontSize: 16,
                fontFamily: "QuicksandSemiBold",
              }}
            >
              Don't have an account?
            </Text>
            <Text
              onPress={() => navigation.navigate("Signup")}
              style={{
                color: "#006EFF",
                fontSize: 16,
                fontFamily: "QuicksandBold",
              }}
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
