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
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }}
    >
      <ScrollView
        contentContainerStyle={[
          MyStyles.scrollContainer,
          {
            paddingBottom: insets.bottom + 70,
          },
        ]}
      >
        <Text style={[MyStyles.header, { marginBottom: 20 }]}>
          Notifications
        </Text>
        {notifications
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((notif, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleNotif(notif._id, notif.redirectTo)}
                style={{
                  flexDirection: "column",
                  borderTopWidth: 1,
                  borderTopColor: "#C1C0C0",
                  padding: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 10,
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      marginRight: 12,
                      backgroundColor: notif.read ? "transparent" : "#3B82F6",
                    }}
                  />

                  <View style={{ flexDirection: "column" }}>
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
              </TouchableOpacity>
            );
          })}
        <Text
          style={{
            color: "#04384E",
            fontSize: 16,
            fontFamily: "REMSemiBold",
            borderTopWidth: 1,
            borderTopColor: "#C1C0C0",
          }}
        >
          Mark all as read
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notification;
