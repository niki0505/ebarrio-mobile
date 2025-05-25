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
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import { MaterialIcons } from "@expo/vector-icons";
import { InfoContext } from "../context/InfoContext";
import api from "../api";
import Dialog from "react-native-dialog";

const Status = () => {
  const { fetchServices, services } = useContext(InfoContext);
  const { fetchUserDetails, userDetails } = useContext(InfoContext);
  const insets = useSafeAreaInsets();
  const [sortOption, setSortOption] = useState("newest");
  const [certVisible, setCertVisible] = useState(false);
  const [certReason, setCertReason] = useState("");
  const [reservationVisible, setReservationVisible] = useState(false);
  const [reservationReason, setReservationReason] = useState("");
  const [selectedCertID, setSelectedCertID] = useState(null);
  const [selectedCertCreated, setSelectedCertCreated] = useState(null);
  const [selectedReservationID, setSelectedReservationID] = useState(null);
  const [selectedReservationCreated, setSelectedReservationCreated] =
    useState(null);
  dayjs.extend(relativeTime);
  const navigation = useNavigation();

  useEffect(() => {
    fetchServices();
    fetchUserDetails();
  }, []);

  const sortedServices = [...services].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });

  const certCancelClick = (certID, createdAt) => {
    setCertVisible(true);
    setSelectedCertID(certID);
    setSelectedCertCreated(createdAt);
  };

  const reservationCancelClick = (reservationID, createdAt) => {
    setReservationVisible(true);
    setSelectedReservationID(reservationID);
    setSelectedReservationCreated(createdAt);
  };

  const cancelCertificate = async () => {
    const now = new Date();
    const createdTime = new Date(selectedCertCreated);
    const diffInMinutes = (now - createdTime) / 60000;
    if (diffInMinutes > 30) {
      alert("Cancellation is only allowed within 30 minutes after submission");
      return;
    }
    try {
      await api.put(`/cancelcertrequest/${selectedCertID}`, { certReason });
      setCertVisible(false);
      alert("Certificate cancelled successfully!");
    } catch (error) {
      console.log("Error in cancelling certificate", error);
    }
  };

  const cancelReservation = async () => {
    const now = new Date();
    const createdTime = new Date(selectedReservationCreated);
    const diffInMinutes = (now - createdTime) / 60000;
    if (diffInMinutes > 30) {
      alert("Cancellation is only allowed within 30 minutes after submission");
      return;
    }

    try {
      await api.put(`/cancelreservationrequest/${selectedReservationID}`, {
        reservationReason,
      });
      setReservationVisible(false);
      alert("Court reservation cancelled successfully!");
    } catch (error) {
      console.log("Error in cancelling court reservation", error);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            MyStyles.scrollContainer,
            {
              paddingBottom: 20,
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
          <Text style={MyStyles.header}>Status</Text>

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
            }}
            selectedTextStyle={{
              color: "#04384E",
              fontFamily: "QuicksandSemiBold",
              fontSize: 16,
            }}
          />

          <Dialog.Container visible={certVisible}>
            <Dialog.Title>Cancel Certificate</Dialog.Title>
            <Dialog.Input
              placeholder="Enter your reason here..."
              onChangeText={(text) => setCertReason(text)}
            />
            <Dialog.Button
              label="Cancel"
              onPress={() => setCertVisible(false)}
            />
            <Dialog.Button label="Submit" onPress={cancelCertificate} />
          </Dialog.Container>

          <Dialog.Container visible={reservationVisible}>
            <Dialog.Title>Cancel Court Reservation</Dialog.Title>
            <Dialog.Input
              placeholder="Enter your reason here..."
              onChangeText={(text) => setReservationReason(text)}
            />
            <Dialog.Button
              label="Cancel"
              onPress={() => setReservationVisible(false)}
            />
            <Dialog.Button label="Submit" onPress={cancelReservation} />
          </Dialog.Container>

          {sortedServices.map((service, index) => {
            return (
              <View key={index}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>{service.status}</Text>
                  <Text>{dayjs(service.createdAt).fromNow()}</Text>
                </View>

                {service.type === "Certificate" && (
                  <>
                    <Text>{service.type}</Text>
                    {(service.typeofcertificate === "Barangay Indigency" ||
                      service.typeofcertificate === "Barangay Clearance") && (
                      <>
                        <Text>{service.typeofcertificate}</Text>
                        <Text>Purpose: {service.purpose}</Text>
                        <Text>Amount: {service.amount}</Text>
                      </>
                    )}

                    {service.typeofcertificate ===
                      "Barangay Business Clearance" && (
                      <>
                        <Text>{service.typeofcertificate}</Text>
                        <Text>Business Name: {service.businessname}</Text>
                        <Text>Line of Business: {service.lineofbusiness}</Text>

                        {service.locationofbusiness === "Resident's Address" ? (
                          <Text>
                            Location of Business: {userDetails.resID.address}
                          </Text>
                        ) : (
                          <Text>
                            Location of Business: {service.locationofbusiness}
                          </Text>
                        )}
                      </>
                    )}
                    {service.status === "Pending" &&
                      new Date(service.createdAt) >=
                        new Date(new Date().getTime() - 30 * 60 * 1000) && (
                        <TouchableOpacity
                          onPress={() =>
                            certCancelClick(service._id, service.createdAt)
                          }
                        >
                          <Text>Cancel</Text>
                        </TouchableOpacity>
                      )}
                    {service.status === "Rejected" && (
                      <>
                        <Text>Remarks: {service.remarks}</Text>
                      </>
                    )}
                  </>
                )}

                {service.type === "Reservation" && (
                  <>
                    <Text>{service.type}</Text>
                    <Text>
                      {new Date(service.starttime).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      {new Date(service.starttime).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(service.endtime).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                    {service.status === "Pending" &&
                      new Date(service.createdAt) >=
                        new Date(new Date().getTime() - 30 * 60 * 1000) && (
                        <TouchableOpacity
                          onPress={() =>
                            reservationCancelClick(
                              service._id,
                              service.createdAt
                            )
                          }
                        >
                          <Text>Cancel</Text>
                        </TouchableOpacity>
                      )}
                    {service.status === "Rejected" && (
                      <>
                        <Text>Remarks: {service.remarks}</Text>
                      </>
                    )}
                  </>
                )}

                {service.type === "Blotter" && (
                  <>
                    <Text>{service.type}</Text>
                    <Text>
                      Type of the Complaint: {service.typeofthecomplaint}
                    </Text>
                    <Text>
                      Subject of the Complaint:{" "}
                      {service.subjectID
                        ? `${service.subjectID.firstname} ${service.subjectID.lastname}`
                        : service.subjectname}
                    </Text>
                    <Text>Complaint Details: {service.details}</Text>
                    {(service.status === "Scheduled" ||
                      service.status === "Settled") && (
                      <>
                        <Text>
                          Scheduled Meeting:{" "}
                          {new Date(service.starttime).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}{" "}
                          {new Date(service.starttime).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}{" "}
                          -{" "}
                          {new Date(service.endtime).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </Text>
                      </>
                    )}
                    {service.status === "Settled" && (
                      <>
                        <Text>
                          Witness:{" "}
                          {service.witnessID
                            ? `${service.witnessID.firstname} ${service.witnessID.lastname}`
                            : service.witnessname}
                        </Text>
                        <Text>
                          Agreement Details: {service.agreementdetails}
                        </Text>
                      </>
                    )}
                    {service.status === "Rejected" && (
                      <>
                        <Text>Remarks: {service.remarks}</Text>
                      </>
                    )}
                  </>
                )}
              </View>
            );
          })}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Status;
