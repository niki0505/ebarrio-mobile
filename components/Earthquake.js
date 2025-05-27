import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";
import ImageViewing from "react-native-image-viewing";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MyStyles } from "./stylesheet/MyStyles";

import SafetyTips from "../assets/earthquake/earthquake-safety-tips.png";
import QuickTips from "../assets/earthquake/earthquake-quick-tips.png";

// Icons
import { MaterialIcons } from "@expo/vector-icons";

// Convert local images to URI for viewing/downloading
const quickTipsUri = Image.resolveAssetSource(QuickTips).uri;
const safetyTipsUri = Image.resolveAssetSource(SafetyTips).uri;

const Earthquake = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [visible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [{ uri: quickTipsUri }, { uri: safetyTipsUri }];
  const openImageViewer = (index) => {
    setCurrentIndex(index);
    setIsVisible(true);
  };

  const downloadImage = async () => {
    const imageToDownload = images[currentIndex].uri;
    const fileUri =
      FileSystem.documentDirectory + `downloaded-image-${currentIndex + 1}.jpg`;

    try {
      const download = await FileSystem.downloadAsync(imageToDownload, fileUri);
      Alert.alert("Download complete", `Saved to: ${download.uri}`);
    } catch (error) {
      Alert.alert("Download failed", error.message);
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
              gap: 20,
            },
          ]}
        >
          <MaterialIcons
            onPress={() => navigation.navigate("BottomTabs")}
            name="arrow-back-ios"
            size={30}
            color="#04384E"
          />

          <Text
            style={[MyStyles.header, { textAlign: "center", color: "#04384E" }]}
          >
            Quick Tips
          </Text>
          <TouchableOpacity onPress={() => openImageViewer(0)}>
            <Image
              source={QuickTips}
              style={{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>

          <Text
            style={[MyStyles.header, { textAlign: "center", color: "#04384E" }]}
          >
            Safety Tips
          </Text>
          <TouchableOpacity onPress={() => openImageViewer(1)}>
            <Image
              source={SafetyTips}
              style={{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Image Viewer Modal */}
      <ImageViewing
        images={images}
        imageIndex={currentIndex}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
        FooterComponent={({ imageIndex }) => (
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 30,
              left: 20,
              backgroundColor: "#ffffffaa",
              padding: 10,
              borderRadius: 10,
            }}
            onPress={downloadImage}
          >
            <Text style={{ color: "#000" }}>Download</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default Earthquake;
