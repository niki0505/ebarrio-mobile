import { StyleSheet, View, Text, SafeAreaView, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

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
        <Text style={[MyStyles.header, { marginBottom: 0 }]}>
          Notifications
        </Text>
        {notifications.map((notif, index) => {
          return (
            <View
              key={index}
              onClick={() => handleNotif(notif._id, notif.redirectTo)}
            >
              {!notif.read ? (
                <Text style={{ color: "blue" }}>Blue Circle</Text>
              ) : null}
              <Text>{notif.title}</Text>
              <Text>{notif.message}</Text>
              <Text>{dayjs(notif.createdAt).fromNow()}</Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notification;
