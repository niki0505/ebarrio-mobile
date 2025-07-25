import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

//ICONS
import { MaterialIcons } from "@expo/vector-icons";

const SafetyTips = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const disasters = [
    {
      image: require("../assets/disasters/earthquake.png"),
      title: "EARTHQUAKE",
      subtitle: "Ground Movement",
      route: "Earthquake",
    },
    {
      image: require("../assets/disasters/fire.png"),
      title: "FIRE",
      subtitle: "Rapid Burning",
      route: "Fire",
    },
    {
      image: require("../assets/disasters/flood.png"),
      title: "FLOOD",
      subtitle: "Water Rise",
      route: "Flood",
    },
    {
      image: require("../assets/disasters/typhoon.png"),
      title: "TYPHOON",
      subtitle: "Wind and Rain",
      route: "Typhoon",
    },
  ];

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
            Disaster Safety
          </Text>

          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View style={{ width: "100%", gap: 60 }}>
              {[0, 1].map((row) => (
                <View
                  key={row}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  {disasters.slice(row * 2, row * 2 + 2).map((item, index) => (
                    <TouchableOpacity
                      key={`${row}-${index}`}
                      style={MyStyles.safetyTipsCard}
                      onPress={
                        item.route
                          ? () => navigation.navigate(item.route)
                          : null
                      }
                    >
                      <Image
                        source={item.image}
                        style={[MyStyles.readinessImg, { marginRight: 0 }]}
                      />
                      <Text style={[MyStyles.readinessTitle, { fontSize: 18 }]}>
                        {item.title}
                      </Text>
                      <Text style={MyStyles.readinessSubTitle}>
                        {item.subtitle}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SafetyTips;
