import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";
import { InfoContext } from "../context/InfoContext";
import { useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

const OfflineScreen = () => {
  const insets = useSafeAreaInsets();
  const [storedEmergencyHotlines, setStoredEmergencyHotlines] = useState([]);
  const [isEmergencyClicked, setEmergencyClicked] = useState(false);

  useEffect(() => {
    const fetchEmergencyHotlines = async () => {
      const storedHotlines = await SecureStore.getItemAsync(
        "emergencyhotlines"
      );
      if (storedHotlines) {
        setStoredEmergencyHotlines(JSON.parse(storedHotlines));
      }
    };
    fetchEmergencyHotlines();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }}
    >
      <View>
        {!isEmergencyClicked && (
          <>
            <TouchableOpacity onPress={() => setEmergencyClicked(true)}>
              <Text>Emergency Hotlines</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Safety Tips</Text>
            </TouchableOpacity>
          </>
        )}

        {isEmergencyClicked && (
          <>
            <Text onPress={() => setEmergencyClicked(false)}>Back</Text>
            {storedEmergencyHotlines.map((hotline) => (
              <View key={hotline._id}>
                <Text>{hotline.name}</Text>
                <Text>{hotline.contactnumber}</Text>
              </View>
            ))}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OfflineScreen;
