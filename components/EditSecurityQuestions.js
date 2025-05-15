import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { useContext, useEffect, useState } from "react";
import { TextInput } from "react-native-paper";
import { InfoContext } from "../context/InfoContext";
import api from "../api";

const EditSecurityQuestions = () => {
  const { fetchUserDetails, userDetails } = useContext(InfoContext);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState("");
  const [securityquestions, setSecurityQuestions] = useState([
    { question: "", answer: "" },
    { question: "", answer: "" },
  ]);

  useEffect(() => {
    fetchUserDetails();
  }, []);

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

  const handleQuestionsChange = async () => {
    const modifiedQuestions = securityquestions.map((q, index) => {
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
      return;
    }
    console.log(modifiedQuestions);
    try {
      await api.put("/changesecurityquestions", {
        securityquestions: modifiedQuestions,
        password,
      });
      alert("Security questions successfully changed!");
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
          Edit Security Questions
        </Text>
        <View>
          <View>
            <Text>Security Question #1</Text>
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
              placeholderStyle={{ color: "gray" }}
              onChange={(item) =>
                handleSecurityChange(0, "question", item.value)
              }
              style={MyStyles.input}
            ></Dropdown>
            <Text>Answer</Text>
            <TextInput
              onChangeText={(e) => handleSecurityChange(0, "answer", e)}
              secureTextEntry={true}
              placeholder="Enter answer"
            />
          </View>
          <View>
            <Text>Security Question #2</Text>
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
              placeholderStyle={{ color: "gray" }}
              onChange={(item) =>
                handleSecurityChange(1, "question", item.value)
              }
              style={MyStyles.input}
            ></Dropdown>
            <Text>Answer</Text>
            <TextInput
              onChangeText={(e) => handleSecurityChange(1, "answer", e)}
              secureTextEntry={true}
              placeholder="Enter answer"
            />
          </View>
          <View>
            <Text>Password</Text>
            <TextInput
              onChangeText={(e) => setPassword(e)}
              secureTextEntry={true}
              placeholder="Enter password"
            />
          </View>
          <TouchableOpacity onPress={handleQuestionsChange}>
            <Text>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditSecurityQuestions;
