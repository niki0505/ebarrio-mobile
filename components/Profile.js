import {
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const insets = useSafeAreaInsets();
  const { userDetails } = useContext(AuthContext);
  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }}
    >
      <View style={MyStyles.container}>
        <Text style={[MyStyles.header, { marginTop: 20, marginBottom: 30 }]}>
          Profile
        </Text>
        <Text>
          First Name:
          {userDetails.resID?.firstname || userDetails.empID?.resID.firstname}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
