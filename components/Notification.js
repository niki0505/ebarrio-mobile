import {
  MyStylesheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
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
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";

const Notification = () => {
  const navigation = useNavigation();
  dayjs.extend(relativeTime);
  const insets = useSafeAreaInsets();
  const { notifications, fetchNotifications } = useContext(SocketContext);
  const [isFilterDropdownVisible, setIsFilterDropdownVisible] = useState(false);
  const [filter, setFilter] = useState("All");

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

  const markAllAsRead = async () => {
    try {
      await api.put("/readnotifications");
    } catch (error) {
      console.log("Error in marking all as read", error);
    }
  };

  const truncateNotifMessage = (message, wordLimit = 25) => {
    const words = message.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + " ..."
      : message;
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "All") return true;
    if (filter === "Read") return notif.read === true;
    if (filter === "Unread") return notif.read === false;
    return true;
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setIsFilterDropdownVisible(false);
        Keyboard.dismiss();
      }}
    >
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Entypo
                name="menu"
                size={35}
                color="#04384E"
                onPress={() => navigation.openDrawer()}
                style={{ marginTop: 5, marginRight:10 }}
              />
              <View>
                <Text style={MyStyles.header}>Notifications</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() =>
                setIsFilterDropdownVisible(!isFilterDropdownVisible)
              }
            >
              <Octicons name="filter" size={24} color="#04384E" />
            </TouchableOpacity>
          </View>
          {/* Dropdown Modal */}
          {isFilterDropdownVisible && (
            <View style={MyStyles.filterDropdown}>
              <TouchableOpacity
                onPress={() => {
                  setFilter("All");
                  setIsFilterDropdownVisible(false);
                }}
                style={MyStyles.filterDropdownItem}
              >
                <Text style={MyStyles.filterDropdownText}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setFilter("Read");
                  setIsFilterDropdownVisible(false);
                }}
                style={MyStyles.filterDropdownItem}
              >
                <Text style={MyStyles.filterDropdownText}>Read</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setFilter("Unread");
                  setIsFilterDropdownVisible(false);
                }}
                style={MyStyles.filterDropdownItem}
              >
                <Text style={MyStyles.filterDropdownText}>Unread</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity onPress={markAllAsRead}>
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
          </TouchableOpacity>

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
            {filteredNotifications
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
        {/* Fixed Floating Chat Button */}
        {/* <TouchableOpacity
          onPress={() => navigation.navigate("Chat")}
          style={{
            position: "absolute",
            bottom: insets.bottom + 60,
            right: 20,
            backgroundColor: "#fff",
            width: 60,
            height: 60,
            borderRadius: 30,
            elevation: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View onPress={() => navigation.navigate("Chat")}>
            <Ionicons name="chatbubble-ellipses" size={30} color="#0E94D3" />
          </View>
        </TouchableOpacity> */}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Notification;
