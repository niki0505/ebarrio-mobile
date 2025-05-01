import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { OtpProvider } from "./context/OtpContext";
import { View, Text, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MyStyles } from "./components/stylesheet/MyStyles";

//Screens
import Login from "./components/Login";
import Signup from "./components/Signup";
import OTP from "./components/OTP";
import Home from "./components/Home";
import Announcement from "./components/Announcement";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <AuthProvider>
      <OtpProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </OtpProvider>
    </AuthProvider>
  );
}

// Bottom Tab Navigation
const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Announcement") {
            iconName = focused ? "megaphone" : "megaphone-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarStyle: MyStyles.tabBar,
        tabBarLabelStyle: MyStyles.tabBarLabel,
        tabBarActiveTintColor: "#0E94D3",
        tabBarInactiveTintColor: "grey",
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Announcement" component={Announcement} />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();
  const { isUserLoggedIn, setIsUserLoggedIn, refreshAccessToken } =
    useContext(AuthContext);

  const [isLoggedIn, setIsLoggedIn] = useState(null); // `null` means still checking
  const [isLoading, setIsLoading] = useState(true); // ✅ Loading state

  useEffect(() => {
    const refreshTokenAndCheckLogin = async () => {
      const newToken = await refreshAccessToken();
      console.log("New Access Token:", newToken);

      if (newToken) {
        setIsUserLoggedIn(true);
        setIsLoggedIn(true);
      } else {
        setIsUserLoggedIn(false);
        setIsLoggedIn(false);
      }

      setIsLoading(false); // ✅ Stop loading after checking
    };

    refreshTokenAndCheckLogin();
  }, []);

  useEffect(() => {
    if (isUserLoggedIn !== null) {
      setIsLoggedIn(isUserLoggedIn);
    }
  }, [isUserLoggedIn]);

  // ✅ Show loading screen while checking session
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <Text style={{ fontSize: 18 }}>Checking session...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isUserLoggedIn ? "BottomTabs" : "Login"}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="OTP" component={OTP} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
    </Stack.Navigator>
  );
};
