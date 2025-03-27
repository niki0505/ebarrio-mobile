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

const Signup = () => {
  const uchange = useNavigation();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
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
      // //CHECKS IF THE FIRST NAME IS NOT EMPTY
      // if (fnameError !== null) {
      //   Alert.alert("Error", "Please enter your first name.");
      //   return;
      // }

      // //CHECKS IF THE LAST NAME IS NOT EMPTY
      // if (lnameError !== null) {
      //   Alert.alert("Error", "Please enter your last name.");
      //   return;
      // }

      //CHECKS IF THE USERNAME FORMAT IS VALID
      if (usernameErrors.length !== 0) {
        return;
      }
      //CHECKS IF THE PASSWORD FORMAT IS VALID
      if (passwordErrors.length !== 0) {
        return;
      }

      //CHECKS IF THE USER IS A REGISTERED RESIDENT OF THE BARANGAY
      const response = await fetch(
        "http://10.0.2.2:3000/api/auth/checkresident",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstname, lastname }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }
      console.log("🔍 Checking if resident exists...");

      if (!data.exists) {
        console.log(`❌ Resident not found, returning exists:${data.exists}`);
        Alert.alert(
          "Error",
          "Only registered resident of the Barangay Aniban 2 can sign up."
        );
        setUsername("");
        setPassword("");
        setFirstname("");
        setLastname("");
        return;
      } else {
        //IF THE USER IS REGISTERED RESIDENT
        console.log(`✅ Resident found, proceeding with user registration`);

        //CHECKS IF THE USERNAME IS ALREADY TAKEN
        const response = await fetch("http://10.0.2.2:3000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, resID: data.resID }),
        });
        const data2 = await response.json();
        if (!response.ok) {
          throw new Error(data2.message || "Something went wrong");
        }
        if (data2.usernameExists) {
          Alert.alert("Error", "Username is already taken");
          return;
        }

        Alert.alert("Success", "User registered successfully. Please log in.");
        setUsername("");
        setPassword("");
        setFirstname("");
        setLastname("");
        uchange.navigate("Login");
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
        <Text onPress={() => uchange.navigate("Login")}>Go to Login</Text>
      </View>
    </View>
  );
};
export default Signup;
