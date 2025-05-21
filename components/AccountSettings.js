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
  Image,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { InfoContext } from "../context/InfoContext";

//ICONS
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const AccountSettings = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [pushNotifEnabled, setPushNotifEnabled] = useState(false);
  const [appNotifEnabled, setAppNotifEnabled] = useState(false);
  const { user } = useContext(AuthContext);

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

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri: user.picture,
            }}
            style={[
              MyStyles.profilePic,
              { width: 60, height: 60, borderRadius: 40 },
            ]}
          />
          <Text
            style={{
              fontSize: 20,
              color: "#04384E",
              fontFamily: "REMSemiBold",
            }}
          >
            Knicole N. Bataclan
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#808080",
              fontFamily: "QuicksandBold",
            }}
          >
            Niki
          </Text>
        </View>

        <View style={{ gap: 20, marginTop: 20 }}>
          <Text
            style={{
              fontSize: 16,
              color: "#808080",
              fontFamily: "QuicksandBold",
            }}
          >
            Security
          </Text>

          <TouchableOpacity
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AntDesign
                name="mobile1"
                size={20}
                color="#808080"
                style={{
                  backgroundColor: "#E5E4E2B3",
                  borderRadius: 10,
                  padding: 5,
                }}
              />
              <Text
                style={{
                  color: "#04384E",
                  fontSize: 16,
                  fontFamily: "QuicksandBold",
                  marginLeft: 15,
                }}
              >
                Mobile Number
              </Text>
            </View>

            <MaterialIcons name="navigate-next" size={24} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ChangeUsername")}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FontAwesome5
                name="user"
                size={20}
                color="#808080"
                style={{
                  backgroundColor: "#E5E4E2B3",
                  borderRadius: 10,
                  padding: 5,
                }}
              />
              <Text
                style={{
                  color: "#04384E",
                  fontSize: 16,
                  fontFamily: "QuicksandBold",
                  marginLeft: 15,
                }}
              >
                Username
              </Text>
            </View>

            <MaterialIcons name="navigate-next" size={24} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ChangePassword")}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialIcons
                name="password"
                size={20}
                color="#808080"
                style={{
                  backgroundColor: "#E5E4E2B3",
                  borderRadius: 10,
                  padding: 5,
                }}
              />
              <Text
                style={{
                  color: "#04384E",
                  fontSize: 16,
                  fontFamily: "QuicksandBold",
                  marginLeft: 15,
                }}
              >
                Password
              </Text>
            </View>

            <MaterialIcons name="navigate-next" size={24} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("EditSecurityQuestions")}
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="comment-question-outline"
                size={20}
                color="#808080"
                style={{
                  backgroundColor: "#E5E4E2B3",
                  borderRadius: 10,
                  padding: 5,
                }}
              />
              <Text
                style={{
                  color: "#04384E",
                  fontSize: 16,
                  fontFamily: "QuicksandBold",
                  marginLeft: 15,
                }}
              >
                Security Questions
              </Text>
            </View>

            <MaterialIcons name="navigate-next" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 30 }}>
          <Text
            style={{
              fontSize: 16,
              color: "#808080",
              fontFamily: "QuicksandBold",
            }}
          >
            Preferences
          </Text>

          <View style={{ gap: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="#808080"
                  style={{
                    backgroundColor: "#E5E4E2B3",
                    borderRadius: 10,
                    padding: 5,
                  }}
                />

                <Text
                  style={{
                    color: "#04384E",
                    fontSize: 16,
                    fontFamily: "QuicksandBold",
                    marginLeft: 15,
                  }}
                >
                  Notification
                </Text>
              </View>

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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="location-outline"
                  size={20}
                  color="#808080"
                  style={{
                    backgroundColor: "#E5E4E2B3",
                    borderRadius: 10,
                    padding: 5,
                  }}
                />
                <Text
                  style={{
                    color: "#04384E",
                    fontSize: 16,
                    fontFamily: "QuicksandBold",
                    marginLeft: 15,
                  }}
                >
                  Location
                </Text>
              </View>
              <Switch
                value={appNotifEnabled}
                onValueChange={setAppNotifEnabled}
                trackColor={{ false: "#ccc", true: "#04384E" }}
                thumbColor={appNotifEnabled ? "#ffffff" : "#f4f3f4"}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountSettings;
