import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { OtpContext } from "../context/OtpContext";
import api from "../api";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppLogo from "../assets/applogo-darkbg.png";

//ICONS
import Ionicons from "@expo/vector-icons/Ionicons";

const Signup = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { sendOTP } = useContext(OtpContext);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [mobilenumber, setMobileNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [fnameError, setFnameError] = useState(null);
  const [lnameError, setLnameError] = useState(null);
  const [usernameErrors, setUsernameErrors] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [repasswordErrors, setRePasswordErrors] = useState([]);
  const [secureNewPass, setSecureNewPass] = useState(true);
  const [secureConfirmPass, setSecureConfirmPass] = useState(true);

  const togglesecureNewPass = () => {
    setSecureNewPass(!secureNewPass);
  };

  const togglesecureConfirmPass = () => {
    setSecureConfirmPass(!secureConfirmPass);
  };

  const securityQuestionsList = [
    "What was the name of your first pet?",
    "What is your mother's maiden name?",
    "What was the name of your first school?",
  ];

  const firstnameValidation = (val) => {
    setFirstname(val);
    if (!val) {
      setFnameError("First name must not be empty");
    } else {
      setFnameError(null);
    }
  };

  const lastnameValidation = (val) => {
    setLastname(val);
    if (!val) {
      setLnameError("Last name must not be empty");
    } else {
      setLnameError(null);
    }
  };

  const usernameValidation = (val) => {
    let errors = [];
    let formattedVal = val.replace(/\s+/g, "");
    setUsername(formattedVal);

    if (!formattedVal) {
      errors.push("Username must not be empty");
    }
    if (
      (formattedVal && formattedVal.length < 3) ||
      (formattedVal && formattedVal.length > 16)
    ) {
      errors.push("Username must be between 3 and 16 characters only");
    }
    if (formattedVal && !/^[a-zA-Z0-9_]+$/.test(formattedVal)) {
      errors.push(
        "Username can only contain letters, numbers, and underscores."
      );
    }
    if (
      (formattedVal && formattedVal.startsWith("_")) ||
      (formattedVal && formattedVal.endsWith("_"))
    ) {
      errors.push("Username must not start or end with an underscore");
    }

    setUsernameErrors(errors);
  };

  const repasswordValidation = (val) => {
    let errors = [];
    let formattedVal = val.replace(/\s+/g, "");
    setRePassword(formattedVal);

    if (!formattedVal) {
      errors.push("Password must not be empty");
    }
    if (formattedVal !== password && formattedVal.length > 0) {
      errors.push("Passwords do not match");
    }
    setRePasswordErrors(errors);
  };

  const passwordValidation = (val) => {
    let errors = [];
    let formattedVal = val.replace(/\s+/g, "");
    setPassword(formattedVal);

    if (!formattedVal) {
      errors.push("Password must not be empty");
    }
    if (
      (formattedVal && formattedVal.length < 8) ||
      (formattedVal && formattedVal.length > 64)
    ) {
      errors.push("Password must be between 8 and 64 characters only");
    }
    if (formattedVal && !/^[a-zA-Z0-9!@\$%\^&*\+#]+$/.test(formattedVal)) {
      errors.push(
        "Password can only contain letters, numbers, and !, @, $, %, ^, &, *, +, #"
      );
    }
    setPasswordErrors(errors);
  };

  const handleSignUp = async () => {
    if (!firstname || !lastname || !username || !password || !repassword) {
      firstnameValidation(firstname);
      lastnameValidation(lastname);
      usernameValidation(username);
      passwordValidation(password);
      repasswordValidation(repassword);
      return;
    }
    try {
      if (usernameErrors.length !== 0) {
        return;
      }
      if (passwordErrors.length !== 0) {
        return;
      }
      if (repasswordErrors.length !== 0) {
        return;
      }

      try {
        const response = await api.post("/checkresident", {
          username,
          firstname,
          lastname,
          mobilenumber,
        });
        try {
          sendOTP(username, mobilenumber);
          navigation.navigate("OTP", {
            username: username,
            password: password,
            mobilenumber: mobilenumber,
            resID: response.data.resID,
            navigatelink: "Login",
          });
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
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleSignUp2 = async () => {
    navigation.navigate("OTP");
    // let errors1 = [];
    // let errors2 = [];
    // let errors3 = [];
    // let errors4 = [];
    // if (securityquestions[0].question === "") {
    //   errors1.push("Security question must not be empty");
    // } else {
    //   errors1 = errors1.filter(
    //     (error) => error !== "Security question must not be empty"
    //   );
    // }

    // if (securityquestions[0].answer === "") {
    //   errors3.push("Answer must not be empty");
    // } else {
    //   errors3 = errors3.filter((error) => error !== "Answer must not be empty");
    // }

    // if (securityquestions[1].question === "") {
    //   errors2.push("Security question must not be empty");
    // } else {
    //   errors2 = errors2.filter(
    //     (error) => error !== "Security question must not be empty"
    //   );
    // }

    // if (securityquestions[1].answer === "") {
    //   errors4.push("Answer must not be empty");
    // } else {
    //   errors4 = errors4.filter((error) => error !== "Answer must not be empty");
    // }
    // setQuestionErrors1(errors1);
    // setQuestionErrors2(errors2);
    // setAnswerErrors1(errors3);
    // setAnswerErrors2(errors4);
    // try {
    //   if (questionErrors1.length !== 0) {
    //     return;
    //   }

    //   if (questionErrors2.length !== 0) {
    //     return;
    //   }

    //   if (answerErrors1.length !== 0) {
    //     return;
    //   }

    //   if (answerErrors2.length !== 0) {
    //     return;
    //   }
    //   try {
    //     sendOTP(username, mobilenumber);
    //     navigation.navigate("OTP", {
    //       username: username,
    //       password: password,
    //       resID: resID,
    //       securityquestions: securityquestions,
    //       navigatelink: "Login",
    //     });
    //   } catch (error) {
    //     const response = error.response;
    //     if (response && response.data) {
    //       console.log("❌ Error status:", response.status);
    //       alert(response.data.message || "Something went wrong.");
    //     } else {
    //       console.log("❌ Network or unknown error:", error.message);
    //       alert("An unexpected error occurred.");
    //     }
    //   }
    // } catch (error) {
    //   Alert.alert("Error", error.message);
    // }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#04384E" }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
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
              marginBottom: "-10",
            }}
          >
            <ScrollView
              style={{ width: "100%" }}
              contentContainerStyle={{
                padding: 30,
                alignItems: "center",
              }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={[MyStyles.header, { alignSelf: "flex-start" }]}>
                Create your Account
              </Text>

              <View style={{ marginVertical: 30, gap: 15, width: "100%" }}>
                <View>
                  <Text style={MyStyles.inputLabel}>
                    First Name<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    style={MyStyles.input}
                    placeholder="First name"
                    value={firstname}
                    onChangeText={firstnameValidation}
                  />
                  {fnameError ? (
                    <Text
                      style={{
                        color: "red",
                        fontFamily: "QuicksandMedium",
                        fontSize: 16,
                      }}
                    >
                      {fnameError}
                    </Text>
                  ) : null}
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>
                    Last Name<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    style={MyStyles.input}
                    placeholder="Last name"
                    value={lastname}
                    onChangeText={lastnameValidation}
                  />
                  {lnameError ? (
                    <Text
                      style={{
                        color: "red",
                        fontFamily: "QuicksandMedium",
                        fontSize: 16,
                      }}
                    >
                      {lnameError}
                    </Text>
                  ) : null}
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>
                    Mobile Number<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    style={MyStyles.input}
                    placeholder="Mobile Number"
                    value={mobilenumber}
                    onChangeText={setMobileNumber}
                  />
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>
                    Username<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <TextInput
                    style={MyStyles.input}
                    placeholder="Username"
                    value={username}
                    autoCapitalize="none"
                    onChangeText={usernameValidation}
                    onBlur={() => setUsername(username.toLowerCase())}
                  />
                  {usernameErrors.length > 0 && (
                    <View style={{ marginTop: 5, width: 300 }}>
                      {usernameErrors.map((error, index) => (
                        <Text
                          key={index}
                          style={{
                            color: "red",
                            fontFamily: "QuicksandMedium",
                            fontSize: 16,
                          }}
                        >
                          {error}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>
                    Password<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <View style={{ position: "relative" }}>
                    <TextInput
                      value={password}
                      onChangeText={passwordValidation}
                      secureTextEntry={secureNewPass}
                      placeholder="Password"
                      style={[MyStyles.input, { paddingRight: 40 }]}
                    />
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: [{ translateY: -12 }],
                      }}
                      onPress={togglesecureNewPass}
                    >
                      <Ionicons
                        name={secureNewPass ? "eye-off" : "eye"}
                        size={24}
                        color="gray"
                      />
                    </TouchableOpacity>
                  </View>

                  {passwordErrors.length > 0 && (
                    <View style={{ marginTop: 5, width: 300 }}>
                      {passwordErrors.map((error, index) => (
                        <Text
                          key={index}
                          style={{
                            color: "red",
                            fontFamily: "QuicksandMedium",
                            fontSize: 16,
                          }}
                        >
                          {error}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>
                    Confirm Password<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <View style={{ position: "relative" }}>
                    <TextInput
                      value={repassword}
                      onChangeText={repasswordValidation}
                      secureTextEntry={secureConfirmPass}
                      placeholder="Confirm New Password"
                      style={[MyStyles.input, { paddingRight: 40 }]}
                    />
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: [{ translateY: -12 }],
                      }}
                      onPress={togglesecureConfirmPass}
                    >
                      <Ionicons
                        name={secureConfirmPass ? "eye-off" : "eye"}
                        size={24}
                        color="gray"
                      />
                    </TouchableOpacity>
                  </View>
                  {repasswordErrors.length > 0 && (
                    <View style={{ marginTop: 5, width: 300 }}>
                      {repasswordErrors.map((error, index) => (
                        <Text
                          key={index}
                          style={{
                            color: "red",
                            fontFamily: "QuicksandMedium",
                            fontSize: 16,
                          }}
                        >
                          {error}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>

                <View style={{ flexDirection: "column" }}>
                  <Text
                    style={{
                      color: "#808080",
                      alignSelf: "flex-start",
                      fontSize: 16,
                      fontFamily: "QuicksandBold",
                    }}
                  >
                    By clicking Sign Up, you agree to eBarrio’s{" "}
                  </Text>
                  <Text
                    onPress={() => navigation.navigate("TermsConditions")}
                    style={{
                      color: "#006EFF",
                      alignSelf: "flex-start",
                      fontSize: 16,
                      fontFamily: "QuicksandBold",
                    }}
                  >
                    Terms and Conditions
                  </Text>
                </View>
              </View>

              <TouchableOpacity onPress={handleSignUp} style={MyStyles.button}>
                <Text style={MyStyles.buttonText}>Sign up</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: "row", gap: 4, marginTop: 10 }}>
                <Text
                  style={{
                    color: "#808080",
                    fontSize: 16,
                    fontFamily: "QuicksandSemiBold",
                  }}
                >
                  Already have an account?
                </Text>
                <Text
                  onPress={() => navigation.navigate("Login")}
                  style={{
                    color: "#006EFF",
                    fontSize: 16,
                    fontFamily: "QuicksandBold",
                  }}
                >
                  Login
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default Signup;
