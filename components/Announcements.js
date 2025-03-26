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
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

const Announcements = () => {
  const accID = useAuthStore((state) => state.accID);
  const navigation = useNavigation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //AUTO LOG OUT IF THE ACCESS TOKEN EXPIRES
  useEffect(() => {
    if (!accessToken) {
      navigation.navigate("Login");
    }
  }, [accessToken]);
  const logout = (navigation) => {
    useAuthStore.getState().logout(navigation);
  };

  return (
    <View style={MyStyles.container}>
      <Text>Announcements {accID}</Text>
      <Text onPress={() => navigation.navigate("Home")}>Home</Text>
    </View>
  );
};
export default Announcements;
