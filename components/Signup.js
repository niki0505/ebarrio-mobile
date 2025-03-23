import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useState } from "react";

const Signup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      // const checkResident = await fetch(
      //   "https://ebarrio-mobile-backend.onrender.com/api/auth/checkresident",
      //   {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ firstname, lastname }),
      //   }
      // );

      // const checkData = await checkResident.json();

      // if (!checkData.exists) {
      //   Alert.alert(
      //     "Error",
      //     "Only registered resident of the Barangay Aniban 2 can sign up."
      //   );
      //   setUsername("");
      //   setPassword("");
      //   setFirstname("");
      //   setLastname("");
      //   return;
      // }

      // const resID = checkData.resID;

      const response = await fetch(
        "https://ebarrio-mobile-backend.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, resID }),
        }
      );

      const data = await response.json();

      if (!data.exists) {
        Alert.alert(
          "Error",
          "Only registered resident of the Barangay Aniban 2 can sign up."
        );
        setUsername("");
        setPassword("");
        setFirstname("");
        setLastname("");
        return;
      }

      Alert.alert("Success", "User registered successfully. Please log in.");
      setUsername("");
      setPassword("");
      setFirstname("");
      setLastname("");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <View style={MyStyles.container}>
      <View style={{ flexDirection: "column", gap: 10 }}>
        <TextInput
          style={MyStyles.textfield}
          placeholder="Enter first name here"
          value={firstname}
          onChangeText={setFirstname}
        />
        <TextInput
          style={MyStyles.textfield}
          placeholder="Enter last name here"
          value={lastname}
          onChangeText={setLastname}
        />
        <TextInput
          style={MyStyles.textfield}
          placeholder="Enter username here"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={MyStyles.textfield}
          placeholder="Enter password here"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={handleSignUp} style={MyStyles.btn}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Signup;
