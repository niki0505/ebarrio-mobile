import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { OtpContext } from "../context/OtpContext";
import { OtpInput } from "react-native-otp-entry";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

const OTP = ({}) => {
  const route = useRoute();
  const {
    resID = "",
    mobilenumber = "",
    username = "",
    password = "",
    securityquestions = "",
    navigatelink = "",
  } = route.params || {};

  const navigation = useNavigation();
  const [resendTimer, setResendTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [resendCount, setResendCount] = useState(0);
  const { sendOTP, verifyOTP } = useContext(OtpContext);
  const { login } = useContext(AuthContext);
  const otpRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (isResendDisabled) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isResendDisabled]);

  const handleResend = async () => {
    if (resendCount < 3) {
      try {
        sendOTP(username, mobilenumber);
        setResendTimer(30);
        setIsResendDisabled(true);
        setResendCount((prevCount) => prevCount + 1);
        console.log("New OTP is generated");
      } catch (error) {
        console.error("Error sending OTP:", error);
        alert("Something went wrong while sending OTP");
      }
    } else {
      Alert.alert("Limit reached", "You can only resend OTP 3 times.");
    }
  };

  const handleVerify = async (OTP) => {
    try {
      const result = await verifyOTP(username, OTP);
      alert(result.message);
      if (navigatelink === "Login") {
        try {
          await api.post("/register", {
            username,
            password,
            resID,
            securityquestions,
          });
          navigation.navigate("Login");
        } catch (error) {
          console.log("Error logging in", error);
        }
      } else if (navigatelink === "BottomTabs") {
        await login({ username, password });
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

  const handleOTPChange = (text) => {
    if (text.length === 6) {
      handleVerify(text);
    }
  };

  return (
    <View style={MyStyles.container}>
      <View style={{ width: 330 }}>
        <OtpInput
          ref={otpRef}
          type="numeric"
          numberOfDigits={6}
          onTextChange={handleOTPChange}
        />
      </View>
      {isResendDisabled ? (
        <Text style={{ color: "gray" }}>
          Resend OTP in {resendTimer} second{resendTimer !== 1 ? "s" : ""}
        </Text>
      ) : (
        <Text onPress={handleResend} style={{ color: "blue" }}>
          Resend OTP
        </Text>
      )}
    </View>
  );
};
export default OTP;
