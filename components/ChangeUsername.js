import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { TextInput } from "react-native-paper";

const ChangeUsername = () => {
  const { userDetails } = useContext(AuthContext);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
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
          Change Username
        </Text>
        <View>
          <View>
            <Text>Current Username</Text>
            <Text>{userDetails.username}</Text>
          </View>
          <View>
            <Text>New Username</Text>
            <TextInput placeholder="Enter new username" />
          </View>
          <View>
            <Text>Password</Text>
            <TextInput secureTextEntry={true} placeholder="Enter password" />
          </View>
          <TouchableOpacity>
            <Text>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangeUsername;
