import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "./context/AuthContext";
import { InfoProvider } from "./context/InfoContext";
import { OtpProvider } from "./context/OtpContext";
import { View, Text, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MyStyles } from "./components/stylesheet/MyStyles";
import { SafeAreaProvider } from "react-native-safe-area-context";

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

//Routes
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

const Tab = createBottomTabNavigator();

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

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <OtpProvider>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {/* Public Routes */}
              <Stack.Screen
                name="Login"
                children={() => <PublicRoute element={<Login />} />}
              />
              <Stack.Screen
                name="Signup"
                children={() => <PublicRoute element={<Signup />} />}
              />
              <Stack.Screen name="OTP" component={OTP} />

              {/* Private Routes */}
              <Stack.Screen
                name="BottomTabs"
                children={() => <PrivateRoute element={<BottomTabs />} />}
              />

              <Stack.Screen
                name="Certificates"
                children={() => <PrivateRoute element={<Certificates />} />}
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
                children={() => <PrivateRoute element={<Status />} />}
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
            </Stack.Navigator>
          </OtpProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
