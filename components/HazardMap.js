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

// Importing hazard maps
import Fire from "../assets/hazard-map/fire-hazard-map.jpg";
import Flood from "../assets/hazard-map/flood-hazard-map.png";
import Earthquake from "../assets/hazard-map/earthquake-hazard-map.png";

const HazardMap = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Separate visibility states for each image
  const [visibleFire, setVisibleFire] = useState(false);
  const [visibleFlood, setVisibleFlood] = useState(false);
  const [visibleEarthquake, setVisibleEarthquake] = useState(false);

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
              backgroundColor: "#BC0F0F",
            },
          ]}
        >
          <MaterialIcons
            onPress={() => navigation.navigate("BottomTabs")}
            name="arrow-back-ios"
            size={30}
            color="#fff"
          />
          <Text
            style={[
              MyStyles.header,
              {
                marginTop: 20,
                marginBottom: 0,
                textAlign: "center",
                color: "#fff",
              },
            ]}
          >
            HAZARD MAPS
          </Text>

          {/* Fire Map */}
          <View>
            <Text
              style={{
                marginTop: 20,
                marginBottom: 0,
                textAlign: "left",
                color: "#fff",
                fontSize: 24,
                fontFamily: "REMSemiBold",
              }}
            >
              Fire
            </Text>

            <TouchableOpacity onPress={() => setVisibleFire(true)}>
              <Image
                source={Fire}
                style={{
                  width: "100%",
                  height: 200,
                  borderRadius: 15,
                }}
                resizeMode="cover"
              />
              <View style={MyStyles.mapOverlay}>
                <Text style={MyStyles.mapOverlayText}>Click to View</Text>
              </View>
            </TouchableOpacity>

            <ImageViewing
              images={[{ uri: Image.resolveAssetSource(Fire).uri }]}
              imageIndex={0}
              visible={visibleFire}
              onRequestClose={() => setVisibleFire(false)}
            />
          </View>

          {/* Flood Map */}
          <View>
            <Text
              style={{
                marginTop: 20,
                marginBottom: 0,
                textAlign: "left",
                color: "#fff",
                fontSize: 24,
                fontFamily: "REMSemiBold",
              }}
            >
              Flood
            </Text>

            <TouchableOpacity onPress={() => setVisibleFlood(true)}>
              <Image
                source={Flood}
                style={{
                  width: "100%",
                  height: 200,
                  borderRadius: 15,
                }}
                resizeMode="cover"
              />
              <View style={MyStyles.mapOverlay}>
                <Text style={MyStyles.mapOverlayText}>Click to View</Text>
              </View>
            </TouchableOpacity>

            <ImageViewing
              images={[{ uri: Image.resolveAssetSource(Flood).uri }]}
              imageIndex={0}
              visible={visibleFlood}
              onRequestClose={() => setVisibleFlood(false)}
            />
          </View>

          {/* Earthquake Map */}
          <View>
            <Text
              style={{
                marginTop: 20,
                marginBottom: 0,
                textAlign: "left",
                color: "#fff",
                fontSize: 24,
                fontFamily: "REMSemiBold",
              }}
            >
              Earthquake
            </Text>

            <TouchableOpacity onPress={() => setVisibleEarthquake(true)}>
              <Image
                source={Earthquake}
                style={{
                  width: "100%",
                  height: 200,
                  borderRadius: 15,
                }}
                resizeMode="cover"
              />
              <View style={MyStyles.mapOverlay}>
                <Text style={MyStyles.mapOverlayText}>Click to View</Text>
              </View>
            </TouchableOpacity>

            <ImageViewing
              images={[{ uri: Image.resolveAssetSource(Earthquake).uri }]}
              imageIndex={0}
              visible={visibleEarthquake}
              onRequestClose={() => setVisibleEarthquake(false)}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HazardMap;
