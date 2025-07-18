import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InfoContext } from "../context/InfoContext";
import api from "../api";
import { Dropdown } from "react-native-element-dropdown";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Aniban2Logo from "../assets/aniban2logo.png";
import ImageViewing from "react-native-image-viewing";

//ICONS
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";

const Announcement = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { fetchAnnouncements, announcements } = useContext(InfoContext);
  const { user } = useContext(AuthContext);
  const [sortOption, setSortOption] = useState("newest");
  dayjs.extend(relativeTime);
  const [expandedAnnouncements, setExpandedAnnouncements] = useState([]);

  const [visible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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

  /* EXPANDED ANNOUNCEMENTS */
  const toggleExpanded = (id) => {
    setExpandedAnnouncements((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    const aPinned = a.status === "Pinned";
    const bPinned = b.status === "Pinned";
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    if (sortOption === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });

  const renderContent = (announcement) => {
    const words = announcement.content.split(" ");
    const isLong = words.length > 25;
    const isExpanded = expandedAnnouncements.includes(announcement._id);
    const displayText = isExpanded
      ? announcement.content
      : words.slice(0, 25).join(" ") + (isLong ? "..." : "");

    return (
      <View style={{ marginVertical: 10 }}>
        {announcement.eventdetails !== "" && (
          <Text
            style={{
              marginBottom: 5,
              fontSize: 16,
              color: "#04384E",
              fontFamily: "QuicksandSemiBold",
            }}
          >
            {announcement.eventdetails}
          </Text>
        )}
        <Text
          style={{
            fontSize: 16,
            color: "#04384E",
            fontFamily: "QuicksandMedium",
          }}
        >
          {displayText}
        </Text>
        {isLong && (
          <Text
            style={{
              color: "#006EFF",
              marginTop: 5,
              fontFamily: "QuicksandMedium",
            }}
            onPress={() => toggleExpanded(announcement._id)}
          >
            {isExpanded ? "See less" : "See more"}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          MyStyles.scrollContainer,
          {
            paddingBottom: insets.bottom + 70,
            gap: 10,
          },
        ]}
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
            style={{ marginTop: 5, marginRight: 10 }}
          />
          <View>
            <Text style={MyStyles.header}>Announcements</Text>
          </View>
        </View>

        <Dropdown
          data={[
            { label: "Newest", value: "newest" },
            { label: "Oldest", value: "oldest" },
          ]}
          labelField="label"
          valueField="value"
          value={sortOption}
          placeholder={sortOption}
          onChange={(item) => setSortOption(item.value)}
          style={{
            backgroundColor: "#fff",
            width: "30%",
            height: 30,
            borderWidth: 1,
            borderColor: "#ACACAC",
            borderRadius: 5,
            alignSelf: "flex-end",
            paddingHorizontal: 4,
            marginTop: 20,
          }}
          selectedTextStyle={{
            color: "#04384E",
            fontFamily: "QuicksandSemiBold",
            fontSize: 16,
          }}
        />
        {sortedAnnouncements.map((element, index) => (
          <View
            key={index}
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              marginBottom: 10,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image source={Aniban2Logo} style={{ width: 50, height: 50 }} />
                <View style={{ marginLeft: 5 }}>
                  <Text
                    style={{
                      color: "#04384E",
                      fontSize: 16,
                      fontFamily: "QuicksandBold",
                    }}
                  >
                    Barangay Aniban 2
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#808080",
                      fontFamily: "QuicksandSemiBold",
                    }}
                  >
                    {dayjs(element.createdAt).fromNow()}
                  </Text>
                </View>
              </View>

              {element.status === "Pinned" && (
                <MaterialIcons
                  name="push-pin"
                  size={24}
                  color="#04384E"
                  style={{
                    transform: [{ rotate: "30deg" }],
                    marginRight: 15,
                    marginTop: 5,
                  }}
                />
              )}
            </View>

            <View style={{ marginVertical: 10 }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    color: "#04384E",
                    fontSize: 16,
                    fontFamily: "QuicksandSemiBold",
                  }}
                >
                  {element.category}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    color: "#808080",
                    fontSize: 16,
                    fontFamily: "QuicksandMedium",
                  }}
                >
                  {element.title}
                </Text>
              </View>
            </View>

            {element.picture && element.picture.trim() !== "" && (
              <TouchableOpacity
                onPress={() => {
                  setSelectedImage([{ uri: element.picture }]);
                  setIsVisible(true);
                }}
              >
                <Image
                  source={{ uri: element.picture }}
                  style={{
                    width: "100%",
                    height: 200,
                    borderRadius: 15,
                    marginTop: 10,
                  }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}

            <ImageViewing
              images={selectedImage || []}
              imageIndex={0}
              visible={visible}
              onRequestClose={() => setIsVisible(false)}
              presentationStyle="overFullScreen"
            />

            {renderContent(element)}

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
            >
              {Array.isArray(element.heartedby) &&
              element.heartedby.includes(user.userID) ? (
                <TouchableOpacity onPress={() => handleUnheart(element._id)}>
                  <Ionicons name="heart" size={24} color="red" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleHeart(element._id)}>
                  <Ionicons name="heart-outline" size={24} color="#808080" />
                </TouchableOpacity>
              )}
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "QuicksandSemiBold",
                  color: "#808080",
                }}
              >
                {element.hearts}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
  );
};
export default Announcement;
