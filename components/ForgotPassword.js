import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useEffect, useRef, useState } from "react";
import { OtpContext } from "../context/OtpContext";
import { TextInput } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { OtpInput } from "react-native-otp-entry";
import { Dropdown } from "react-native-element-dropdown";
import api from "../api";

const ForgotPassword = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState("");
  const [user, setUser] = useState([]);
  const { sendOTP, verifyOTP } = useContext(OtpContext);
  const [resendTimer, setResendTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [resendCount, setResendCount] = useState(0);
  const [isExisting, setIsExisting] = useState(false);
  const [isOTPClicked, setOTPClicked] = useState(false);
  const otpRef = useRef(null);
  const [isQuestionsClicked, setQuestionsClicked] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [renewPassword, setReNewPassword] = useState("");
  const [OTP, setOTP] = useState("");
  const [securityquestion, setSecurityQuestion] = useState({
    question: "",
    answer: "",
  });

  const handleInputChange = (field, value) => {
    const updatedValue = field === "answer" ? value.toLowerCase() : value;
    setSecurityQuestion((prev) => ({
      ...prev,
      [field]: updatedValue,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await api.get(`/checkuser/${username}`);
      setIsExisting(true);
      setUser(response.data);
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

  const handleQuestionVerify = async () => {
    try {
      await api.post(`/verifyquestion/${username}`, { securityquestion });
      setIsVerified(true);
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

  const handleOTP = async () => {
    try {
      await api.get(`/checkotp/${username}`);
      if (resendCount === 3) {
        setIsResendDisabled(true);
        alert("You can only resend OTP 3 times.");
        setOTPClicked(false);
        await api.get(`/limitotp/${username}`);
        return;
      }
      setOTPClicked(true);
      setResendCount((prevCount) => prevCount + 1);
      setResendTimer(30);
      sendOTP(
        username,
        user.resID?.mobilenumber || user.empID?.resID.mobilenumber
      );
    } catch (error) {
      if (error.response && error.response.status === 429) {
        alert("OTP use is currently disabled. Try again later.");
      } else {
        console.error("Error checking OTP:", error);
      }
    }
  };

  const handleSuccessful = async () => {
    try {
      await api.post(`/newpassword/${username}`, { newPassword });
      alert("You have successfully reset your password!");
      navigation.navigate("Login");
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
    if (!isOTPClicked || !isResendDisabled) return;
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
  }, [isResendDisabled, isOTPClicked]);

  const handleResend = async () => {
    if (resendCount < 3) {
      try {
        sendOTP(
          username,
          user.resID?.mobilenumber || user.empID?.resID.mobilenumber
        );
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
      const result = await verifyOTP(username, OTP);
      alert(result.message);
      setIsVerified(true);
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
    if (isOTPClicked && OTP.length === 6) {
      const timeout = setTimeout(() => {
        handleVerify();
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [OTP, isOTPClicked]);

  const handleOTPChange = (text) => {
    if (text.length === 6) {
      handleVerify(text);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }}
    >
      <ScrollView
        contentContainerStyle={[
          MyStyles.scrollContainer,
          {
            paddingBottom: insets.bottom + 70,
          },
        ]}
      >
        {/* 1st Design */}
        {!isExisting && (
          <>
            <Text style={[MyStyles.header, { marginBottom: 0 }]}>
              Forgot Password
            </Text>
            <View>
              <Text>Username</Text>
              <TextInput
                onChangeText={setUsername}
                placeholder="Enter username"
              />
            </View>
            <TouchableOpacity onPress={handleSubmit}>
              <Text>Submit</Text>
            </TouchableOpacity>
          </>
        )}

        {/* 2nd Design */}
        {isExisting && (
          <>
            {/* Reset Password */}
            {isVerified ? (
              <>
                <View>
                  <Text>New Password</Text>
                  <TextInput
                    onChangeText={setNewPassword}
                    secureTextEntry={true}
                    placeholder="Enter password"
                  />
                </View>
                <View>
                  <Text>Confirm New Password</Text>
                  <TextInput
                    onChangeText={setReNewPassword}
                    secureTextEntry={true}
                    placeholder="Enter password"
                  />
                </View>
                <TouchableOpacity onPress={handleSuccessful}>
                  <Text>Confirm</Text>
                </TouchableOpacity>
              </>
            ) : /* One-Time Password */ isOTPClicked ? (
              <>
                <MaterialIcons
                  onPress={() => setOTPClicked(false)}
                  name="arrow-back-ios"
                  size={30}
                  color="#04384E"
                />
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
                    style={{
                      fontSize: 24,
                      color: "#04384E",
                      fontWeight: "bold",
                      marginTop: 10,
                      alignSelf: "flex-start",
                    }}
                  >
                    Account Verification
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#ACACAC",
                    }}
                  >
                    Enter the 6-digit code sent to
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#04384E",
                      marginTop: "-20",
                    }}
                  >
                    {user.resID?.mobilenumber || user.empID?.resID.mobilenumber}
                  </Text>
                  <OtpInput
                    ref={otpRef}
                    type="numeric"
                    numberOfDigits={6}
                    onTextChange={handleOTPChange}
                  />

                  {isResendDisabled ? (
                    <Text style={{ color: "gray" }}>
                      Resend OTP in {resendTimer} second
                      {resendTimer !== 1 ? "s" : ""}
                    </Text>
                  ) : (
                    <View style={{ flexDirection: "row", gap: 4 }}>
                      <Text onPress={handleResend} style={{ color: "#ACACAC" }}>
                        Didn't get a code?
                      </Text>
                      <Text
                        onPress={handleResend}
                        style={{ color: "#006EFF", fontWeight: "bold" }}
                      >
                        Resend OTP
                      </Text>
                    </View>
                  )}
                </View>
              </>
            ) : /* Security Questions */ isQuestionsClicked ? (
              <>
                <MaterialIcons
                  onPress={() => setQuestionsClicked(false)}
                  name="arrow-back-ios"
                  size={30}
                  color="#04384E"
                />
                <View>
                  <Text>Security Question #1</Text>
                  <Dropdown
                    labelField="label"
                    valueField="value"
                    value={securityquestion.question}
                    data={user.securityquestions?.map((q) => ({
                      label: q.question,
                      value: q.question,
                    }))}
                    placeholder="Select"
                    placeholderStyle={{ color: "gray" }}
                    onChange={(item) =>
                      handleInputChange("question", item.value)
                    }
                    style={MyStyles.input}
                  ></Dropdown>
                  <Text>Answer</Text>
                  <TextInput
                    onChangeText={(e) => handleInputChange("answer", e)}
                    secureTextEntry={true}
                    placeholder="Enter answer"
                  />
                  <TouchableOpacity onPress={handleQuestionVerify}>
                    <Text>Continue</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              /* Verification Method */
              <>
                <MaterialIcons
                  onPress={() => setIsExisting(false)}
                  name="arrow-back-ios"
                  size={30}
                  color="#04384E"
                />
                <TouchableOpacity onPress={handleOTP}>
                  <Text>OTP</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setQuestionsClicked(true)}>
                  <Text>Security Questions</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
