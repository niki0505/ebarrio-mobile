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
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { InfoContext } from "../context/InfoContext";
import LoadingScreen from "./LoadingScreen";

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
  const { userDetails, fetchUserDetails } = useContext(InfoContext);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (!userDetails) {
    return <LoadingScreen />;
  }

  const pictureUri =
    userDetails.resID?.picture || userDetails.empID?.resID?.picture;

  const firstName =
    userDetails.resID?.firstname || userDetails.empID?.resID?.firstname;

  const lastName =
    userDetails.resID?.lastname || userDetails.empID?.resID?.lastname;

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

        <Text style={[MyStyles.header, { marginTop: 20 }]}>
          Account Settings
        </Text>

        {/* <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri: pictureUri,
            }}
            onLoad={() => setImageLoaded(true)}
            style={[
              MyStyles.profilePic,
              { width: 150, height: 150, borderRadius: 75 },
            ]}
          />
          <Text
            style={{
              fontSize: 20,
              color: "#04384E",
              fontFamily: "REMSemiBold",
            }}
          >
            {`${firstName} ${lastName}`}
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#808080",
              fontFamily: "QuicksandBold",
            }}
          >
            {userDetails.username}
          </Text>
        </View> */}

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
            onPress={() => navigation.navigate("EditMobileNumber")}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountSettings;
