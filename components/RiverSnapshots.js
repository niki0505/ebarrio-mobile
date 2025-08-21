import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import api from "../api";
import { RFPercentage } from "react-native-responsive-fontsize";
import Dialog from "react-native-dialog";
import { AuthContext } from "../context/AuthContext";
import AlertModal from "./AlertModal";

const RiverSnapshots = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [latest, setLatest] = useState([]);
  const [history, setHistory] = useState([]);
  const [viewMode, setViewMode] = useState("current");
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertResidentsMessage, setAlertResidentsMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const { user } = useContext(AuthContext);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  useEffect(() => {
    const fetchLatest = async () => {
      setLoading(true); // 🔵 Start loading
      try {
        const res = await api.get("/latestsnapshot");
        setLatest(res.data.latest);
        setHistory(res.data.history);
      } catch (err) {
        console.error("❌ Could not fetch snapshot:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest(); // Initial fetch
    const interval = setInterval(fetchLatest, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    setAlertVisible(false);
    setTimeout(() => {
      setIsConfirmModalVisible(true);
    }, 500);
  };

  const alertResidents = async () => {
    setIsConfirmModalVisible(false);
    try {
      const res = await api.post("/alertresidents", {
        alertResidentsMessage,
      });
      console.log("You have sent an alert successfully.");
    } catch (error) {
      const response = error.response;
      if (response && response.data) {
        console.log("❌ Error status:", response.status);
        setAlertMessage(response.data.message || "Something went wrong.");
        setIsAlertModalVisible(true);
        setAlertVisible(false);
      } else {
        console.log("❌ Network or unknown error:", error.message);
        setAlertMessage("An unexpected error occurred.");
        setIsAlertModalVisible(true);
        setAlertVisible(false);
      }
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
              backgroundColor: "#BC0F0F",
            },
          ]}
        >
          <Dialog.Container
            visible={alertVisible}
            // onDismiss={() => setIsConfirmModalVisible(true)}
            contentStyle={MyStyles.statusDialogWrapper}
          >
            <Dialog.Title style={MyStyles.cancelReserve}>
              Alert Residents
            </Dialog.Title>

            <Dialog.Input
              placeholder="Enter your message here..."
              onChangeText={(text) => setAlertResidentsMessage(text)}
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
              onPress={() => setAlertVisible(false)}
              color="#666"
            />
            <Dialog.Button
              label="Submit"
              onPress={handleSubmit}
              color="#BC0F0F"
            />
          </Dialog.Container>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialIcons
              onPress={() => navigation.goBack()}
              name="arrow-back-ios"
              style={[MyStyles.backArrow, { color: "#fff" }]}
            />

            <Text
              style={[MyStyles.servicesHeader, { marginTop: 0, color: "#fff" }]}
            >
              River Snapshots
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 30,
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={[
                MyStyles.button,
                {
                  height: RFPercentage(6),
                  flex: 1,
                  backgroundColor: viewMode === "current" ? "#04384E" : "white",
                  marginHorizontal: 10,
                },
              ]}
              onPress={() => setViewMode("current")}
            >
              <Text
                style={[
                  MyStyles.buttonText,
                  {
                    fontSize: RFPercentage(1.8),
                    color: viewMode === "current" ? "white" : "#04384E",
                    textAlign: "center",
                  },
                ]}
              >
                Current
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                MyStyles.button,
                {
                  height: RFPercentage(6),
                  flex: 1,
                  backgroundColor: viewMode === "history" ? "#04384E" : "white",
                  marginHorizontal: 10,
                  alignItems: "center",
                },
              ]}
              onPress={() => setViewMode("history")}
            >
              <Text
                style={[
                  MyStyles.buttonText,
                  {
                    fontSize: RFPercentage(1.8),
                    color: viewMode === "history" ? "white" : "#04384E",
                    textAlign: "center",
                  },
                ]}
              >
                History
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={{ paddingVertical: 30, alignItems: "center" }}>
              <ActivityIndicator size="large" color="#04384E" />
            </View>
          ) : viewMode === "current" ? (
            <View style={{ alignItems: "center" }}>
              {latest.url && (
                <>
                  <Text
                    style={{
                      color: "white",
                      fontSize: RFPercentage(2.5),
                      fontFamily: "REMBold",
                      textAlign: "center",
                      marginTop: 50,
                    }}
                  >
                    Zapote River
                  </Text>
                  <Image
                    source={{ uri: latest.url }}
                    style={{
                      width: "100%",
                      height: RFPercentage(30),
                      borderRadius: 15,
                      resizeMode: "cover",
                      marginTop: 20,
                    }}
                  />
                  <View
                    style={{
                      marginTop: 20,
                      backgroundColor: "white",
                      padding: 5,
                      borderRadius: 10,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#BC0F0F",
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: RFPercentage(2),
                          color: "white",
                          fontFamily: "QuicksandBold",
                          textAlign: "center",
                        }}
                      >
                        CCTV Snapshot as of{" "}
                        {latest.datetime?.split(" at ")[1] || "Unknown Time"}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontSize: RFPercentage(1.6),
                      color: "#D3D3D3",
                      textAlign: "center",
                      fontFamily: "QuicksandSemiBold",
                      marginTop: 10,
                    }}
                  >
                    The next update will be in 10 minutes.
                  </Text>
                  {user.role !== "Resident" && (
                    <TouchableOpacity
                      onPress={() => setAlertVisible(true)}
                      style={MyStyles.button}
                    >
                      <Text style={MyStyles.buttonText}>Alert Residents</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          ) : (
            <View style={{ marginTop: 50, flexDirection: "column", gap: 30 }}>
              {history && (
                <>
                  {history.map((snap, index) => {
                    return (
                      <View key={index}>
                        <Image
                          source={{ uri: snap.url }}
                          style={{
                            width: "100%",
                            height: RFPercentage(30),
                            borderRadius: 15,
                            resizeMode: "cover",
                          }}
                        />

                        <Text
                          style={{
                            fontSize: RFPercentage(1.6),
                            color: "white",
                            fontFamily: "QuicksandBold",
                            textAlign: "right",
                          }}
                        >
                          CCTV Snapshot as of{" "}
                          {snap.datetime?.split(" at ")[1] || "Unknown Time"}
                        </Text>
                      </View>
                    );
                  })}
                </>
              )}
            </View>
          )}
        </ScrollView>
        <AlertModal
          isVisible={isAlertModalVisible}
          message={alertMessage}
          onClose={() => setIsAlertModalVisible(false)}
        />
        <AlertModal
          isVisible={isConfirmModalVisible}
          isConfirmationModal={true}
          title="Alert Residents?"
          message="Are you sure you want to alert residents?"
          onClose={() => setIsConfirmModalVisible(false)}
          onConfirm={alertResidents}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RiverSnapshots;
