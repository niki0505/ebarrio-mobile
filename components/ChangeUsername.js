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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useEffect, useState } from "react";
import { InfoContext } from "../context/InfoContext";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

//ICONS
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";

const ChangeUsername = () => {
  const { fetchUserDetails, userDetails } = useContext(InfoContext);
  const [username, setUsername] = useState("");
  const [usernameErrors, setUsernameErrors] = useState([]);
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [securePass, setsecurePass] = useState(true);
  const [loading, setLoading] = useState(false);

  // Toggle Password Visibility in Reset Password
  const togglesecurePass = () => {
    setsecurePass(!securePass);
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const usernameValidation = (val) => {
    let errors = [];
    let formattedVal = val.replace(/\s+/g, "");
    setUsername(formattedVal);

    if (!formattedVal) {
      errors.push("Username must not be empty.");
    }
    if (
      (formattedVal && formattedVal.length < 3) ||
      (formattedVal && formattedVal.length > 16)
    ) {
      errors.push("Username must be between 3 and 16 characters only.");
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
      errors.push("Username must not start or end with an underscore.");
    }

    setUsernameErrors(errors);
  };

  const handleConfirm = async () => {
    let hasErrors = false;

    if (!username) {
      usernameValidation(username);
      hasErrors = true;
    }

    if (username === userDetails.username) {
      alert("The new username must be different from the current username.");
      hasErrors = true;
    }

    if (!password) {
      setPassError("This field is required.");
      hasErrors = true;
    } else {
      setPassError("");
    }

    if (usernameErrors.length !== 0) {
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    Alert.alert(
      "Confirm",
      "Are you sure you want to change your username?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            handleUsernameChange();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleUsernameChange = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await api.get(`/checkusername/${username}`);
      try {
        await api.put("/changeusername", { username, password });
        alert("Username changed successfully!");
        setUsername("");
        setPassword("");
        fetchUserDetails();
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
    } finally {
      setLoading(false);
    }
  };

  const handlePassChange = (input) => {
    if (input.length === 0) {
      setPassError("This field is empty.");
    } else {
      setPassError("");
    }
    setPassword(input);
  };

  const maskUsername = (uname) => {
    if (!uname) return "";
    if (uname.length <= 2) return uname[0] + "*";

    const firstChar = uname[0];
    const lastChar = uname[uname.length - 1];
    const maskedLength = uname.length - 2;
    const masked = "*".repeat(maskedLength);
    return `${firstChar}${masked}${lastChar}`;
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: "#DCE5EB",
      }}
    >
      <ScrollView
        contentContainerStyle={[
          MyStyles.scrollContainer,
          {
            gap: 10,
          },
        ]}
      >
        <MaterialIcons
          onPress={() => navigation.navigate("AccountSettings")}
          name="arrow-back-ios"
          size={24}
          color="#04384E"
        />
        <Text style={MyStyles.servicesHeader}>Change Username</Text>

        <View style={MyStyles.servicesContentWrapper}>
          <View>
            <Text style={MyStyles.inputLabel}>Current Username</Text>
            <Text style={MyStyles.inputLabel}>
              {maskUsername(userDetails?.username)}
            </Text>
          </View>
          <View>
            <Text style={MyStyles.inputLabel}>New Username</Text>
            <TextInput
              onChangeText={usernameValidation}
              placeholder="New Username"
              style={MyStyles.input}
              value={username}
            />
            {usernameErrors.length > 0 && (
              <View style={{ marginTop: 5, width: 300 }}>
                {usernameErrors.map((error, index) => (
                  <Text key={index} style={MyStyles.errorMsg}>
                    {error}
                  </Text>
                ))}
              </View>
            )}
          </View>

          <View>
            <Text style={MyStyles.inputLabel}>Password</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                onChangeText={handlePassChange}
                secureTextEntry={securePass}
                value={password}
                placeholder="Password"
                style={[MyStyles.input, { paddingRight: 40 }]}
              />
              <TouchableOpacity
                style={MyStyles.eyeToggle}
                onPress={togglesecurePass}
              >
                <Ionicons
                  name={securePass ? "eye-off" : "eye"}
                  size={24}
                  color="gray"
                />
              </TouchableOpacity>
              {passError ? (
                <Text style={MyStyles.errorMsg}>{passError}</Text>
              ) : null}
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleConfirm}
          style={MyStyles.button}
          disabled={loading}
        >
          <Text style={MyStyles.buttonText}>
            {loading ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangeUsername;
