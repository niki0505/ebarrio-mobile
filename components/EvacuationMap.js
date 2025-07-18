import React, { useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import ImageViewing from "react-native-image-viewing";

const EvacuationMap = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [visible, setIsVisible] = useState(false);
  const evacuationMap = Image.resolveAssetSource(
    require("../assets/hazard-map/evacuation-map.png")
  ).uri;

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
              gap: 10,
              backgroundColor: "#BC0F0F",
            },
          ]}
        >
          <MaterialIcons
            onPress={() => navigation.navigate("Readiness")}
            name="arrow-back-ios"
            size={30}
            color="#fff"
          />
          <Text style={[MyStyles.header, MyStyles.evacuationHeader]}>
            EVACUATION MAP
          </Text>

          <View style={{ flexDirection: "column", gap: 20 }}>
            <Text style={MyStyles.evacuationSubHeader}>
              Barangay Aniban 2 School
            </Text>

            <TouchableOpacity onPress={() => setIsVisible(true)}>
              <Image
                source={require("../assets/hazard-map/evacuation-map.png")}
                style={MyStyles.evacuationImg}
                resizeMode="cover"
              />
              <View style={MyStyles.mapOverlay}>
                <Text style={MyStyles.mapOverlayText}>Click to View</Text>
              </View>
            </TouchableOpacity>

            <ImageViewing
              images={[{ uri: evacuationMap }]}
              imageIndex={0}
              visible={visible}
              onRequestClose={() => setIsVisible(false)}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EvacuationMap;
