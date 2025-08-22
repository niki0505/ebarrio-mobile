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
  ActivityIndicator,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { InfoContext } from "../context/InfoContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";

const SOSRequests = () => {
  dayjs.extend(relativeTime);
  const insets = useSafeAreaInsets();
  const { user } = useContext(AuthContext);
  const { fetchPendingReports, pendingReports, setPendingReports } =
    useContext(InfoContext);
  const navigation = useNavigation();
  const [modifiedReports, setModifiedReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingReports();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchPendingReports();
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    const enrichReports = async () => {
      if (pendingReports && pendingReports.length > 0) {
        const updatedReports = await Promise.all(
          pendingReports.map(async (report) => {
            if (report.location?.lat && report.location?.lng) {
              const address = await getReadableAddress(
                report.location.lat,
                report.location.lng
              );
              return { ...report, readableAddress: address || "Unknown" };
            }
            return { ...report, readableAddress: "No location available" };
          })
        );
        setModifiedReports(updatedReports);
      }
    };

    enrichReports();
  }, [pendingReports]);

  function formatAddress(components) {
    let streetNumber = "";
    let route = "";
    let city = "";
    let province = "";

    components.forEach((comp) => {
      if (comp.types.includes("street_number")) streetNumber = comp.long_name;
      if (comp.types.includes("route")) route = comp.long_name;
      if (comp.types.includes("locality")) city = comp.long_name;
      if (comp.types.includes("administrative_area_level_2"))
        province = comp.long_name;
    });

    const addressParts = [streetNumber, route, city, province].filter(Boolean);
    return addressParts.join(", ");
  }

  const getReadableAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyC3T3SOxoBKrTVpuJwvxGZIBQKg2iuFHGE`
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        return formatAddress(data.results[0].address_components);
      }
      return null;
    } catch (error) {
      console.error("Error fetching address:", error);
      return null;
    }
  };

  const viewDetails = (selectedID) => {
    const selectedReport = modifiedReports.find(
      (report) => report._id === selectedID
    );
    navigation.navigate("SOSReportDetails", {
      selectedID,
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: "#BC0F0F",
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
              backgroundColor: "#BC0F0F",
              gap: 10,
            },
          ]}
        >
          <AntDesign
            onPress={() => navigation.navigate("BottomTabs")}
            name="arrowleft"
            style={[MyStyles.backArrow, { color: "white" }]}
          />

          <Text
            style={[
              MyStyles.header,
              { fontFamily: "REMBold", color: "white", fontSize: 30 },
            ]}
          >
            SOS Requests
          </Text>
          <Text
            style={[MyStyles.formMessage, { color: "white", opacity: 0.7 }]}
          >
            Each SOS request must be verified for urgency and validity before
            action is taken
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#04384E" />
          ) : pendingReports.length === 0 ? (
            <Text
              style={[MyStyles.noEvents, { color: "#fff", opacity: "0.7" }]}
            >
              No pending SOS requests found.
            </Text>
          ) : (
            modifiedReports.map((report) => {
              let badgeColor = "gray";
              let badgeIcon = "help-circle";

              if (report.status === "New") {
                badgeColor = "red";
                badgeIcon = "alert-circle";
              } else if (report.status === "Pending") {
                badgeColor = "orange";
                badgeIcon = "time";
              } else if (report.status === "Responding") {
                badgeColor = "green";
                badgeIcon = "checkmark-done-circle";
              }

              return (
                <TouchableOpacity
                  onPress={() => viewDetails(report._id)}
                  key={report._id}
                  style={{
                    backgroundColor: "white",
                    padding: 12,
                    marginVertical: 6,
                    borderRadius: 12,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    elevation: 3,
                    marginVertical: 20,
                  }}
                >
                  {/* Status badge with icon */}
                  <View
                    style={{
                      backgroundColor: badgeColor,
                      alignSelf: "flex-start",
                      paddingHorizontal: 16,
                      paddingVertical: 4,
                      borderRadius: 50,
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons
                      name={badgeIcon}
                      size={16}
                      color="white"
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      style={{
                        color: "white",
                        fontFamily: "QuicksandBold",
                        fontSize: 14,
                      }}
                    >
                      {report.status || "Pending"}
                    </Text>
                  </View>

                  {/* Card content */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={{ uri: report.resID.picture }}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 30,
                        marginRight: 12,
                      }}
                    />

                    {/* Details */}
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: "REMSemiBold", fontSize: 20 }}>
                        {report.reporttype ? report.reporttype : "SOS"}
                      </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                        }}
                      >
                        <Text style={{ color: "black", fontSize: 16 }}>
                          #{report.readableAddress}
                        </Text>
                        <Text
                          style={{
                            color: "black",
                            fontFamily: "QuicksandMedium",
                            fontSize: 14,
                          }}
                        >
                          {dayjs(report.createdAt).fromNow()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SOSRequests;
