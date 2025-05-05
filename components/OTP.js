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
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { OtpContext } from "../context/OtpContext";
import Home from "./Home";
import { OtpInput } from "react-native-otp-entry";

// import CheckBox from "react-native-check-box";

const OTP = ({ route }) => {
  const { resID, mobilenumber, username, password } = route.params;
  const navigation = useNavigation();
  const [resendTimer, setResendTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [resendCount, setResendCount] = useState(0);
  const [OTP, setOTP] = useState("");
  const { otp, timer, startOtp, clearOtp } = useContext(OtpContext);
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
      clearOtp();
      console.log("OTP from context is removed");
      console.log("Resending OTP...");
      try {
        const res = await axios.post("http://10.0.2.2:4000/api/otp", {
          mobilenumber,
        });
        startOtp(res.data.otp, 300);
        setResendTimer(30);
        setIsResendDisabled(true);
        setResendCount((prevCount) => prevCount + 1);
        console.log("New OTP is generated");
      } catch (error) {
        console.error("Error sending OTP:", error);
        Alert.alert("Error", "Something went wrong while sending OTP");
      }
    } else {
      Alert.alert("Limit reached", "You can only resend OTP 3 times.");
    }
  };

  useEffect(() => {
    if (otp) {
      console.log("OTP from context is active");
    } else {
      console.log("OTP from context is not active");
    }
  }, [otp]);

  const handleOTP = async (enteredOTP) => {
    const cleanOtp = otp.toString().trim();
    const cleanEnteredOtp = enteredOTP.toString().trim();
    if (cleanOtp === cleanEnteredOtp) {
      const res = await axios.post("http://10.0.2.2:4000/api/register", {
        username: username,
        password: password,
        resID: resID,
      });
      Alert.alert("Success", "User registered successfully. Please log in.");
      navigation.navigate("Login");
    } else {
      Alert.alert("Incorrect OTP", "The OTP you entered is incorrect.");
      otpRef.current.clear();
    }
  };

  const handleOTPChange = (text) => {
    if (text.length === 6) {
      handleOTP(text);
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
