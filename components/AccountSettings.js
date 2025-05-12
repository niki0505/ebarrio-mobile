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

const AccountSettings = () => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }}
    >
      <View style={MyStyles.container}>
        <Text style={[MyStyles.header, { marginTop: 20, marginBottom: 30 }]}>
          Account Settings
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AccountSettings;
