import "react-native-gesture-handler";
import Svg, { Path } from "react-native-svg";
import React, { useContext, useEffect, useState } from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { InfoProvider } from "./context/InfoContext";
import { OtpProvider } from "./context/OtpContext";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MyStyles } from "./components/stylesheet/MyStyles";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Preview from "./components/Preview";
import * as SecureStore from "expo-secure-store";
import { useFonts } from "expo-font";
import NetInfo from "@react-native-community/netinfo";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { InfoContext } from "./context/InfoContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

//Screens
import Login from "./components/Login";
import Signup from "./components/Signup";
import OTP from "./components/OTP";
import Home from "./components/Home";
import Announcement from "./components/Announcement";
import Certificates from "./components/Certificates";
import CourtReservations from "./components/CourtReservations";
import EmergencyHotlines from "./components/EmergencyHotlines";
import Status from "./components/Status";
import Blotter from "./components/Blotter";
import Weather from "./components/Weather";
import AccountSettings from "./components/AccountSettings";
import Profile from "./components/Profile";
import Notification from "./components/Notification";
import StartScreen from "./components/StartScreen";
import ChangeUsername from "./components/ChangeUsername";
import ChangePassword from "./components/ChangePassword";
import EditSecurityQuestions from "./components/EditSecurityQuestions";
import ForgotPassword from "./components/ForgotPassword";
import SetPassword from "./components/SetPassword";
import BrgyCalendar from "./components/BrgyCalendar";
import OfflineScreen from "./components/OfflineScreen";
import EditMobileNumber from "./components/EditMobileNumber";
import SOS from "./components/SOS";
import SOSRequests from "./components/SOSRequests";
import RespondedSOS from "./components/RespondedSOS";
import Readiness from "./components/Readiness";
import SafetyTips from "./components/SafetyTips";
import Typhoon from "./components/Typhoon";
import Flood from "./components/Flood";
import Earthquake from "./components/Earthquake";
import Fire from "./components/Fire";
import QuickTips from "./components/QuickTips";
import HazardMap from "./components/HazardMap";
import EvacuationMap from "./components/EvacuationMap";
import RiverSnapshots from "./components/RiverSnapshots";
import SOSStatusPage from "./components/SOSStatusPage";
import Chat from "./components/Chat";
import TermsConditions from "./components/TermsConditions";
import ResidentForm from "./components/ResidentForm";
import UserProfile from "./components/UserProfile";

//Routes
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { SocketProvider } from "./context/SocketContext";
import NotificationSetup from "./components/NotificationSetUp";
import * as Notifications from "expo-notifications";
import SuccessfulPage from "./components/SuccessfulPage";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
  unreadNotifications,
  unreadAnnouncements,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[MyStyles.bottomTabContainer, { bottom: insets.bottom }]}>
      {/* SVG Background with Notch */}
      <View
        style={[
          MyStyles.svgContainer,
          {
            height: 60,
          },
        ]}
      >
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <Path
            d="
              M0,0 
              H38
              C42,4 38,20 47,36
              C49,40 51,40 53,36
              C62,20 58,4 62,0
              H100
              V100 
              H0
              Z
            "
            fill="#fff"
          />
        </Svg>
      </View>

      {/* Tab Icons */}
      <View
        style={[
          MyStyles.bottomTabIcons,
          {
            height: 60,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          if (route.name === "CenterButtonPlaceholder")
            return <View key={index} style={{ flex: 1 }} />;

          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const iconColor = isFocused ? "#0E94D3" : "#808080";
          let iconName;
          let badgeCount = 0;

          switch (route.name) {
            case "Home":
              iconName = isFocused ? "home" : "home-outline";
              break;
            case "Announcements":
              iconName = isFocused ? "megaphone" : "megaphone-outline";
              badgeCount = unreadAnnouncements;
              break;
            case "Notification":
              iconName = isFocused ? "notifications" : "notifications-outline";
              badgeCount = unreadNotifications;
              break;
            case "Profile":
              iconName = isFocused ? "person" : "person-outline";
              break;
          }

          const onPress = () => navigation.navigate(route.name);

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              onPress={onPress}
              style={MyStyles.bottomTabButtons}
            >
              <View style={{ position: "relative" }}>
                <Ionicons name={iconName} size={24} color={iconColor} />
                {badgeCount > 0 && (
                  <View style={MyStyles.badge}>
                    <Text style={MyStyles.badgeText}>{badgeCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Floating SOS Button in Center */}
      <TouchableOpacity
        style={[MyStyles.fab, { bottom: 45 }]}
        onPress={() => console.log("SOS Pressed")}
      >
        <Text style={MyStyles.fabText}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
};

const BottomTabs = () => {
  const [unreadNotifications] = useState(1);
  const [unreadAnnouncements] = useState(3);

  return (
    <>
      <NotificationSetup />
      <Tab.Navigator
        initialRouteName="Home"
        tabBar={(props) => (
          <CustomTabBar
            {...props}
            unreadNotifications={unreadNotifications}
            unreadAnnouncements={unreadAnnouncements}
          />
        )}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Announcements" component={Announcement} />

        <Tab.Screen
          name="CenterButtonPlaceholder"
          options={{ tabBarButton: () => null }}
        >
          {() => null}
        </Tab.Screen>

        <Tab.Screen name="Notification" component={Notification} />
        <Tab.Screen name="Profile" component={UserProfile} />
      </Tab.Navigator>
    </>
  );
};

const DrawerContent = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { logout } = useContext(AuthContext);
  const handleConfirm = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            logout();
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 40,
        backgroundColor: "#fff",
      }}
    >
      <View
        style={{
          marginBottom: 40,
          marginTop: 20,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: user?.picture || "" }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
          }}
        />

        {/*pa-change nalang ng name at username based sa context hindi q ma-fetch */}
        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              color: "#04384E",
              fontFamily: "REMBold",
            }}
          >
            Jennie Kim
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#808080",
              fontFamily: "REMSemiBold",
            }}
          >
            kimkim
          </Text>
        </View>
      </View>

      {/* <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 20,
        }}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="home" size={22} color="#04384E" />
        <Text
          style={{
            fontSize: 18,
            marginLeft: 15,
            color: "#04384E",
            fontFamily: "QuicksandBold",
          }}
        >
          Home
        </Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 20,
        }}
        onPress={() => navigation.navigate("Certificates")}
      >
        <Ionicons name="document-text" size={22} color="#04384E" />
        <Text
          style={{
            fontSize: 18,
            marginLeft: 15,
            color: "#04384E",
            fontFamily: "QuicksandBold",
          }}
        >
          Request a document
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 20,
        }}
        onPress={() => navigation.navigate("CourtReservations")}
      >
        <Ionicons name="calendar" size={22} color="#04384E" />
        <Text
          style={{
            fontSize: 18,
            marginLeft: 15,
            color: "#04384E",
            fontFamily: "QuicksandBold",
          }}
        >
          Reserve a court
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 20,
        }}
        onPress={() => navigation.navigate("Blotter")}
      >
        <Ionicons name="file-tray-full" size={22} color="#04384E" />
        <Text
          style={{
            fontSize: 18,
            marginLeft: 15,
            color: "#04384E",
            fontFamily: "QuicksandBold",
          }}
        >
          File a blotter
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 20,
          fontFamily: "QuicksandBold",
        }}
        onPress={() => navigation.navigate("Status")}
      >
        <Ionicons name="calendar" size={22} color="#04384E" />
        <Text
          style={{
            fontSize: 18,
            marginLeft: 15,
            color: "#04384E",
            fontFamily: "QuicksandBold",
          }}
        >
          Status
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 20,
          fontFamily: "QuicksandBold",
        }}
        onPress={() => navigation.navigate("AccountSettings")}
      >
        <Ionicons name="settings" size={22} color="#04384E" />
        <Text
          style={{
            fontSize: 18,
            marginLeft: 15,
            color: "#04384E",
            fontFamily: "QuicksandBold",
          }}
        >
          Account settings
        </Text>
      </TouchableOpacity>

      <View
        style={{
          borderBottomWidth: 0.2,
          backgroundColor: "#04384E",
          opacity: 0.5,
        }}
      ></View>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 20,
          fontFamily: "QuicksandBold",
          marginTop: 50,
        }}
        onPress={() => navigation.navigate("Login")}
      >
        <Text
          style={{
            fontSize: 18,
            borderRadius: 5,
            color: "#fff",
            backgroundColor: "#04384E",
            width: "100%",
            fontFamily: "QuicksandBold",
            paddingVertical: 15,
            textAlign: "center",
          }}
          onPress={() => {
            handleConfirm();
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const BottomTabsWithDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="BottomTabs" component={BottomTabs} />
    </Drawer.Navigator>
  );
};

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const Stack = createNativeStackNavigator();
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [loadFonts] = useFonts({
    QuicksandRegular: require("./assets/fonts/quicksand/Quicksand-Regular.ttf"),
    QuicksandMedium: require("./assets/fonts/quicksand/Quicksand-Medium.ttf"),
    QuicksandSemiBold: require("./assets/fonts/quicksand/Quicksand-SemiBold.ttf"),
    QuicksandBold: require("./assets/fonts/quicksand/Quicksand-Bold.ttf"),
    REMRegular: require("./assets/fonts/rem/REM-Regular.ttf"),
    REMMedium: require("./assets/fonts/rem/REM-Medium.ttf"),
    REMSemiBold: require("./assets/fonts/rem/REM-SemiBold.ttf"),
    REMBold: require("./assets/fonts/rem/REM-Bold.ttf"),
  });

  // const forceClearSecureStore = async () => {
  //   const keysToClear = ["accessToken", "refreshToken"]; // Replace with your actual keys

  //   for (const key of keysToClear) {
  //     await SecureStore.deleteItemAsync(key);
  //     const remaining = await SecureStore.getItemAsync(key);
  //     console.log(`Key: ${key}, Remaining:`, remaining); // Should log null
  //   }

  //   console.log("SecureStore should now be cleared.");
  // };

  // useEffect(() => {
  //   forceClearSecureStore();
  // });
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected && state.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isConnected) {
      navigationRef.current?.reset({
        index: 0,
        routes: [{ name: "Offline" }],
      });
    }
  }, [isConnected]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const screen = response.notification.request.content.data?.screen;
        if (screen && navigationRef.isReady()) {
          if (screen === "Announcement") {
            navigationRef.navigate("BottomTabs", { screen });
          } else {
            navigationRef.navigate(screen);
          }
        }
      }
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await SecureStore.getItemAsync("hasLaunched");
      if (hasLaunched === null) {
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    };
    checkFirstLaunch();
  }, []);

  if (!loadFonts || isFirstLaunch === null) {
    return null;
  }

  // if (!isConnected) {
  //   return (
  //     <SafeAreaProvider>
  //       <NavigationContainer>
  //         <Stack.Navigator screenOptions={{ headerShown: false }}>
  //           <Stack.Screen name="Offline" component={OfflineScreen} />
  //           <Stack.Screen
  //             name="Readiness"
  //             component={Readiness}
  //             initialParams={{ isConnected: isConnected }}
  //           />
  //           <Stack.Screen name="SafetyTips" component={SafetyTips} />
  //           <Stack.Screen name="QuickTips" component={QuickTips} />
  //           <Stack.Screen name="HazardMap" component={HazardMap} />
  //           <Stack.Screen name="EvacuationMap" component={EvacuationMap} />
  //           <Stack.Screen name="Fire" component={Fire} />
  //           <Stack.Screen name="Typhoon" component={Typhoon} />
  //           <Stack.Screen name="Flood" component={Flood} />
  //           <Stack.Screen name="Earthquake" component={Earthquake} />
  //         </Stack.Navigator>
  //       </NavigationContainer>
  //     </SafeAreaProvider>
  //   );
  // }

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <AuthProvider>
          <SocketProvider>
            <OtpProvider>
              <Stack.Navigator
                key={`${isFirstLaunch}-${isConnected}`}
                screenOptions={{ headerShown: false }}
                initialRouteName={
                  !isConnected
                    ? "Offline"
                    : isFirstLaunch
                    ? "StartScreen"
                    : "Login"
                }
              >
                {!isConnected ? (
                  <>
                    <Stack.Screen name="Offline" component={OfflineScreen} />
                    <Stack.Screen
                      name="Readiness"
                      component={Readiness}
                      initialParams={{ isConnected }}
                    />
                    <Stack.Screen name="SafetyTips" component={SafetyTips} />
                    <Stack.Screen name="QuickTips" component={QuickTips} />
                    <Stack.Screen name="HazardMap" component={HazardMap} />
                    <Stack.Screen
                      name="EvacuationMap"
                      component={EvacuationMap}
                    />
                    <Stack.Screen name="Fire" component={Fire} />
                    <Stack.Screen name="Typhoon" component={Typhoon} />
                    <Stack.Screen name="Flood" component={Flood} />
                    <Stack.Screen name="Earthquake" component={Earthquake} />
                  </>
                ) : (
                  <>
                    {/* Public Routes */}

                    <Stack.Screen
                      name="StartScreen"
                      children={() => <PublicRoute element={<StartScreen />} />}
                    />

                    <Stack.Screen
                      name="Preview"
                      children={() => <PublicRoute element={<Preview />} />}
                    />
                    <Stack.Screen
                      name="Login"
                      children={() => <PublicRoute element={<Login />} />}
                    />
                    <Stack.Screen
                      name="TermsConditions"
                      children={() => (
                        <PublicRoute element={<TermsConditions />} />
                      )}
                    />
                    <Stack.Screen
                      name="Signup"
                      children={() => <PublicRoute element={<Signup />} />}
                    />

                    <Stack.Screen
                      name="ResidentForm"
                      children={() => (
                        <PublicRoute element={<ResidentForm />} />
                      )}
                    />
                    <Stack.Screen
                      name="OTP"
                      children={() => <PublicRoute element={<OTP />} />}
                    />

                    <Stack.Screen
                      name="ForgotPassword"
                      children={() => (
                        <PublicRoute element={<ForgotPassword />} />
                      )}
                    />

                    <Stack.Screen
                      name="SetPassword"
                      children={() => <PublicRoute element={<SetPassword />} />}
                    />

                    {/* Private Routes */}
                    <Stack.Screen
                      name="BottomTabs"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <BottomTabsWithDrawer />
                            </InfoProvider>
                          }
                        />
                      )}
                    />

                    <Stack.Screen
                      name="Certificates"
                      children={() => (
                        <PrivateRoute element={<Certificates />} />
                      )}
                    />
                    <Stack.Screen
                      name="CourtReservations"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <CourtReservations />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="Status"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <Status />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="Blotter"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <Blotter />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="UserProfile"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <UserProfile />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="Chat"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <Chat />
                            </InfoProvider>
                          }
                        />
                      )}
                    />

                    <Stack.Screen
                      name="EmergencyHotlines"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <EmergencyHotlines />
                            </InfoProvider>
                          }
                        />
                      )}
                    />

                    <Stack.Screen
                      name="Readiness"
                      initialParams={{ isConnected: isConnected }}
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <Readiness />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="RiverSnapshots"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <RiverSnapshots />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="QuickTips"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <QuickTips />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="SafetyTips"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <SafetyTips />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="HazardMap"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <HazardMap />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="EvacuationMap"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <EvacuationMap />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="Typhoon"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <Typhoon />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="Flood"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <Flood />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="Earthquake"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <Earthquake />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="Fire"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <Fire />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="Weather"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <Weather />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="AccountSettings"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <AccountSettings />
                            </InfoProvider>
                          }
                        />
                      )}
                    />

                    <Stack.Screen
                      name="Profile"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <Profile />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="ChangeUsername"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <ChangeUsername />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="ChangePassword"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <ChangePassword />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="EditSecurityQuestions"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <EditSecurityQuestions />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="EditMobileNumber"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <EditMobileNumber />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="BrgyCalendar"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <BrgyCalendar />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="SOS"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <SOS />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="SOSStatusPage"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <SOSStatusPage />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="SOSRequests"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <SOSRequests />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="RespondedSOS"
                      children={() => (
                        <PrivateRoute
                          element={
                            <InfoProvider>
                              <RespondedSOS />
                            </InfoProvider>
                          }
                        />
                      )}
                    />
                    <Stack.Screen
                      name="SuccessfulPage"
                      children={() => (
                        <PublicRoute element={<SuccessfulPage />} />
                      )}
                    />
                  </>
                )}
              </Stack.Navigator>
            </OtpProvider>
          </SocketProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
