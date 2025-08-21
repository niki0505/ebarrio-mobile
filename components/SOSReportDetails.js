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
import AlertModal from "./AlertModal";

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
            onPress={() => navigation.navigate("SOSRequests")}
            name="arrow-back-ios"
            size={30}
            color="#04384E"
          />
          <Text style={MyStyles.header}>Report Details</Text>
          {selectedReport && (
            <View key={selectedReport._id}>
              <Text>{dayjs(selectedReport.createdAt).fromNow()}</Text>
              <Image
                source={{
                  uri:
                    selectedReport?.resID?.picture ||
                    "https://via.placeholder.com/80",
                }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              <Text>
                {selectedReport.resID.firstname} {selectedReport.resID.lastname}
              </Text>
              <Text>{selectedReport.resID.age}</Text>
              <Text>{selectedReport.resID.householdno.address}</Text>
              <Text>{selectedReport.resID.mobilenumber}</Text>
              <Text>
                {selectedReport?.reporttype ? selectedReport.reporttype : "SOS"}
              </Text>
              <Text>
                {selectedReport?.reportdetails
                  ? selectedReport.reportdetails
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
              {responder ? (
                <>
                  {responder.status === "Heading" && (
                    <>
                      <TouchableOpacity
                        onPress={() => setIsConfirmArrivedVisible(true)}
                        style={MyStyles.button}
                      >
                        <Text>Arrived</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={headingSOS}
                        style={MyStyles.button}
                      >
                        <Text>Did Not Arrive</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {responder.status === "Arrived" && responder.isHead && (
                    <>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("PostIncident", { selectedID })
                        }
                        style={MyStyles.button}
                      >
                        <Text>Verify</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("FalseAlarm", { selectedID })
                        }
                        style={MyStyles.button}
                      >
                        <Text>False Alarm</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsConfirmModalVisible(true)}
                  style={MyStyles.button}
                >
                  <Text>Heading</Text>
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
