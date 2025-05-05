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
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useContext } from "react";
import { OtpContext } from "../context/OtpContext";
import axios from "axios";

const Signup = () => {
  const navigation = useNavigation();
  const { startOtp } = useContext(OtpContext);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [mobilenumber, setMobileNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fnameError, setFnameError] = useState(null);
  const [lnameError, setLnameError] = useState(null);
  const [usernameErrors, setUsernameErrors] = useState([]);
  const [passwordErrors, setPasswordErrors] = useState([]);

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
    if (!firstname || !lastname || !username || !password) {
      firstnameValidation(firstname);
      lastnameValidation(lastname);
      usernameValidation(username);
      passwordValidation(password);
      return;
    }
    try {
      //CHECKS IF THE USERNAME FORMAT IS VALID
      if (usernameErrors.length !== 0) {
        return;
      }
      //CHECKS IF THE PASSWORD FORMAT IS VALID
      if (passwordErrors.length !== 0) {
        return;
      }

      //CHECKS IF THE USER IS A REGISTERED RESIDENT OF THE BARANGAY
      const res = await axios.post("http://10.0.2.2:4000/api/checkresident", {
        firstname,
        lastname,
        mobilenumber,
      });
      console.log(res.data);
      if (!res.data.exists) {
        console.log(`❌ Resident not found`);
        Alert.alert(
          "Error",
          "Only registered resident of the Barangay Aniban 2 can sign up."
        );
        setUsername("");
        setPassword("");
        setFirstname("");
        setLastname("");
        setMobileNumber("");
        return;
      } else if (res.data.hasAccount && res.data.exists) {
        console.log(`❌ Resident already have an account`);
        Alert.alert("Error", "Resident already have an account");
        setUsername("");
        setPassword("");
        setFirstname("");
        setLastname("");
        setMobileNumber("");
        return;
      } else if (!res.data.hasAccount && res.data.exists) {
        //IF THE USER IS REGISTERED RESIDENT
        console.log(`✅ Resident found, proceeding with user registration`);

        //CHECKS IF THE USERNAME IS ALREADY TAKEN
        const res2 = await axios.post(
          "http://10.0.2.2:4000/api/checkusername",
          {
            username,
          }
        );
        if (res2.data.usernameExists) {
          Alert.alert("Error", "Username is already taken");
          return;
        }

        console.log(` Sending OTP...`);

        //SENDS OTP
        try {
          const res3 = await axios.post("http://10.0.2.2:4000/api/otp", {
            mobilenumber,
          });
          setUsername("");
          setPassword("");
          setFirstname("");
          setLastname("");
          setMobileNumber("");
          startOtp(res3.data.otp, 300);
          navigation.navigate("OTP", {
            resID: res.data.resID,
            mobilenumber: mobilenumber,
            username: username,
            password: password,
          });
        } catch (error) {
          console.error("Error sending OTP:", error);
          Alert.alert("Error", "Something went wrong while sending OTP");
        }
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <View style={MyStyles.container}>
      <View style={{ flexDirection: "column", gap: 10 }}>
        <View style={{ width: 300 }}>
          <TextInput
            style={MyStyles.textfield}
            placeholder="Enter first name here"
            value={firstname}
            onChangeText={firstnameValidation}
          />
          {fnameError ? (
            <Text style={{ color: "red" }}>{fnameError}</Text>
          ) : null}
        </View>

        <View>
          <TextInput
            style={MyStyles.textfield}
            placeholder="Enter last name here"
            value={lastname}
            onChangeText={lastnameValidation}
          />
          {lnameError ? (
            <Text style={{ color: "red" }}>{lnameError}</Text>
          ) : null}
        </View>

        <View>
          <TextInput
            style={MyStyles.textfield}
            placeholder="Enter mobile number here"
            value={mobilenumber}
            onChangeText={setMobileNumber}
          />
        </View>
        <View>
          <TextInput
            style={MyStyles.textfield}
            placeholder="Enter username here"
            value={username}
            autoCapitalize="none"
            onChangeText={usernameValidation}
            onBlur={() => setUsername(username.toLowerCase())}
          />
          {usernameErrors.length > 0 && (
            <View style={{ marginTop: 5, width: 300 }}>
              {usernameErrors.map((error, index) => (
                <Text key={index} style={{ color: "red" }}>
                  {error}
                </Text>
              ))}
            </View>
          )}
        </View>
        <View>
          <TextInput
            style={MyStyles.textfield}
            placeholder="Enter password here"
            secureTextEntry={true}
            value={password}
            onChangeText={passwordValidation}
          />
          <Text style={{ fontSize: 12, color: "gray", marginTop: 5 }}>
            Note: Password is case-sensitive
          </Text>
          {passwordErrors.length > 0 && (
            <View style={{ marginTop: 5, width: 300 }}>
              {passwordErrors.map((error, index) => (
                <Text key={index} style={{ color: "red" }}>
                  {error}
                </Text>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity onPress={handleSignUp} style={MyStyles.btn}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
            Sign Up
          </Text>
        </TouchableOpacity>
        <Text onPress={() => navigation.navigate("Login")}>Go to Login</Text>
      </View>
    </View>
  );
};
export default Signup;
