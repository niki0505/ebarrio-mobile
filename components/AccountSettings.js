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
  Switch,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

//ICONS
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";

const AccountSettings = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [pushNotifEnabled, setPushNotifEnabled] = useState(false);
  const [appNotifEnabled, setAppNotifEnabled] = useState(false);

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
          onPress={() => navigation.navigate("BottomTabs")}
          name="arrow-back-ios"
          size={24}
          color="#04384E"
        />
        <Text style={[MyStyles.header, { marginTop: 10 }]}>Settings</Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 20,
          }}
        >
          <FontAwesome5 name="user-circle" size={24} color="#04384E" />
          <Text style={{ fontSize: 18, color: "#04384E" }}>Account</Text>
        </View>
        <View
          style={{
            height: 1,
            backgroundcolor: "gray",
            width: "100%",
            marginVertical: 10,
          }}
        />
        <View style={{ gap: 5 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "gray", fontSize: 18 }}>Profile</Text>
            <MaterialIcons name="navigate-next" size={24} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ChangeUsername")}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "gray", fontSize: 18 }}>Change Username</Text>
            <MaterialIcons name="navigate-next" size={24} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ChangePassword")}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "gray", fontSize: 18 }}>Change Password</Text>
            <MaterialIcons name="navigate-next" size={24} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("EditSecurityQuestions")}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "gray", fontSize: 18 }}>
              Edit Security Questions
            </Text>
            <MaterialIcons name="navigate-next" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 30,
          }}
        >
          <Ionicons name="notifications-outline" size={24} color="#04384E" />
          <Text style={{ fontSize: 18, color: "#04384E" }}>Notifications</Text>
        </View>

        <View
          style={{
            height: 1,
            backgroundcolor: "gray",
            width: "100%",
            marginVertical: 10,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "-10",
          }}
        >
          <Text style={{ color: "gray", fontSize: 18 }}>
            Push Notifications
          </Text>
          <Switch
            value={pushNotifEnabled}
            onValueChange={setPushNotifEnabled}
            trackColor={{ false: "#ccc", true: "#04384E" }}
            thumbColor={pushNotifEnabled ? "#ffffff" : "#f4f3f4"}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "-15",
          }}
        >
          <Text style={{ color: "gray", fontSize: 18 }}>App Notifications</Text>
          <Switch
            value={appNotifEnabled}
            onValueChange={setAppNotifEnabled}
            trackColor={{ false: "#ccc", true: "#04384E" }}
            thumbColor={appNotifEnabled ? "#ffffff" : "#f4f3f4"}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 30,
          }}
        >
          <MaterialIcons name="more-horiz" size={24} color="#04384E" />
          <Text style={{ fontSize: 18, color: "#04384E" }}>More</Text>
        </View>
        <View
          style={{
            height: 1,
            backgroundcolor: "gray",
            width: "100%",
            marginVertical: 10,
          }}
        />
        <View style={{ gap: 5 }}>
          <TouchableOpacity
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "gray", fontSize: 18 }}>
              About eBarrio App
            </Text>
            <MaterialIcons name="navigate-next" size={24} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "gray", fontSize: 18 }}>Help</Text>
            <MaterialIcons name="navigate-next" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 30,
          }}
        >
          <MaterialIcons name="logout" size={24} color="#04384E" />
          <Text style={{ fontSize: 18, color: "#04384E" }}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountSettings;
