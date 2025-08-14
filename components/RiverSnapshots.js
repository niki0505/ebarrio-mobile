import React, { useState, useEffect } from "react";
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

const RiverSnapshots = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [latest, setLatest] = useState([]);
  const [history, setHistory] = useState([]);
  const [viewMode, setViewMode] = useState("current");
  const [loading, setLoading] = useState(false);

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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons
              name="arrow-back-ios"
              size={30}
              color="white"
              style={{ marginLeft: 20, marginTop: 20 }}
            />
          </TouchableOpacity>

          <Text
            style={[
              MyStyles.header,
              {
                marginTop: 20,
                marginBottom: 0,
                textAlign: "center",
                color: "white",
              },
            ]}
          >
            River Snapshots
          </Text>

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
                    fontSize: 16,
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
                  flex: 1,
                  backgroundColor: viewMode === "history" ? "#04384E" : "white",
                  marginHorizontal: 10,
                },
              ]}
              onPress={() => setViewMode("history")}
            >
              <Text
                style={[
                  MyStyles.buttonText,
                  {
                    fontSize: 16,
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
                      fontSize: 25,
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
                      height: 250,
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
                          fontSize: 20,
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
                      fontSize: 16,
                      color: "#D3D3D3",
                      textAlign: "center",
                      fontFamily: "QuicksandSemiBold",
                      marginTop: 10,
                    }}
                  >
                    The next update will be in 10 minutes.
                  </Text>
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
                            height: 250,
                            borderRadius: 15,
                            resizeMode: "cover",
                          }}
                        />

                        <Text
                          style={{
                            fontSize: 16,
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RiverSnapshots;
