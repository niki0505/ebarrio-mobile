import { StyleSheet, Text, View } from "react-native";
import Signup from "./components/Signup";
import Login from "./components/Login";
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

  useEffect(() => {
    const checkAuth = async () => {
      await checkTokenExpiry();
      setIsChecking(false); // Only render after checking auth
    };
    checkAuth();
  }, []);

  if (isChecking) {
    return null; // Wait until token is checked before rendering UI
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
