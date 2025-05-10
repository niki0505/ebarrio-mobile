import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
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
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#fff" }} // para hindi nago-overlap sa status bar when scrolled
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            MyStyles.scrollContainer,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom + 70,
              gap: 10,
            },
          ]}
        >
          <Text>Welcome to Announcement</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default Announcement;
