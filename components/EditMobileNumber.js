import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Touchable,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useEffect, useRef, useState } from "react";
import { InfoContext } from "../context/InfoContext";
import { OtpInput } from "react-native-otp-entry";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import api from "../api";
import AppLogo from "../assets/applogo-darkbg.png";

//ICONS
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { OtpContext } from "../context/OtpContext";

const EditMobileNumber = () => {
  const { fetchUserDetails, userDetails } = useContext(InfoContext);
  const [mobilenumber, setMobileNumber] = useState("+63");
  const [mobileError, setMobileError] = useState("");
  const [passError, setPassError] = useState("");
  const [password, setPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const { sendOTP, verifyOTP } = useContext(OtpContext);
  const [resendTimer, setResendTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [resendCount, setResendCount] = useState(0);
  const otpRef = useRef(null);
  const [OTP, setOTP] = useState("");
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [securePass, setsecurePass] = useState(true);

  const mobnum =
    userDetails.resID?.mobilenumber || userDetails.empID?.resID?.mobilenumber;

  const togglesecurePass = () => {
    setsecurePass(!securePass);
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleConfirm = () => {
    let hasError = false;
    let formattedNumber = mobilenumber;
    formattedNumber = "0" + mobilenumber.slice(3);

    if (formattedNumber === mobnum) {
      alert("The new mobile number must be different from the current one.");
      hasError = true;
    }

    if (formattedNumber.length !== 11) {
      setMobileError("This field is required.");
      hasError = true;
    } else {
      setMobileError("");
    }

    if (!password) {
      setPassError("This field is required.");
      hasError = true;
    } else {
      setPassError("");
    }

    if (hasError) {
      return;
    }
    Alert.alert(
      "Confirm",
      "Are you sure you want to edit your mobile number?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            checkPassword();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const checkPassword = async () => {
    try {
      await api.post("/checkpassword", { password });
      handleOTP();
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
  const handleMobileNumberChange = async () => {
    try {
      let formattedNumber = mobilenumber;
      formattedNumber = "0" + mobilenumber.slice(3);
      await api.put("/changemobilenumber", { mobilenumber: formattedNumber });
      setMobileNumber("+63");
      fetchUserDetails();
      setIsVerified(false);
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

  const mobileInputChange = (input) => {
    input.replace(/\D/g, "");

    if (!input.startsWith("+63")) {
      input = "+63" + input.replace(/^0+/, "").slice(2);
    }
    if (input.length > 13) {
      input = input.slice(0, 13);
    }
    if (input.length >= 4 && input[3] === "0") {
      return;
    }

    if (input.length < 13) {
      setMobileError("Invalid mobile number.");
    } else {
      setMobileError("");
    }

    setMobileNumber(input);
  };

  const handlePassChange = (input) => {
    if (input.length === 0) {
      setPassError("This field is empty.");
    } else {
      setPassError("");
    }
    setPassword(input);
  };

  useEffect(() => {
    if (!isVerified || !isResendDisabled) return;
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

  const handleOTP = async () => {
    try {
      await api.get(`/checkotp/${userDetails.username}`);
      if (resendCount === 3) {
        setIsResendDisabled(true);
        alert("You can only resend OTP 3 times.");
        setIsVerified(false);
        await api.get(`/limitotp/${userDetails.username}`);
        return;
      }
      setIsVerified(true);
      setResendCount((prevCount) => prevCount + 1);
      setResendTimer(30);
      sendOTP(userDetails.username, mobilenumber);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        alert("OTP use is currently disabled. Try again later.");
      } else {
        console.error("Error checking OTP:", error);
      }
    }
  };

  const handleResend = async () => {
    if (resendCount < 3) {
      try {
        sendOTP(userDetails.username, mobilenumber);
        setResendTimer(30);
        setIsResendDisabled(true);
        setResendCount((prevCount) => prevCount + 1);
        console.log("New OTP is generated");
      } catch (error) {
        console.error("Error sending OTP:", error);
        alert("Something went wrong while sending OTP");
      }
    } else {
      await api.get(`/limitotp/${username}`);
      alert("You can only resend OTP 3 times.");
    }
  };

  const handleVerify = async (OTP) => {
    try {
      const result = await verifyOTP(userDetails.username, OTP);
      alert(result.message);
      handleMobileNumberChange();
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

  useEffect(() => {
    if (isVerified && OTP.length === 6) {
      const timeout = setTimeout(() => {
        handleVerify();
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [OTP, isVerified]);

  const handleOTPChange = (text) => {
    if (text.length === 6) {
      handleVerify(text);
    }
  };

  const BackgroundOverlay = () => (
    <View style={{ position: "relative", height: "100%", width: "100%" }}>
      {/* SVG Background */}
      <Svg height="100%" width="100%">
        <Defs>
          <RadialGradient
            id="grad1"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <Stop offset="0%" stopColor="#0981B4" stopOpacity="1" />
            <Stop offset="25%" stopColor="#0978A7" stopOpacity="1" />
            <Stop offset="50%" stopColor="#086F9B" stopOpacity="1" />
            <Stop offset="75%" stopColor="#065474" stopOpacity="1" />
            <Stop offset="100%" stopColor="#064965" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad1)" />
      </Svg>

      {/* Logo */}
      <Image
        source={AppLogo}
        style={{
          width: 320,
          height: 320,
          position: "absolute",
          bottom: -75,
          left: -80,
        }}
      />

      {/* Black Overlay */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "black",
          opacity: 0.3,
          zIndex: 1,
        }}
      />
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }}
    >
      {!isVerified ? (
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
            Edit Mobile Number
          </Text>

          <View style={{ gap: 10, marginVertical: 30 }}>
            <View>
              <Text style={MyStyles.inputLabel}>Current Mobile Number</Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "black",
                  fontFamily: "QuicksandSemiBold",
                }}
              >
                {mobnum}
              </Text>
            </View>
            <View>
              <Text style={MyStyles.inputLabel}>New Mobile Number</Text>
              <TextInput
                onChangeText={mobileInputChange}
                placeholder="Enter new mobile number"
                value={mobilenumber}
                style={MyStyles.input}
              />
              {mobileError ? (
                <Text
                  style={{
                    color: "red",
                    fontFamily: "QuicksandMedium",
                    fontSize: 16,
                  }}
                >
                  {mobileError}
                </Text>
              ) : null}
            </View>

            <View>
              <Text style={MyStyles.inputLabel}>Password</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  onChangeText={handlePassChange}
                  secureTextEntry={securePass}
                  placeholder="Enter password"
                  style={[MyStyles.input, { paddingRight: 40 }]}
                />
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: [{ translateY: -12 }],
                  }}
                  onPress={togglesecurePass}
                >
                  <Ionicons
                    name={securePass ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
                {passError ? (
                  <Text
                    style={{
                      color: "red",
                      fontFamily: "QuicksandMedium",
                      fontSize: 16,
                    }}
                  >
                    {passError}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={handleConfirm} style={MyStyles.button}>
            <Text style={MyStyles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <>
          <BackgroundOverlay />
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            <View
              style={{
                width: "80%",
                height: "45%",
                backgroundColor: "#fff",
                borderRadius: 20,
                padding: 30,
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <MaterialIcons
                onPress={() => setIsVerified(false)}
                name="arrow-back-ios"
                size={30}
                color="#04384E"
                style={{ alignSelf: "flex-start" }}
              />
              <Text
                style={[
                  MyStyles.header,
                  { alignSelf: "flex-start", marginTop: 10, fontSize: 24 },
                ]}
              >
                Mobile Number Verification
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  color: "#808080",
                  alignSelf: "flex-start",
                  marginTop: 10,
                  fontFamily: "QuicksandSemiBold",
                }}
              >
                Enter the 6-digit code sent to
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "#04384E",
                  alignSelf: "flex-start",
                  marginTop: 5,
                  fontFamily: "QuicksandSemiBold",
                }}
              >
                {mobilenumber}
              </Text>

              <View style={{ marginTop: 30 }}>
                <OtpInput
                  ref={otpRef}
                  type="numeric"
                  numberOfDigits={6}
                  onTextChange={handleOTPChange}
                />
              </View>

              {isResendDisabled ? (
                <Text
                  style={{
                    fontSize: 16,
                    color: "#808080",
                    alignSelf: "flex-start",
                    marginTop: 10,
                    fontFamily: "QuicksandSemiBold",
                  }}
                >
                  Resend OTP in{" "}
                  <Text style={{ color: "red" }}>{resendTimer} </Text>second
                  {resendTimer !== 1 ? "s" : ""}
                </Text>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    gap: 4,
                    alignSelf: "flex-start",
                    marginTop: 10,
                  }}
                >
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
        </>
      )}
    </SafeAreaView>
  );
};

export default EditMobileNumber;
