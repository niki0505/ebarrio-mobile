import { StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";

const Home = () => {
  const { accessToken, refreshAccessToken, logout } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const navigation = useNavigation();

  const [isSidebarVisible, setSidebarVisible] = useState(false);

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
      <View
        style={{
          position: "absolute",
          top: 30,
          left: 15,
          flex: 1.5,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={40} color="#04384E" />
        </TouchableOpacity>

        <Text style={{ fontSize: 24, color: "#04384E", fontWeight: "bold" }}>
          Home
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>
          Welcome to Home {userDetails ? userDetails.username : "User"}
        </Text>
        <Text onPress={() => logout(navigation)}>Logout</Text>
      </View>

      {isSidebarVisible && (
        <Sidebar
          isVisible={isSidebarVisible}
          toggleSidebar={() => setSidebarVisible(false)}
        />
      )}
    </View>
  );
};

export default Home;
