import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import api from "../api";
import AppLogo from "../assets/applogo-darkbg.png";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";

//ICONS
import { MaterialIcons } from "@expo/vector-icons";

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
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#04384E" }}
    >
      <BackgroundOverlay />
      {/* Card container with transparency */}
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2,
          marginTop: 20,
        }}
      >
        <View
          style={{
            width: "80%",
            height: "80%",
            backgroundColor: "#fff",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          <ScrollView
            contentContainerStyle={{
              padding: 30,
              alignItems: "center",
            }}
            showsVerticalScrollIndicator={true}
          >
            {/* Back arrow and heading */}
            <MaterialIcons
              name="arrow-back-ios"
              size={30}
              color="#04384E"
              style={{ alignSelf: "flex-start" }}
            />
            <Text
              style={{
                fontSize: 24,
                color: "#04384E",
                fontWeight: "bold",
                alignSelf: "flex-start",
                marginTop: 10,
              }}
            >
              Set Password
            </Text>

            {/* Form fields */}
            <View
              style={{
                alignSelf: "flex-start",
                width: "100%",
                marginVertical: 30,
                gap: 10,
              }}
            >
              <View>
                <Text>Password</Text>
                <TextInput
                  onChangeText={setPassword}
                  secureTextEntry={true}
                  placeholder="Enter password"
                  style={MyStyles.input}
                />
              </View>

              <View>
                <Text>Confirm Password</Text>
                <TextInput
                  onChangeText={setRePassword}
                  secureTextEntry={true}
                  placeholder="Enter password"
                  style={MyStyles.input}
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
              </View>

              <View>
                <Text>Answer</Text>
                <TextInput
                  onChangeText={(e) => handleSecurityChange(0, "answer", e)}
                  secureTextEntry={true}
                  placeholder="Enter answer"
                  style={MyStyles.input}
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
              </View>

              <View>
                <Text>Answer</Text>
                <TextInput
                  onChangeText={(e) => handleSecurityChange(1, "answer", e)}
                  secureTextEntry={true}
                  placeholder="Enter answer"
                  style={MyStyles.input}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              style={[MyStyles.button, { marginTop: 30 }]}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 24,
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SetPassword;
