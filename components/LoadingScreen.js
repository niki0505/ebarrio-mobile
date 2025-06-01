import { StyleSheet, View, Text, SafeAreaView, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";
import LottieView from "lottie-react-native";

const LoadingScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#04384E" }}
    >
      <View style={MyStyles.container}>
        <LottieView
          source={require("../assets/loading.json")}
          autoPlay
          loop
          style={{ flex: 1, width: "100%", height: "100%" }}
        ></LottieView>
      </View>
    </SafeAreaView>
  );
};

export default LoadingScreen;
