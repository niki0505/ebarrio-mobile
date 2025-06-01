import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import api from "../api";

import Octicons from "@expo/vector-icons/Octicons";

const Notification = () => {
  const navigation = useNavigation();
  dayjs.extend(relativeTime);
  const insets = useSafeAreaInsets();
  const { notifications, fetchNotifications } = useContext(SocketContext);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotif = async (notifID, redirectTo) => {
    try {
      await api.put(`/readnotification/${notifID}`);
      navigation.navigate(redirectTo);
    } catch (error) {
      console.log("Error in reading notification", error);
    }
  };

  const truncateNotifMessage = (message, wordLimit = 25) => {
    const words = message.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + " ..."
      : message;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: "#F0F4F7",
      }}
    >
      <View style={{ flex: 1, position: "relative" }}>
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={MyStyles.header}>Notifications</Text>
          <Octicons name="filter" size={24} color="#04384E" />
        </View>
        <Text
          style={{
            marginTop: 10,
            paddingHorizontal: 20,
            color: "#04384E",
            fontSize: 16,
            fontFamily: "REMSemiBold",
            textAlign: "right",
          }}
        >
          Mark all as read
        </Text>

        <ScrollView
          contentContainerStyle={[
            MyStyles.scrollContainer,
            {
              paddingHorizontal: 20,
              paddingTop: 0,
              paddingBottom: 120,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {notifications
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((notif, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleNotif(notif._id, notif.redirectTo)}
                  style={{
                    flexDirection: "column",
                    borderBottomWidth: 1,
                    borderBottomColor: "#C1C0C0",
                    padding: 1,
                    position: "relative",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 10,
                      paddingRight: 20,
                    }}
                  >
                    <View style={{ flexDirection: "column", flex: 1 }}>
                      <Text
                        style={{
                          color: "#04384E",
                          fontSize: 16,
                          fontFamily: "QuicksandBold",
                        }}
                      >
                        {notif.title}
                      </Text>
                      <Text
                        style={{
                          color: "#04384E",
                          fontSize: 16,
                          fontFamily: "QuicksandSemiBold",
                        }}
                      >
                        {truncateNotifMessage(notif.message)}
                      </Text>
                      <Text
                        style={{
                          color: "#808080",
                          fontSize: 16,
                          fontFamily: "QuicksandSemiBold",
                        }}
                      >
                        {dayjs(notif.createdAt).fromNow()}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: 10,
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: notif.read ? "transparent" : "#3B82F6",
                      transform: [{ translateY: -4 }],
                    }}
                  />
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Notification;
