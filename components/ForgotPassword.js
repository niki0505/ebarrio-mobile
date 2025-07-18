import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useEffect, useRef, useState } from "react";
import { OtpContext } from "../context/OtpContext";
import { OtpInput } from "react-native-otp-entry";
import { Dropdown } from "react-native-element-dropdown";
import api from "../api";
import AppLogo from "../assets/applogo-darkbg.png";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";

//ICONS
import { MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

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

  const [secureNewPass, setsecureNewPass] = useState(true);
  const [secureConfirmPass, setsecureConfirmPass] = useState(true);

  // Toggle Password Visibility in Reset Password
  const togglesecureNewPass = () => {
    setsecureNewPass(!secureNewPass);
  };

  const togglesecureConfirmPass = () => {
    setsecureConfirmPass(!secureConfirmPass);
  };

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
        alert("OTP use is currently disabled. Try again after 30 minutes.");
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
      <Image source={AppLogo} style={MyStyles.overlayLogo} />

      {/* Black Overlay */}
      <View style={MyStyles.overlayBlack} />
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: "#04384E",
      }}
    >
      {/* 1st Design */}
      {!isExisting && (
        <View style={{ flex: 4, backgroundColor: "#04384E" }}>
          <View style={{ flex: 1, alignSelf: "center" }}>
            <Image source={AppLogo} style={MyStyles.loginLogo} />
          </View>

          <View style={MyStyles.loginBottomWrapper}>
            <Text style={[MyStyles.header, { alignSelf: "flex-start" }]}>
              Forgot Password
            </Text>

            <Text style={MyStyles.forgotMsg}>
              Enter your username to reset your password
            </Text>

            <View style={MyStyles.loginFormWrapper}>
              <View>
                <Text style={MyStyles.inputLabel}>
                  Username<Text style={{ color: "red" }}>*</Text>
                </Text>
                <TextInput
                  onChangeText={setUsername}
                  placeholder="Username"
                  style={MyStyles.input}
                />
              </View>
            </View>

            <TouchableOpacity onPress={handleSubmit} style={MyStyles.button}>
              <Text style={MyStyles.buttonText}>Submit</Text>
            </TouchableOpacity>

            <Text
              onPress={() => navigation.navigate("Login")}
              style={{
                color: "#006EFF",
                fontSize: 16,
                marginTop: 10,
                fontFamily: "QuicksandBold",
              }}
            >
              Remember your password?
            </Text>
          </View>
        </View>
      )}

      {/* 2nd Design */}
      {isExisting && (
        <>
          {/* Reset Password */}
          {isVerified ? (
            <>
              <BackgroundOverlay />
              <View style={MyStyles.forgotCardWrapper}>
                <View style={[MyStyles.forgotCard, { height: "60%" }]}>
                  <ScrollView showsVerticalScrollIndicator={true}>
                    <MaterialIcons
                      onPress={() => setOTPClicked(false)}
                      name="arrow-back-ios"
                      size={30}
                      color="#04384E"
                      style={{ alignSelf: "flex-start" }}
                    />

                    <Text style={MyStyles.header}>Reset Password</Text>

                    <Text style={MyStyles.forgotMsg}>
                      To ensure the security of your account, please create a
                      new password.
                    </Text>

                    <View style={MyStyles.loginFormWrapper}>
                      <View>
                        <Text style={MyStyles.inputLabel}>
                          New Password<Text style={{ color: "red" }}>*</Text>
                        </Text>
                        <View style={{ position: "relative" }}>
                          <TextInput
                            onChangeText={setNewPassword}
                            secureTextEntry={secureNewPass}
                            placeholder="New Password"
                            style={[MyStyles.input, { paddingRight: 40 }]}
                          />
                          <TouchableOpacity
                            style={MyStyles.eyeToggle}
                            onPress={togglesecureNewPass}
                          >
                            <Ionicons
                              name={secureNewPass ? "eye-off" : "eye"}
                              size={24}
                              color="#808080"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View>
                        <Text style={MyStyles.inputLabel}>
                          Confirm New Password
                          <Text style={{ color: "red" }}>*</Text>
                        </Text>

                        <View style={{ position: "relative" }}>
                          <TextInput
                            onChangeText={setReNewPassword}
                            secureTextEntry={secureConfirmPass}
                            placeholder="Confirm New Password"
                            style={[MyStyles.input, { paddingRight: 40 }]}
                          />
                          <TouchableOpacity
                            style={MyStyles.eyeToggle}
                            onPress={togglesecureConfirmPass}
                          >
                            <Ionicons
                              name={secureConfirmPass ? "eye-off" : "eye"}
                              size={24}
                              color="#808080"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={handleSuccessful}
                      style={MyStyles.button}
                    >
                      <Text style={MyStyles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </View>
            </>
          ) : /* One-Time Password */ isOTPClicked ? (
            <>
              <BackgroundOverlay />
              <View style={MyStyles.forgotCardWrapper}>
                <View style={MyStyles.forgotCard}>
                  <MaterialIcons
                    onPress={() => setOTPClicked(false)}
                    name="arrow-back-ios"
                    size={30}
                    color="#04384E"
                    style={{ alignSelf: "flex-start" }}
                  />
                  <Text style={MyStyles.header}>Account Verification</Text>

                  <Text style={MyStyles.forgotMsg}>
                    Enter the 6-digit code sent to
                  </Text>
                  <Text
                    style={[
                      MyStyles.forgotMsg,
                      {
                        marginTop: 5,
                      },
                    ]}
                  >
                    {user.resID?.mobilenumber || user.empID?.resID.mobilenumber}
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
                    <Text style={MyStyles.forgotMsg}>
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
          ) : /* Security Questions */ isQuestionsClicked ? (
            <>
              <BackgroundOverlay />

              <View style={MyStyles.forgotCardWrapper}>
                <View style={[MyStyles.forgotCard, { height: "60%" }]}>
                  <ScrollView showsVerticalScrollIndicator={true}>
                    <MaterialIcons
                      name="arrow-back-ios"
                      size={30}
                      color="#04384E"
                      style={{ alignSelf: "flex-start" }}
                    />

                    <Text style={MyStyles.header}>Security Question</Text>
                    <Text style={MyStyles.forgotMsg}>
                      To verify your identity, please answer your chosen
                      security question below.
                    </Text>

                    <View style={MyStyles.loginFormWrapper}>
                      <View>
                        <Text style={MyStyles.inputLabel}>
                          Security Question
                          <Text style={{ color: "red" }}>*</Text>
                        </Text>
                        <Dropdown
                          labelField="label"
                          valueField="value"
                          value={securityquestion.question}
                          data={user.securityquestions?.map((q) => ({
                            label: q.question,
                            value: q.question,
                          }))}
                          placeholder="Select"
                          placeholderStyle={{ color: "#808080" }}
                          onChange={(item) =>
                            handleInputChange("question", item.value)
                          }
                          style={MyStyles.input}
                        ></Dropdown>
                      </View>

                      <View>
                        <Text style={MyStyles.inputLabel}>
                          Answer
                          <Text style={{ color: "red" }}>*</Text>
                        </Text>
                        <TextInput
                          onChangeText={(e) => handleInputChange("answer", e)}
                          secureTextEntry={true}
                          placeholder="Answer"
                          style={MyStyles.input}
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={handleQuestionVerify}
                      style={MyStyles.button}
                    >
                      <Text style={[MyStyles.buttonText]}>Continue</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </View>
            </>
          ) : (
            /* Verification Method */
            <>
              <BackgroundOverlay />
              {/* Card container with transparency */}
              <View style={MyStyles.forgotCardWrapper}>
                <View style={MyStyles.forgotCard}>
                  <MaterialIcons
                    onPress={() => setIsExisting(false)}
                    name="arrow-back-ios"
                    size={30}
                    color="#04384E"
                    style={{ alignSelf: "flex-start" }}
                  />
                  <Text style={MyStyles.header}>Verification Method</Text>
                  <Text style={MyStyles.forgotMsg}>
                    Please choose a method to verify your identity and continue
                    resetting your password
                  </Text>

                  <View style={MyStyles.methodOptionsWrapper}>
                    <View style={MyStyles.methodOptions}>
                      <MaterialIcons
                        name="password"
                        size={24}
                        color="#04384E"
                      />
                      <Text
                        onPress={handleOTP}
                        style={{
                          color: "#04384E",
                          fontSize: 18,
                          fontFamily: "QuicksandBold",
                        }}
                      >
                        One Time Password
                      </Text>
                    </View>

                    <View style={MyStyles.methodOptions}>
                      <MaterialCommunityIcons
                        name="comment-question"
                        size={24}
                        color="#04384E"
                      />
                      <Text
                        onPress={() => setQuestionsClicked(true)}
                        style={{
                          color: "#04384E",
                          fontSize: 18,
                          fontFamily: "QuicksandSemiBold",
                        }}
                      >
                        Security Question
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default ForgotPassword;
