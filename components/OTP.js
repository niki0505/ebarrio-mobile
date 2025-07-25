import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { OtpContext } from "../context/OtpContext";
import { OtpInput } from "react-native-otp-entry";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import AppLogo from "../assets/applogo-darkbg.png";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();

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
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }}
    >
      <View style={{ flex: 4, backgroundColor: "#04384E" }}>
        <View style={{ flex: 1, alignSelf: "center" }}>
          <Image source={AppLogo} style={{ width: "180", height: "180" }} />
        </View>
        <View
          style={{
            alignItems: "start",
            backgroundColor: "#fff",
            borderRadius: 15,
            flex: 3,
            paddingHorizontal: 20,
            paddingVertical: 20,
            gap: 20,
          }}
        >
          <Text
            style={[
              MyStyles.header,
              { marginTop: 10, alignSelf: "flex-start" },
            ]}
          >
            Account Verification
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#808080",
              fontFamily: "QuicksandSemiBold",
            }}
          >
            Enter the 6-digit code sent to
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#04384E",
              fontFamily: "QuicksandSemiBold",
              marginTop: "-20",
            }}
          >
            {mobilenumber}
          </Text>
          <OtpInput
            ref={otpRef}
            type="numeric"
            numberOfDigits={6}
            onTextChange={handleOTPChange}
          />

          {isResendDisabled ? (
            <Text
              style={{
                fontSize: 16,
                color: "#808080",
                fontFamily: "QuicksandSemiBold",
              }}
            >
              Resend OTP in <Text style={{ color: "red" }}>{resendTimer} </Text>{" "}
              second{resendTimer !== 1 ? "s" : ""}
            </Text>
          ) : (
            <View style={{ flexDirection: "row", gap: 4 }}>
              <Text
                onPress={handleResend}
                style={{
                  fontSize: 16,
                  color: "#808080",
                  fontFamily: "QuicksandSemiBold",
                }}
              >
                Didn't get a code?
              </Text>
              <Text
                onPress={handleResend}
                style={{
                  color: "#006EFF",
                  fontSize: 16,
                  fontFamily: "QuicksandBold",
                }}
              >
                Resend OTP
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
export default OTP;
