import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useEffect } from "react";
import axios from "axios";

const Announcement = () => {
  const { accessToken, refreshAccessToken, logout } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const navigation = useNavigation();

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        "http://10.0.2.2:4000/api/auth/userdetails",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUserDetails(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Access Token Expired");
        const newAccessToken = await refreshAccessToken();
        console.log("New Access Token:", newAccessToken);
        if (newAccessToken) {
          const newResponse = await axios.get(
            "http://10.0.2.2:4000/api/auth/userdetails",
            {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          );
          setUserDetails(newResponse.data);
          console.log(newResponse.data);
        } else {
          console.log("Refresh Token Expired");
          Alert.alert("Session expired. Please log in again");
          navigation.navigate("Login");
        }
      } else {
        console.log("Error refreshing token", error.response.status);
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [accessToken]);

  return (
    <View style={MyStyles.container}>
      <Text>
        Welcome to Announcement {userDetails ? userDetails.username : "User"}
      </Text>
      <Text onPress={() => navigation.navigate("Home")}>Home</Text>
      <Text onPress={() => logout(navigation)}>Logout</Text>
    </View>
  );
};
export default Announcement;
