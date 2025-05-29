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
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const SuccessfulPage = () => {
  const route = useRoute();
  const { service } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

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
          {service === "Document" && (
            <View>
              <Text style={MyStyles.header}>Document Request Successful</Text>
              <Text>
                Your document request has been received by the barangay. We'll
                get back to you soon. Tap the button below to view the status.
              </Text>
            </View>
          )}

          {service === "Blotter" && (
            <View>
              <Text style={MyStyles.header}>Blotter Report Successful</Text>
              <Text>
                Your blotter report has been received by the barangay. We'll get
                back to you soon. Tap the button below to view the status.
              </Text>
            </View>
          )}

          {service === "Reservation" && (
            <View>
              <Text style={MyStyles.header}>
                Court Reservation Request Successful
              </Text>
              <Text>
                Your court reservation request has been received by the
                barangay. We'll get back to you soon. Tap the button below to
                view the status.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={MyStyles.button}
            onPress={() => navigation.navigate("Status")}
          >
            <Text style={MyStyles.buttonText}>View Status</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SuccessfulPage;
