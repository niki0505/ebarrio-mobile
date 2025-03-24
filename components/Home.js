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

const Home = () => {
  const accID = useAuthStore((state) => state.accID);
  const uchange = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const logout = () => {
    useAuthStore.getState().logout();
    uchange.navigate("Login");
  };

  return (
    <View style={MyStyles.container}>
      <Text>Welcome to Home {accID}</Text>
      <Text onPress={logout}>Logout</Text>
    </View>
  );
};
export default Home;
