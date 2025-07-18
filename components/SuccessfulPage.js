import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";

const SuccessfulPage = () => {
  const route = useRoute();
  const { service } = route.params;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: "#fff",
        justifyContent: "center", // Center vertically
        alignItems: "center", // Center horizontally
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ScrollView
          contentContainerStyle={[
            MyStyles.scrollContainer,
            MyStyles.successScrollWrapper,
          ]}
        >
          <LottieView
            source={require("../assets/successful.json")}
            autoPlay
            loop
            style={MyStyles.successLottie}
          />

          {service === "Document" && (
            <View style={MyStyles.serviceContentWrapper}>
              <Text style={[MyStyles.header, { textAlign: "center" }]}>
                Document Request Successful
              </Text>
              <Text style={MyStyles.serviceDesc}>
                Your document request has been received by the barangay. We'll
                get back to you soon. Tap the button below to view the status.
              </Text>
            </View>
          )}

          {service === "Blotter" && (
            <View style={{ alignItems: "center" }}>
              <Text style={[MyStyles.header, { textAlign: "center" }]}>
                Blotter Report Successful
              </Text>
              <Text style={MyStyles.serviceDesc}>
                Your blotter report has been received by the barangay. We'll get
                back to you soon. Tap the button below to view the status.
              </Text>
            </View>
          )}

          {service === "Reservation" && (
            <View style={{ alignItems: "center" }}>
              <Text style={[MyStyles.header, { textAlign: "center" }]}>
                Court Reservation Request Successful
              </Text>
              <Text style={MyStyles.serviceDesc}>
                Your court reservation request has been received by the
                barangay. We'll get back to you soon. Tap the button below to
                view the status.
              </Text>
            </View>
          )}

          {service === "ResidentForm" && (
            <View style={{ alignItems: "center" }}>
              <Text style={[MyStyles.header, { textAlign: "center" }]}>
                Resident Profile Request Submitted
              </Text>
              <Text style={MyStyles.serviceDesc}>
                Your resident profile request has been submitted to the
                barangay. You will receive a confirmation message via SMS within
                3 business days.
              </Text>
            </View>
          )}

          {(service === "Reservation" ||
            service === "Document" ||
            service === "Blotter") && (
            <>
              <TouchableOpacity
                style={[MyStyles.button, { marginTop: 15 }]}
                onPress={() => navigation.navigate("Status")}
              >
                <Text style={MyStyles.buttonText}>View Status</Text>
              </TouchableOpacity>

              <Text
                style={[MyStyles.buttonText, { color: "#0E94D3" }]}
                onPress={() => navigation.navigate("BottomTabs")}
              >
                Back to Home
              </Text>
            </>
          )}

          {service === "ResidentForm" && (
            <>
              <TouchableOpacity
                style={[MyStyles.button, { marginTop: 15 }]}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={MyStyles.buttonText}>OK</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SuccessfulPage;
