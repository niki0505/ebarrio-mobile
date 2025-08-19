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
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { InfoContext } from "../context/InfoContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const SOSRequests = () => {
  dayjs.extend(relativeTime);
  const insets = useSafeAreaInsets();
  const { user } = useContext(AuthContext);
  const { fetchPendingReports, pendingReports, setPendingReports } =
    useContext(InfoContext);
  const navigation = useNavigation();
  const [modifiedReports, setModifiedReports] = useState([]);

  useEffect(() => {
    // fetch reports once on mount
    fetchPendingReports();
  }, []);

  useEffect(() => {
    // when pendingReports updates, enrich them
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
            onPress={() => navigation.navigate("BottomTabs")}
            name="arrow-back-ios"
            size={30}
            color="#04384E"
          />
          <Text style={MyStyles.header}>SOS Requests</Text>
          {modifiedReports?.map((report) => {
            return (
              <TouchableOpacity
                onPress={() => viewDetails(report._id)}
                key={report._id}
              >
                <Text>{dayjs(report.createdAt).fromNow()}</Text>
                <Image
                  source={{ uri: report.resID.picture }}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                />
                <Text>{report.reporttype ? report.reporttype : "SOS"}</Text>
                <Text>{report.readableAddress}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SOSRequests;
