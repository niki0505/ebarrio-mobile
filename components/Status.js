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
  const [sortOption, setSortOption] = useState("All");
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
    if (diffInMinutes > 50) {
      alert("Cancellation is only allowed within 50 minutes after submission");
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
    if (diffInMinutes > 50) {
      alert("Cancellation is only allowed within 50 minutes after submission");
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

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return { color: "#E5DE48", label: "Pending" };
      case "Issued":
        return { color: "#00BA00", label: "Issued" };
      case "Rejected":
        return { color: "#BC0F0F", label: "Rejected" };
      case "Resolved":
        return { color: "#00BA00", label: "Resolved" };
      case "Cancelled":
        return { color: "#BC0F0F", label: "Cancelled" };
      case "Approved":
        return { color: "#00BA00", label: "Approved" };
      case "Settled":
        return { color: "#00BA00", label: "Settled" };
      case "Scheduled":
        return { color: "#00BA00", label: "Settled" };
      default:
        return { color: "#aaa", label: status };
    }
  };

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const truncateDetails = (details, wordLimit = 25) => {
    const words = details.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + " ..."
      : details;
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
              { label: "Documents", value: "documents" },
              { label: "Blotters", value: "blotters" },
              { label: "Reservations", value: "reservations" },
            ]}
            labelField="label"
            valueField="value"
            value={sortOption}
            placeholder={sortOption}
            onChange={(item) => setSortOption(item.value)}
            style={{
              backgroundColor: "#fff",
              width: "50%",
              height: 50,
              borderWidth: 1,
              borderColor: "#ACACAC",
              borderRadius: 5,
              alignSelf: "flex-end",
              paddingHorizontal: 4,
            }}
            selectedTextStyle={{
              color: "#04384E",
              fontFamily: "QuicksandSemiBold",
              fontSize: 15,
            }}
          />

          <Dialog.Container
            visible={certVisible}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Dialog.Title
              style={{
                fontFamily: "REMBold",
                fontSize: 20,
                color: "#04384E",
              }}
            >
              Cancel Certificate
            </Dialog.Title>

            <Dialog.Input
              placeholder="Enter your reason here..."
              onChangeText={(text) => setCertReason(text)}
              style={{
                fontFamily: "QuicksandMedium",
                fontSize: 16,
                color: "#04384E",
              }}
              placeholderTextColor="#808080"
            />

            <Dialog.Button
              label="Cancel"
              onPress={() => setCertVisible(false)}
              style={{ color: "#0E94D3", fontFamily: "REMSemiBold" }}
            />
            <Dialog.Button
              label="Submit"
              onPress={cancelCertificate}
              style={{ color: "#BC0F0F", fontFamily: "REMSemiBold" }}
            />
          </Dialog.Container>

          <Dialog.Container
            visible={reservationVisible}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Dialog.Title
              style={{
                fontFamily: "QuicksandBold",
                fontSize: 20,
                color: "#04384E",
                marginBottom: 10,
              }}
            >
              Cancel Court Reservation
            </Dialog.Title>

            <Dialog.Input
              placeholder="Enter your reason here..."
              onChangeText={(text) => setReservationReason(text)}
              style={{
                fontFamily: "QuicksandMedium",
                fontSize: 16,
                padding: 10,
                color: "#04384E",
              }}
              placeholderTextColor="#808080"
            />

            <Dialog.Button
              label="Cancel"
              onPress={() => setReservationVisible(false)}
              color="#666"
            />
            <Dialog.Button
              label="Submit"
              onPress={cancelReservation}
              color="#BC0F0F"
            />
          </Dialog.Container>

          {sortedServices.map((service, index) => {
            const isExpanded = expandedIndex === index;
            const status = getStatusStyle(service.status);

            return (
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
                {/* Status and Time Row */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: status.color,
                        marginRight: 6,
                      }}
                    />
                    <Text
                      style={{
                        color: "#04384E",
                        fontSize: 15,
                        fontFamily: "REMMedium",
                      }}
                    >
                      {status.label}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 15, color: "#808080" }}>
                    {dayjs(service.createdAt).fromNow()}
                  </Text>
                </View>

                <View
                  style={{
                    borderBottomColor: "#ccc",
                    borderBottomWidth: 1,
                    marginVertical: 10,
                  }}
                />

                {/* Title + Chevron */}
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onPress={() => toggleExpand(index)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: "REMSemiBold",
                      color: "#04384E",
                    }}
                  >
                    {service.type}
                  </Text>
                  <MaterialIcons
                    name={
                      isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"
                    }
                    size={24}
                    color="#04384E"
                  />
                </TouchableOpacity>

                {/* Default visible summary based on type */}
                <View style={{ marginTop: 5 }}>
                  {service.type === "Certificate" && (
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: "QuicksandMedium",
                        color: "#808080",
                      }}
                    >
                      {service.typeofcertificate}
                    </Text>
                  )}
                  {service.type === "Reservation" && (
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: "QuicksandMedium",
                        color: "#808080",
                      }}
                    >
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
                  )}
                  {service.type === "Blotter" && (
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "flex-start",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: "QuicksandSemiBold",
                          color: "#808080",
                        }}
                      >
                        Details:
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: "QuicksandMedium",
                          color: "#808080",
                          marginLeft: 5,
                          flexShrink: 1,
                          textAlign: "justify",
                        }}
                      >
                        {!isExpanded
                          ? truncateDetails(service.details)
                          : service.details}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Expanded content */}
                {isExpanded && (
                  <View style={{ marginTop: 10 }}>
                    {service.type === "Certificate" && (
                      <>
                        {(service.typeofcertificate === "Barangay Indigency" ||
                          service.typeofcertificate ===
                            "Barangay Clearance") && (
                          <>
                            <View
                              style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignItems: "flex-start",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: "QuicksandBold",
                                  color: "#04384E",
                                }}
                              >
                                Purpose:
                              </Text>
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: "QuicksandMedium",
                                  color: "#04384E",
                                  marginLeft: 5,
                                  flexShrink: 1,
                                  textAlign: "justify",
                                }}
                              >
                                {service.purpose}
                              </Text>
                            </View>

                            <View
                              style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignItems: "flex-start",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: "QuicksandBold",
                                  color: "#04384E",
                                }}
                              >
                                Amount:
                              </Text>
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: "QuicksandMedium",
                                  color: "#04384E",
                                  marginLeft: 5,
                                  flexShrink: 1,
                                  textAlign: "justify",
                                }}
                              >
                                {service.amount}
                              </Text>
                            </View>
                          </>
                        )}

                        {service.typeofcertificate ===
                          "Barangay Business Clearance" && (
                          <>
                            <View
                              style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignItems: "flex-start",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: "QuicksandBold",
                                  color: "#04384E",
                                }}
                              >
                                Business Name:
                              </Text>
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: "QuicksandMedium",
                                  color: "#04384E",
                                  marginLeft: 5,
                                  flexShrink: 1,
                                  textAlign: "justify",
                                }}
                              >
                                {service.businessname}
                              </Text>
                            </View>

                            <View
                              style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignItems: "flex-start",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: "QuicksandBold",
                                  color: "#04384E",
                                }}
                              >
                                Line of Business:
                              </Text>
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: "QuicksandMedium",
                                  color: "#04384E",
                                  marginLeft: 5,
                                  flexShrink: 1,
                                  textAlign: "justify",
                                }}
                              >
                                {service.lineofbusiness}
                              </Text>
                            </View>

                            <View
                              style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignItems: "flex-start",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: "QuicksandBold",
                                  color: "#04384E",
                                }}
                              >
                                Location of Business:
                              </Text>
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: "QuicksandMedium",
                                  color: "#04384E",
                                  marginLeft: 5,
                                  flexShrink: 1,
                                  textAlign: "justify",
                                }}
                              >
                                {service.locationofbusiness ===
                                "Resident's Address"
                                  ? userDetails.resID.address
                                  : service.locationofbusiness}
                              </Text>
                            </View>
                          </>
                        )}

                        {service.status === "Pending" &&
                          new Date(service.createdAt) >=
                            new Date(new Date().getTime() - 50 * 60 * 1000) && (
                            <TouchableOpacity
                              onPress={() =>
                                certCancelClick(service._id, service.createdAt)
                              }
                              style={[
                                MyStyles.button,
                                { marginTop: 15, backgroundColor: "#BC0F0F" },
                              ]}
                            >
                              <Text style={MyStyles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                          )}

                        {service.status === "Rejected" && (
                          <View
                            style={{
                              flexDirection: "row",
                              flexWrap: "wrap",
                              alignItems: "flex-start",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 15,
                                fontFamily: "QuicksandBold",
                                color: "#04384E",
                              }}
                            >
                              Remarks:
                            </Text>
                            <Text
                              style={{
                                fontSize: 15,
                                fontFamily: "QuicksandMedium",
                                color: "#04384E",
                                marginLeft: 5,
                                flexShrink: 1,
                                textAlign: "justify",
                              }}
                            >
                              {service.remarks}
                            </Text>
                          </View>
                        )}
                      </>
                    )}

                    {service.type === "Reservation" && (
                      <>
                        {service.status === "Pending" &&
                          new Date(service.createdAt) >=
                            new Date(new Date().getTime() - 50 * 60 * 1000) && (
                            <TouchableOpacity
                              onPress={() =>
                                reservationCancelClick(
                                  service._id,
                                  service.createdAt
                                )
                              }
                              style={[
                                MyStyles.button,
                                { marginTop: 15, backgroundColor: "#BC0F0F" },
                              ]}
                            >
                              <Text style={MyStyles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                          )}
                        {service.status === "Rejected" && (
                          <View
                            style={{
                              flexDirection: "row",
                              flexWrap: "wrap",
                              alignItems: "flex-start",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 15,
                                fontFamily: "QuicksandBold",
                                color: "#04384E",
                              }}
                            >
                              Remarks:
                            </Text>
                            <Text
                              style={{
                                fontSize: 15,
                                fontFamily: "QuicksandMedium",
                                color: "#04384E",
                                marginLeft: 5,
                                flexShrink: 1,
                                textAlign: "justify",
                              }}
                            >
                              {service.remarks}
                            </Text>
                          </View>
                        )}
                      </>
                    )}

                    {service.type === "Blotter" && (
                      <>
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "flex-start",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              fontFamily: "QuicksandBold",
                              color: "#04384E",
                            }}
                          >
                            Type of the Complaint:
                          </Text>
                          <Text
                            style={{
                              fontSize: 15,
                              fontFamily: "QuicksandMedium",
                              color: "#04384E",
                              marginLeft: 5,
                              flexShrink: 1,
                              textAlign: "justify",
                            }}
                          >
                            {service.typeofthecomplaint}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "flex-start",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              fontFamily: "QuicksandBold",
                              color: "#04384E",
                            }}
                          >
                            Subject:
                          </Text>
                          <Text
                            style={{
                              fontSize: 15,
                              fontFamily: "QuicksandMedium",
                              color: "#04384E",
                              marginLeft: 5,
                              flexShrink: 1,
                              textAlign: "justify",
                            }}
                          >
                            {service.subjectID
                              ? `${service.subjectID.firstname} ${service.subjectID.lastname}`
                              : service.subjectname}
                          </Text>
                        </View>

                        {(service.status === "Scheduled" ||
                          service.status === "Settled") && (
                          <View
                            style={{
                              flexDirection: "row",
                              flexWrap: "wrap",
                              alignItems: "flex-start",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 15,
                                fontFamily: "QuicksandBold",
                                color: "#04384E",
                              }}
                            >
                              Meeting:
                            </Text>
                            <Text
                              style={{
                                fontSize: 15,
                                fontFamily: "QuicksandMedium",
                                color: "#04384E",
                                marginLeft: 5,
                                flexShrink: 1,
                                textAlign: "justify",
                              }}
                            >
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
                          </View>
                        )}

                        {service.status === "Settled" && (
                          <>
                            <View
                              style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignItems: "flex-start",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: "QuicksandBold",
                                  color: "#04384E",
                                }}
                              >
                                Witness:
                              </Text>
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: "QuicksandMedium",
                                  color: "#04384E",
                                  marginLeft: 5,
                                  flexShrink: 1,
                                  textAlign: "justify",
                                }}
                              >
                                {service.witnessID
                                  ? `${service.witnessID.firstname} ${service.witnessID.lastname}`
                                  : service.witnessname}
                              </Text>
                            </View>

                            <View
                              style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignItems: "flex-start",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: "QuicksandBold",
                                  color: "#04384E",
                                }}
                              >
                                Agreement:
                              </Text>
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: "QuicksandMedium",
                                  color: "#04384E",
                                  marginLeft: 5,
                                  flexShrink: 1,
                                  textAlign: "justify",
                                }}
                              >
                                {!isExpanded
                                  ? truncateWords(service.agreementdetails)
                                  : service.agreementdetails}
                              </Text>
                            </View>
                          </>
                        )}

                        {service.status === "Rejected" && (
                          <View
                            style={{
                              flexDirection: "row",
                              flexWrap: "wrap",
                              alignItems: "flex-start",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 15,
                                fontFamily: "QuicksandBold",
                                color: "#04384E",
                              }}
                            >
                              Remarks:
                            </Text>
                            <Text
                              style={{
                                fontSize: 15,
                                fontFamily: "QuicksandMedium",
                                color: "#04384E",
                                marginLeft: 5,
                                flexShrink: 1,
                                textAlign: "justify",
                              }}
                            >
                              {service.remarks}
                            </Text>
                          </View>
                        )}
                      </>
                    )}
                  </View>
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
