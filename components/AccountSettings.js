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
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#04384E" }}>
            Account
          </Text>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: "#C1C0C0",
            width: "100%",
            marginVertical: 10,
          }}
        />
        <View style={{ gap: 5 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#C1C0C0", fontSize: 18, fontWeight: "500" }}>
              Profile
            </Text>
            <MaterialIcons name="navigate-next" size={24} color="#C1C0C0" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#C1C0C0", fontSize: 18, fontWeight: "500" }}>
              Change Username
            </Text>
            <MaterialIcons name="navigate-next" size={24} color="#C1C0C0" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#C1C0C0", fontSize: 18, fontWeight: "500" }}>
              Change Password
            </Text>
            <MaterialIcons name="navigate-next" size={24} color="#C1C0C0" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#C1C0C0", fontSize: 18, fontWeight: "500" }}>
              Edit Security Questions
            </Text>
            <MaterialIcons name="navigate-next" size={24} color="#C1C0C0" />
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
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#04384E" }}>
            Notifications
          </Text>
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: "#C1C0C0",
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
          <Text style={{ color: "#C1C0C0", fontSize: 18, fontWeight: "500" }}>
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
          <Text style={{ color: "#C1C0C0", fontSize: 18, fontWeight: "500" }}>
            App Notifications
          </Text>
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
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#04384E" }}>
            More
          </Text>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: "#C1C0C0",
            width: "100%",
            marginVertical: 10,
          }}
        />
        <View style={{ gap: 5 }}>
          <TouchableOpacity
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#C1C0C0", fontSize: 18, fontWeight: "500" }}>
              About eBarrio App
            </Text>
            <MaterialIcons name="navigate-next" size={24} color="#C1C0C0" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#C1C0C0", fontSize: 18, fontWeight: "500" }}>
              Help
            </Text>
            <MaterialIcons name="navigate-next" size={24} color="#C1C0C0" />
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
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#04384E" }}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountSettings;
