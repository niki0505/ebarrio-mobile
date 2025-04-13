import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { OtpProvider } from "./context/OtpContext";
import { useContext, useEffect, useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Announcement from "./components/Announcement";
import OTP from "./components/OTP";
import { Text, View } from "react-native";

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
      initialRouteName={isUserLoggedIn ? "Home" : "Login"}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="OTP" component={OTP} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Announcement" component={Announcement} />
    </Stack.Navigator>
  );
};
