import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useEffect } from "react";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Announcement = () => {
  const insets = useSafeAreaInsets();
  const { accessToken, refreshAccessToken, logout } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View
        style={[
          MyStyles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <Text>Welcome to Announcement</Text>
      </View>
    </KeyboardAvoidingView>
  );
};
export default Announcement;
