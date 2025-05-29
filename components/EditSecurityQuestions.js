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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";
import { Dropdown } from "react-native-element-dropdown";
import { useContext, useEffect, useState } from "react";
import { InfoContext } from "../context/InfoContext";
import api from "../api";

//ICONS
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";

const EditSecurityQuestions = () => {
  const { fetchUserDetails, userDetails } = useContext(InfoContext);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [securityquestions, setSecurityQuestions] = useState([
    { question: "", answer: "" },
    { question: "", answer: "" },
  ]);
  const [securePass, setsecurePass] = useState(true);

  const togglesecurePass = () => {
    setsecurePass(!securePass);
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handlePassChange = (input) => {
    if (input.length === 0) {
      setPassError("This field is empty.");
    } else {
      setPassError("");
    }
    setPassword(input);
  };

  useEffect(() => {
    if (
      userDetails &&
      Array.isArray(userDetails.securityquestions) &&
      userDetails.securityquestions.length >= 2
    ) {
      setSecurityQuestions([
        {
          question: userDetails.securityquestions[0]?.question || "",
          answer: "",
        },
        {
          question: userDetails.securityquestions[1]?.question || "",
          answer: "",
        },
      ]);
    }
  }, [userDetails]);

  const securityQuestionsList = [
    "What was the name of your first pet?",
    "What is your mother's maiden name?",
    "What was the name of your first school?",
  ];

  const handleSecurityChange = (index, field, value) => {
    const updated = [...securityquestions];
    updated[index][field] = value;
    setSecurityQuestions(updated);
  };

  let modifiedQuestions;

  const handleConfirm = () => {
    let hasErrors = false;

    if (!password) {
      setPassError("This field is required.");
      hasErrors = true;
    } else {
      setPassError("");
      modifiedQuestions = securityquestions.map((q, index) => {
        const current = userDetails.securityquestions?.[index];
        const isSameQuestion = current?.question === q.question;
        const hasNewAnswer = q.answer?.trim() !== "";

        if (!isSameQuestion && hasNewAnswer) {
          return q;
        } else if (isSameQuestion && hasNewAnswer) {
          return { question: q.question, answer: q.answer };
        } else {
          return null;
        }
      });

      const hasChanges = modifiedQuestions.some((q) => q !== null);

      if (!hasChanges) {
        alert("No changes detected in your security questions.");
        hasErrors = true;
      }
    }

    if (hasErrors) {
      return;
    }

    Alert.alert(
      "Confirm",
      "Are you sure you want to change your security questions?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            handleQuestionsChange();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleQuestionsChange = async () => {
    try {
      await api.put("/changesecurityquestions", {
        securityquestions: modifiedQuestions,
        password,
      });
      alert("Your security questions have been updated successfully.");
      fetchUserDetails();
      setSecurityQuestions((prev) =>
        prev.map((item) => ({
          ...item,
          answer: "",
        }))
      );
      setPassword("");
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
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
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
          <Text style={[MyStyles.header, { marginTop: 20 }]}>
            Edit Security Questions
          </Text>
          <View style={{ gap: 15, marginVertical: 30 }}>
            <View>
              <Text style={MyStyles.inputLabel}>Security Question #1</Text>
              <Dropdown
                labelField="label"
                valueField="value"
                value={securityquestions[0].question}
                data={securityQuestionsList
                  .filter((ques) => ques !== securityquestions[1].question)
                  .map((ques) => ({
                    label: ques,
                    value: ques,
                  }))}
                placeholder="Select"
                placeholderStyle={{
                  color: "#808080",
                  fontFamily: "QuicksandMedium",
                  fontSize: 16,
                }}
                selectedTextStyle={{
                  color: "#000",
                  fontFamily: "QuicksandMedium",
                  fontSize: 16,
                }}
                onChange={(item) =>
                  handleSecurityChange(0, "question", item.value)
                }
                style={MyStyles.input}
              ></Dropdown>
            </View>
            <View>
              <Text style={MyStyles.inputLabel}>Answer</Text>
              <TextInput
                value={securityquestions[0].answer}
                onChangeText={(e) => handleSecurityChange(0, "answer", e)}
                secureTextEntry={true}
                placeholder="Enter answer"
                style={MyStyles.input}
              />
            </View>
            <View>
              <Text style={MyStyles.inputLabel}>Security Question #2</Text>
              <Dropdown
                labelField="label"
                valueField="value"
                value={securityquestions[1].question}
                data={securityQuestionsList
                  .filter((ques) => ques !== securityquestions[0].question)
                  .map((ques) => ({
                    label: ques,
                    value: ques,
                  }))}
                placeholder="Select"
                placeholderStyle={{
                  color: "#808080",
                  fontFamily: "QuicksandMedium",
                  fontSize: 16,
                }}
                selectedTextStyle={{
                  color: "#000",
                  fontFamily: "QuicksandMedium",
                  fontSize: 16,
                }}
                onChange={(item) =>
                  handleSecurityChange(1, "question", item.value)
                }
                style={MyStyles.input}
              ></Dropdown>
            </View>
            <View>
              <Text style={MyStyles.inputLabel}>Answer</Text>
              <TextInput
                value={securityquestions[1].answer}
                onChangeText={(e) => handleSecurityChange(1, "answer", e)}
                secureTextEntry={true}
                placeholder="Enter answer"
                style={MyStyles.input}
              />
            </View>

            <View>
              <Text style={MyStyles.inputLabel}>Password</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  onChangeText={handlePassChange}
                  value={password}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditSecurityQuestions;
