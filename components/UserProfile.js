import { Text, View, SafeAreaView, ScrollView } from "react-native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

//ICONSS
import Entypo from "@expo/vector-icons/Entypo";

const UserProfile = () => {
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
      <View style={MyStyles.notScrollWrapper}>
        <View
          style={[
            MyStyles.burgerWrapper,
            { paddingHorizontal: 20, paddingVertical: 10 },
          ]}
        >
          <Entypo
            name="menu"
            size={35}
            color="#04384E"
            onPress={() => navigation.openDrawer()}
            style={MyStyles.burgerIcon}
          />
          <View>
            <Text style={MyStyles.header}>Profile</Text>
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          contentContainerStyle={[
            MyStyles.scrollContainer,
            {
              paddingBottom: insets.bottom + 70,
              gap: 10,
            },
          ]}
        ></ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;
