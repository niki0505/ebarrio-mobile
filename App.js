import { StyleSheet, Text, View } from "react-native";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Announcements from "./components/Announcements";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./components/Home";
import { useAuthStore } from "./store/authStore";
import { useEffect, useState } from "react";
export default function App() {
  const Stack = createNativeStackNavigator();
  const checkTokenExpiry = useAuthStore((state) => state.checkTokenExpiry);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isChecking, setIsChecking] = useState(true);

  //CHECKS THE TOKEN EXPIRATION ON ALL SCREENS
  useEffect(() => {
    const checkAuth = async () => {
      await checkTokenExpiry();
      setIsChecking(false);
    };
    checkAuth();
  }, []);

  if (isChecking) {
    return null;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={accessToken ? "Home" : "Login"}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Announcements" component={Announcements} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
