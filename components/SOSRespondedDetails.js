import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { InfoContext } from "../context/InfoContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import MapView, { Marker } from "react-native-maps";
import api from "../api";

const SOSRespondedDetails = () => {
  dayjs.extend(relativeTime);
  const route = useRoute();
  const { selectedID } = route.params;
  const insets = useSafeAreaInsets();
  const { user } = useContext(AuthContext);
  const { fetchRespondedSOS, respondedSOS } = useContext(InfoContext);
  const navigation = useNavigation();

  useEffect(() => {
    fetchRespondedSOS();
  }, []);

  const selectedReport = respondedSOS?.find(
    (report) => report._id === selectedID
  );

  const enrichedReport = selectedReport
    ? {
        ...selectedReport,
        ...getDateAndTime(selectedReport.createdAt),
      }
    : null;

  function getDateAndTime(timestamp) {
    if (!timestamp) return { datePart: "", timePart: "" };

    const date = new Date(timestamp);

    const datePart = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "Asia/Manila",
    });

    const timePart = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Manila",
    });

    return { datePart, timePart };
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: "#DCE5EB",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            MyStyles.scrollContainer,
            {
              gap: 10,
            },
          ]}
        >
          <MaterialIcons
            onPress={() => navigation.navigate("RespondedSOS")}
            name="arrow-back-ios"
            size={30}
            color="#04384E"
          />
          <Text style={MyStyles.header}>Report Details</Text>
          {enrichedReport && (
            <View key={enrichedReport._id}>
              <Text>{enrichedReport.status}</Text>
              <Text>{dayjs(enrichedReport.updatedAt).fromNow()}</Text>
              <Image
                source={{
                  uri:
                    enrichedReport?.resID?.picture ||
                    "https://via.placeholder.com/80",
                }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              <Text>
                {enrichedReport.resID.firstname} {enrichedReport.resID.lastname}
              </Text>
              <Text>{enrichedReport.resID.age}</Text>
              <Text>{enrichedReport.resID.householdno.address}</Text>
              <Text>{enrichedReport.resID.mobilenumber}</Text>
              <Text>
                {enrichedReport?.reporttype ? enrichedReport.reporttype : "SOS"}
              </Text>
              <Text>
                {enrichedReport?.datePart} at {enrichedReport?.timePart}
              </Text>
              <Text>
                {enrichedReport?.reportdetails
                  ? enrichedReport.reportdetails
                  : "N/A"}
              </Text>

              <MapView
                style={{
                  width: "100%",
                  height: 200,
                  borderRadius: 10,
                  marginTop: 10,
                }}
                initialRegion={{
                  latitude: enrichedReport.location.lat,
                  longitude: enrichedReport.location.lng,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: enrichedReport.location.lat,
                    longitude: enrichedReport.location.lng,
                  }}
                  title="Location"
                  description={enrichedReport.readableAddress}
                />
              </MapView>

              <Text>{enrichedReport?.postreportdetails}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SOSRespondedDetails;
