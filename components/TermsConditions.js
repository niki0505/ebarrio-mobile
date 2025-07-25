import {
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const TermsConditions = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

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
        <View style={MyStyles.loginWrapper}>
          <View style={{ flex: 0.2, alignSelf: "start", padding: 20 }}>
            <MaterialIcons
              onPress={() => navigation.navigate("Signup")}
              name="arrow-back-ios"
              size={30}
              color="#fff"
            />
          </View>

          <View
            style={[
              MyStyles.loginBottomWrapper,
              {
                flex: 3.8,
              },
            ]}
          >
            <Text style={[MyStyles.header, { alignSelf: "flex-start" }]}>
              Terms and Conditions
            </Text>

            <ScrollView
              style={{ width: "100%" }}
              contentContainerStyle={{
                alignItems: "center",
                marginTop: 20,
              }}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={MyStyles.termsTitle}>
                <Text style={{ fontFamily: "REMSemiBold" }}>
                  1. Eligibility:
                </Text>
                <Text style={{ fontFamily: "QuicksandMedium" }}>
                  {"\n"}To use the services provided, you must be a resident of
                  the Barangay or have permission to access the App. By using
                  the App, you confirm that you are at least 18 years old or
                  have parental consent.
                </Text>
              </Text>

              <Text style={MyStyles.termsTitle}>
                <Text style={{ fontFamily: "REMSemiBold" }}>
                  2. Account Registration:
                </Text>
                <Text style={{ fontFamily: "QuicksandMedium" }}>
                  {"\n"}To access certain features of the app, you will need to
                  register an account. During registration, you will be asked to
                  provide personal information such as your name, username,
                  email address, mobile number, and password. By submitting this
                  information, you agree to provide accurate and up-to-date
                  details. It is your responsibility to keep your account and
                  password secure and confidential.
                </Text>
              </Text>

              <Text style={MyStyles.termsTitle}>
                <Text style={{ fontFamily: "REMSemiBold" }}>
                  3. Session Duration:
                </Text>
                <Text style={{ fontFamily: "QuicksandMedium" }}>
                  {"\n"}Using our services means that your session will remain
                  active for a period of 30 days from the moment you log in.
                  Your session will continue without interruption until you
                  manually log out. You are responsible for logging out when you
                  are no longer using the application to ensure the security of
                  your account. After 30 days, your session will automatically
                  expire requiring you to login again to continue using our
                  services.
                </Text>
              </Text>

              <Text style={MyStyles.termsTitle}>
                <Text style={{ fontFamily: "REMSemiBold" }}>
                  4. User Conduct:
                </Text>
                <Text style={{ fontFamily: "QuicksandMedium" }}>
                  {"\n"}You agree not to use the App for any unlawful or
                  prohibited purpose, including, but not limited to:
                  {"\n"}- Posting or transmitting any unlawful, harmful,
                  abusive, or inappropriate content.
                  {"\n"}- Engaging in fraudulent activities.
                  {"\n"}- Misusing the App’s features, including reporting false
                  emergency situations or tampering with disaster response
                  information.
                  {"\n"}- Violating any local, state, or national laws.
                </Text>
              </Text>

              <Text style={MyStyles.termsTitle}>
                <Text style={{ fontFamily: "REMSemiBold" }}>
                  5. Privacy and Data Protection:
                </Text>
                <Text style={{ fontFamily: "QuicksandMedium" }}>
                  {"\n"}Your privacy is important to us. We collect and use your
                  personal data in accordance with our Privacy Policy, which is
                  available within the App and on the Barangay’s official
                  website. By using the App, you consent to the collection and
                  processing of your personal information as described in the
                  Privacy Policy.
                </Text>
              </Text>

              <Text style={MyStyles.termsTitle}>
                <Text style={{ fontFamily: "REMSemiBold" }}>
                  6. Notifications:
                </Text>
                <Text style={{ fontFamily: "QuicksandMedium" }}>
                  {"\n"}By enabling notifications for this application, you
                  consent to receiving important updates, alerts, and
                  emergency-related communications. These notifications may
                  include, but are not limited to:
                  {"\n"}- Barangay announcements
                  {"\n"}- Request Status Updates
                  {"\n"}- Emergency alerts and SOS confirmations
                </Text>
              </Text>

              <Text style={MyStyles.termsTitle}>
                <Text style={{ fontFamily: "REMSemiBold" }}>
                  7. Location Access:
                </Text>
                <Text style={{ fontFamily: "QuicksandMedium" }}>
                  {"\n"}By using this application, you grant permission for the
                  app to access the location of your device in the event of an
                  SOS emergency. Your location is collected and used in
                  accordance with our Privacy Policy. You can revoke location
                  access at any time by changing the permissions in your device
                  settings.
                </Text>
              </Text>

              <Text style={MyStyles.termsTitle}>
                <Text style={{ fontFamily: "REMSemiBold" }}>
                  8. Disaster Response Features:
                </Text>
                <Text style={{ fontFamily: "QuicksandMedium" }}>
                  {"\n"}The App allows residents to access emergency protocols,
                  report emergencies, and receive updates. By using these
                  features, you agree to:
                  {"\n"}- Provide accurate and truthful information when
                  reporting incidents or emergencies.
                  {"\n"}- Acknowledge that any misuse of disaster response
                  features could lead to delays or errors in the delivery of
                  essential services.
                </Text>
              </Text>

              <Text style={MyStyles.termsTitle}>
                <Text style={{ fontFamily: "REMSemiBold" }}>
                  9. Intellectual Property:
                </Text>
                <Text style={{ fontFamily: "QuicksandMedium" }}>
                  {"\n"}The App, including its design, visuals, logos, and
                  information, is the eBarrio's intellectual property and is
                  protected by applicable laws. You are not permitted to
                  reproduce, distribute, modify, or create copied versions of
                  the App without the Barangay's prior written agreement.
                </Text>
              </Text>

              <Text style={MyStyles.termsTitle}>
                <Text style={{ fontFamily: "REMSemiBold" }}>
                  10. Third-Party Services:
                </Text>
                <Text style={{ fontFamily: "QuicksandMedium" }}>
                  {"\n"}The App may contain links to third-party websites or
                  services that are not within our control. We are not liable
                  for the content, privacy policies, or services offered by
                  these third parties. We recommend reviewing the terms and
                  conditions for any third-party services you use.
                </Text>
              </Text>

              <Text style={MyStyles.termsTitle}>
                <Text style={{ fontFamily: "REMSemiBold" }}>
                  11. Disclaimer of Liability:
                </Text>
                <Text style={{ fontFamily: "QuicksandMedium" }}>
                  {"\n"}While the App aims to provide accurate and up-to-date
                  information, we offer no guarantees about the data's accuracy,
                  reliability, or completeness. You acknowledge that you are
                  using the App at your own risk. The Barangay and its
                  administrators will not be held liable for any damages or
                  losses resulting from your use of the App or reliance on the
                  information included within.
                </Text>
              </Text>

              <Text style={MyStyles.termsTitle}>
                <Text style={{ fontFamily: "REMSemiBold" }}>
                  12. App Availability:
                </Text>
                <Text style={{ fontFamily: "QuicksandMedium" }}>
                  {"\n"}The App may be offline temporarily due to maintenance or
                  technical issues. The Barangay is not responsible for service
                  disruptions, and it will take reasonable steps to restore
                  service as quickly as possible.
                </Text>
              </Text>

              <Text style={MyStyles.termsTitle}>
                <Text style={{ fontFamily: "REMSemiBold" }}>
                  13. Updates and Modifications:
                </Text>
                <Text style={{ fontFamily: "QuicksandMedium" }}>
                  {"\n"}The Barangay reserves the right to modify, update, or
                  discontinue the App at any time without prior notice. Any
                  changes to these terms will be posted within the App, and your
                  continued use of the App indicates your acceptance of the new
                  terms.
                </Text>
              </Text>

              <Text style={MyStyles.termsTitle}>
                <Text style={{ fontFamily: "REMSemiBold" }}>
                  14. Governing Law:
                </Text>
                <Text style={{ fontFamily: "QuicksandMedium" }}>
                  {"\n"}These terms and conditions will be regulated and
                  enforced in line with the laws of Barangay Aniban 2 and the
                  Philippines. Any issues arising from the use of the App will
                  be resolved exclusively by the courts of Barangay Aniban 2.
                </Text>
              </Text>

              <Text style={MyStyles.termsTitle}>
                <Text style={{ fontFamily: "REMSemiBold" }}>
                  15. Termination:
                </Text>
                <Text style={{ fontFamily: "QuicksandMedium" }}>
                  {"\n"}If you violate these Terms of Service or engage in
                  misconduct, we may suspend or terminate your access to the
                  App. Upon termination, all rights granted to you under these
                  terms will be terminated, and you must stop using the App.
                </Text>
              </Text>

              <Text
                style={[
                  MyStyles.termsTitle,
                  {
                    marginBottom: 40,
                  },
                ]}
              >
                <Text style={{ fontFamily: "REMSemiBold" }}>
                  16. Contact Information:
                </Text>
                <Text style={{ fontFamily: "QuicksandMedium" }}>
                  {"\n"}For questions or concerns regarding these terms and
                  conditions, or if you need support related to the App, please
                  contact us at:{"\n"} {"\n"}{" "}
                  <Text style={MyStyles.termsEmailContact}>
                    Email: brgyaniban2bacoorcity@gmail.com
                  </Text>
                  {"\n"}{" "}
                  <Text style={MyStyles.termsEmailContact}>
                    Telephone: 476-9397
                  </Text>
                </Text>
              </Text>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TermsConditions;
