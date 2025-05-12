import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useEffect } from "react";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InfoContext } from "../context/InfoContext";
import api from "../api";

const Announcement = () => {
  const insets = useSafeAreaInsets();
  const { fetchAnnouncements, announcements } = useContext(InfoContext);
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleHeart = async (announcementID) => {
    try {
      await api.put(`/heartannouncement/${announcementID}`);
    } catch (error) {
      console.log("Error liking announcement", error);
    }
  };

  const handleUnheart = async (announcementID) => {
    try {
      await api.put(`/unheartannouncement/${announcementID}`);
    } catch (error) {
      console.log("Error liking announcement", error);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }} // para hindi nago-overlap sa status bar when scrolled
    >
      <ScrollView
        contentContainerStyle={[
          MyStyles.scrollContainer,
          {
            paddingBottom: insets.bottom + 70,
            gap: 10,
          },
        ]}
      >
        {announcements.map((element, index) => (
          <View key={index} style={{ borderColor: "black", borderWidth: 1 }}>
            <Text>{element.content}</Text>
            {element.heartedby.includes(user.userID) ? (
              <TouchableOpacity onPress={() => handleUnheart(element._id)}>
                <Text>Filled Heart Icon</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => handleHeart(element._id)}>
                <Text>Unfilled Heart Icon</Text>
              </TouchableOpacity>
            )}
            <Text>{element.hearts}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
export default Announcement;
