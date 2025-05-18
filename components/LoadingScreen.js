import { StyleSheet, View, Text, SafeAreaView, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";

const LoadingScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }}
    >
      <View>
        <Text style={[MyStyles.header, { marginBottom: 0 }]}>Loading...</Text>
      </View>
    </SafeAreaView>
  );
};

export default LoadingScreen;
