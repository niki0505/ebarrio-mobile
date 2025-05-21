import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Touchable,
  TouchableOpacity,
  TextInput,
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

const EditMobileNumber = () => {
  const { fetchUserDetails, userDetails } = useContext(InfoContext);
  const [mobilenumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [securePass, setsecurePass] = useState(true);

  const mobnum =
    userDetails.resID?.mobilenumber || userDetails.empID?.resID?.mobilenumber;

  const togglesecurePass = () => {
    setsecurePass(!securePass);
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleMobileNumberChange = async () => {
    if (mobilenumber === mobnum) {
      alert("The new mobile number must be different from the current one.");
      return;
    }
    try {
      // await api.get(`/checkusername/${username}`);

      await api.put("/changemobilenumber", { mobilenumber, password });
      alert("Mobile number changed successfully!");
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
          Edit Mobile Number
        </Text>

        <View style={{ gap: 10, marginVertical: 30 }}>
          <View>
            <Text style={MyStyles.inputLabel}>Current Mobile Number</Text>
            <Text
              style={{
                fontSize: 16,
                color: "black",
                fontFamily: "QuicksandSemiBold",
              }}
            >
              {mobnum}
            </Text>
          </View>
          <View>
            <Text style={MyStyles.inputLabel}>New Mobile Number</Text>
            <TextInput
              onChangeText={setMobileNumber}
              placeholder="Enter new mobile number"
              style={MyStyles.input}
            />
          </View>

          <View>
            <Text style={MyStyles.inputLabel}>Password</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                onChangeText={(e) => setPassword(e)}
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
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleMobileNumberChange}
          style={MyStyles.button}
        >
          <Text style={MyStyles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditMobileNumber;
