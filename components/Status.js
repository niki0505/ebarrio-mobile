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

const Status = () => {
  const { fetchServices, services } = useContext(InfoContext);
  const { fetchUserDetails, userDetails } = useContext(InfoContext);
  const insets = useSafeAreaInsets();
  const [sortOption, setSortOption] = useState("newest");
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

  const cancelCertificate = async (certID, createdAt) => {
    const now = new Date();
    const createdTime = new Date(createdAt);
    const diffInMinutes = (now - createdTime) / 60000;
    if (diffInMinutes > 30) {
      alert("Cancellation is only allowed within 30 minutes after submission");
      return;
    }

    try {
      await api.put(`/cancelcertrequest/${certID}`);
      alert("Certificate cancelled successfully!");
    } catch (error) {
      console.log("Error in cancelling certificate", error);
    }
  };

  const cancelReservation = async (reservationID, createdAt) => {
    const now = new Date();
    const createdTime = new Date(createdAt);
    const diffInMinutes = (now - createdTime) / 60000;
    if (diffInMinutes > 30) {
      alert("Cancellation is only allowed within 30 minutes after submission");
      return;
    }

    try {
      await api.put(`/cancelreservationrequest/${reservationID}`);
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
                            cancelCertificate(service._id, service.createdAt)
                          }
                        >
                          <Text>Cancel</Text>
                        </TouchableOpacity>
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
                            cancelReservation(service._id, service.createdAt)
                          }
                        >
                          <Text>Cancel</Text>
                        </TouchableOpacity>
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
