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
import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import { TextInput } from "react-native-paper";

const EditSecurityQuestions = () => {
  const { userDetails } = useContext(AuthContext);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState("");
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
            <TextInput secureTextEntry={true} placeholder="Enter answer" />
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
            <TextInput secureTextEntry={true} placeholder="Enter answer" />
          </View>
          <View>
            <Text>Password</Text>
            <TextInput secureTextEntry={true} placeholder="Enter password" />
          </View>
          <TouchableOpacity>
            <Text>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditSecurityQuestions;
