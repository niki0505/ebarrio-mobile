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
  Dimensions,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { InfoContext } from "../context/InfoContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import MapView, { Marker } from "react-native-maps";
import api from "../api";
import AlertModal from "./AlertModal";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const SOSReportDetails = () => {
  dayjs.extend(relativeTime);
  const route = useRoute();
  const { selectedID } = route.params;
  const insets = useSafeAreaInsets();
  const { user } = useContext(AuthContext);
  const { fetchPendingReports, pendingReports } = useContext(InfoContext);
  const navigation = useNavigation();
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isConfirmArrivedVisible, setIsConfirmArrivedVisible] = useState(false);
  const [isConfirmDidNotArrivedVisible, setIsConfirmDidNotArrivedVisible] =
    useState(false);
  const { width } = Dimensions.get("window");

  useEffect(() => {
    fetchPendingReports();
  }, []);

  const selectedReport = pendingReports?.find(
    (report) => report._id === selectedID
  );

  const responder = selectedReport?.responder?.find(
    (r) => r.empID.toString() === user.empID
  );

  const headingSOS = async () => {
    setIsConfirmModalVisible(false);
    try {
      await api.put(`/headingsos/${selectedID}`);
    } catch (error) {
      console.error("❌ Failed to click heading:", error);
    }
  };

  const arrivedSOS = async () => {
    setIsConfirmArrivedVisible(false);
    try {
      await api.put(`/arrivedsos/${selectedID}`);
    } catch (error) {
      console.error("❌ Failed to click arrived:", error);
    }
  };

  const didntArriveSOS = async () => {
    setIsConfirmDidNotArrivedVisible(false);
    try {
      await api.put(`/didntarrivesos/${selectedID}`);
    } catch (error) {
      console.error("❌ Failed to click arrived:", error);
    }
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
            onPress={() => navigation.navigate("SOSRequests")}
            name="arrowleft"
            style={[MyStyles.backArrow, { color: "white" }]}
          />

          <Text style={[MyStyles.header, { color: "white" }]}>
            Report Details
          </Text>

          <Text
            style={[MyStyles.formMessage, { color: "white", opacity: 0.7 }]}
          >
            Please ensure the reported incident is legitimate before confirming
            any response.
          </Text>

          {selectedReport && (
            <View
              key={selectedReport._id}
              style={[MyStyles.sosCard, MyStyles.shadow]}
            >
              <View
                style={[
                  MyStyles.statusWrapper,
                  {
                    backgroundColor:
                      selectedReport.status === "False Alarm"
                        ? "red"
                        : selectedReport.status === "Pending"
                        ? "orange"
                        : selectedReport.status === "Ongoing"
                        ? "green"
                        : "gray",
                  },
                ]}
              >
                <Ionicons
                  name={
                    selectedReport.status === "False Alarm"
                      ? "alert-circle"
                      : selectedReport.status === "Pending"
                      ? "time"
                      : selectedReport.status === "Ongoing"
                      ? "checkmark-done-circle"
                      : "help-circle"
                  }
                  style={MyStyles.statusIcon}
                />
                <Text style={MyStyles.statusTitle}>
                  {selectedReport.status || "Pending"}
                </Text>
              </View>

              <View
                style={[
                  MyStyles.rowAlignment,
                  { justifyContent: "flex-start" },
                ]}
              >
                <View>
                  <Image
                    source={{
                      uri:
                        selectedReport?.resID?.picture ||
                        "https://via.placeholder.com/80",
                    }}
                    style={MyStyles.sosImg}
                  />
                </View>
                <View>
                  <Text style={MyStyles.sosReportType}>
                    {selectedReport.resID.firstname}{" "}
                    {selectedReport.resID.lastname}
                  </Text>
                  <Text style={MyStyles.sosDetailsText}>
                    {selectedReport.resID.age} years old
                  </Text>
                </View>
              </View>

              <View style={MyStyles.sosDetailsWrapper}>
                <View
                  style={[
                    MyStyles.sosDetailsRowWrapper,
                    { alignItems: "flex-start" },
                  ]}
                >
                  {/* <Ionicons
                    name="location"
                    style={{
                      color: "red",
                      fontSize: 30,
                    }}
                  /> */}
                  <Text style={MyStyles.sosDetailsTitle}>Address:</Text>
                  <Text
                    style={[
                      MyStyles.sosDetailsAnswer,
                      {
                        flexShrink: 1,
                        flexWrap: "wrap",
                      },
                    ]}
                  >
                    # {selectedReport.resID.householdno.address}
                  </Text>
                </View>

                <View style={MyStyles.sosDetailsRowWrapper}>
                  {/* <Ionicons
                    name="call"
                    style={{ color: "red", fontSize: 30 }}
                  /> */}
                  <Text style={MyStyles.sosDetailsTitle}>Mobile:</Text>
                  <Text style={MyStyles.sosDetailsAnswer}>
                    {selectedReport.resID.mobilenumber}
                  </Text>
                </View>

                <View style={MyStyles.sosDetailsRowWrapper}>
                  <Text style={MyStyles.sosDetailsTitle}>Time Reported:</Text>
                  <Text style={MyStyles.sosDetailsAnswer}>
                    {dayjs(selectedReport.createdAt).fromNow()}
                  </Text>
                </View>

                <View style={MyStyles.sosDetailsRowWrapper}>
                  <Text style={MyStyles.sosDetailsTitle}>
                    Type of Emergency:
                  </Text>
                  <Text style={MyStyles.sosDetailsAnswer}>
                    {selectedReport?.reporttype
                      ? selectedReport.reporttype
                      : "SOS"}
                  </Text>
                </View>

                <View style={MyStyles.sosDetailsColWrapper}>
                  <Text style={MyStyles.sosDetailsTitle}>
                    Additional Details:
                  </Text>
                  <Text style={MyStyles.sosDetailsAnswer}>
                    {" "}
                    {selectedReport?.reportdetails
                      ? selectedReport.reportdetails
                      : "N/A"}
                  </Text>
                </View>

                <View style={MyStyles.sosMapWrapper}>
                  <View style={MyStyles.sosMapHeader}>
                    <Text style={MyStyles.sosMapHeaderText}>
                      Incident Location
                    </Text>
                  </View>

                  <MapView
                    style={{ flex: 1 }}
                    initialRegion={{
                      latitude: selectedReport.location.lat,
                      longitude: selectedReport.location.lng,
                      latitudeDelta: 0.002,
                      longitudeDelta: 0.002,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: selectedReport.location.lat,
                        longitude: selectedReport.location.lng,
                      }}
                      title="Location"
                      description={selectedReport.readableAddress}
                    />
                  </MapView>
                </View>
              </View>

              {responder ? (
                <>
                  {responder.status === "Heading" && (
                    <View style={{ marginTop: 30, gap: 20 }}>
                      <TouchableOpacity
                        onPress={() => setIsConfirmArrivedVisible(true)}
                        style={[
                          MyStyles.button,
                          { backgroundColor: "#BC0F0F" },
                        ]}
                      >
                        <Text style={MyStyles.buttonText}>Arrived</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setIsConfirmDidNotArrivedVisible(true)}
                        style={[MyStyles.button, MyStyles.sosWhiteBtn]}
                      >
                        <Text
                          style={[MyStyles.buttonText, { color: "#BC0F0F" }]}
                        >
                          Did Not Arrive
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {responder.status === "Arrived" && responder.isHead && (
                    <View style={{ marginTop: 30, gap: 20 }}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("PostIncident", { selectedID })
                        }
                        style={[
                          MyStyles.button,
                          { backgroundColor: "#BC0F0F" },
                        ]}
                      >
                        <Text style={MyStyles.buttonText}>Verify</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("FalseAlarm", { selectedID })
                        }
                        style={[MyStyles.button, MyStyles.sosWhiteBtn]}
                      >
                        <Text
                          style={[MyStyles.buttonText, { color: "#BC0F0F" }]}
                        >
                          False Alarm
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsConfirmModalVisible(true)}
                  style={[
                    MyStyles.button,
                    { marginTop: 30, backgroundColor: "#BC0F0F" },
                  ]}
                >
                  <Text style={MyStyles.buttonText}>Heading</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <AlertModal
            isVisible={isConfirmModalVisible}
            isConfirmationModal={true}
            title="Heading?"
            message="Are you sure you want to proceed to this location?"
            onClose={() => setIsConfirmModalVisible(false)}
            onConfirm={headingSOS}
          />
          <AlertModal
            isVisible={isConfirmArrivedVisible}
            isConfirmationModal={true}
            title="Arrived?"
            message="Are you sure you arrived at the location?"
            onClose={() => setIsConfirmArrivedVisible(false)}
            onConfirm={arrivedSOS}
          />
          <AlertModal
            isVisible={isConfirmDidNotArrivedVisible}
            isConfirmationModal={true}
            title="Did Not Arrived?"
            message="Are you sure you did not arrive at the location?"
            onClose={() => setIsConfirmDidNotArrivedVisible(false)}
            onConfirm={didntArriveSOS}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SOSReportDetails;
