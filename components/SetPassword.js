import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { TextInput } from "react-native-paper";
import api from "../api";

const SetPassword = () => {
  const route = useRoute();
  const { username } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [securityquestions, setSecurityQuestions] = useState([
    { question: "", answer: "" },
    { question: "", answer: "" },
  ]);

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

  const handleSubmit = async () => {
    if (password !== repassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      await api.put(`/resetpassword/${username}`, {
        password,
        securityquestions,
      });
      alert("Password reset successfully!");
      navigation.navigate("Login");
    } catch (error) {
      console.log("Failed to reset password", error);
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
        <Text style={[MyStyles.header, { marginBottom: 0 }]}>Set Password</Text>
        <View>
          <View>
            <Text>Password</Text>
            <TextInput
              onChangeText={setPassword}
              secureTextEntry={true}
              placeholder="Enter password"
            />
          </View>

          <View>
            <Text>Confirm Password</Text>
            <TextInput
              onChangeText={setRePassword}
              secureTextEntry={true}
              placeholder="Enter password"
            />
          </View>

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
          <TouchableOpacity onPress={handleSubmit}>
            <Text>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SetPassword;
