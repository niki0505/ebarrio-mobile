import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import React, { useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MyStyles } from "./stylesheet/MyStyles";

const Preview = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = Dimensions.get("window");

  const slides = [
    {
      id: "1",
      image: require("../assets/preview/firstprev.png"),
      title: "Request and Track",
      description:
        "Get barangay clearances, reserve court, file blotters, and track them in real-time — \n all in one place.",
    },
    {
      id: "2",
      image: require("../assets/preview/secondprev.png"),
      title: "Always Prepared and Safe",
      description:
        "Access SOS, emergency hotlines, river monitoring, and disaster tips anytime.",
    },
    {
      id: "3",
      image: require("../assets/preview/thirdprev.png"),
      title: "Stay Updated",
      description:
        "Get the latest announcements, events, and weather info straight from your barangay.",
    },
  ];

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
  };

  const isLastSlide = currentIndex === slides.length - 1;

  const renderItem = ({ item }) => (
    <View
      style={{
        width,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
      }}
    >
      <Image
        source={item.image}
        style={{
          width: 240,
          height: 240,
          marginBottom: 20,
          resizeMode: "contain",
        }}
      />
      <Text
        style={{
          fontSize: 25,
          fontWeight: "bold",
          color: "#04384E",
          marginBottom: 10,
          fontFamily: "REM-Bold",
        }}
      >
        {item.title}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: "#ACACAC",
          textAlign: "center",
        }}
      >
        {item.description}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#fff" }}
    >
      {/* Skip Button */}
      <View style={{ alignItems: "flex-end", padding: 16 }}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={{ color: "#0E94D3", fontWeight: "bold" }}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slides Section */}
      <View
        style={{ height: 420, justifyContent: "center", alignItems: "center" }}
      >
        <FlatList
          ref={flatListRef}
          data={slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onMomentumScrollEnd={handleScroll}
        />

        {/* Pagination Dots */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          {slides.map((_, index) => (
            <View
              key={index}
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 5,
                backgroundColor: currentIndex === index ? "#0E94D3" : "#ccc",
              }}
            />
          ))}
        </View>
      </View>

      {/* Bottom Buttons */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
          padding: 30,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Signup")}
          style={MyStyles.button}
          accessibilityLabel="Join the community"
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 24,
            }}
          >
            {isLastSlide ? "Get Started" : "Join Us"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          accessibilityLabel="Go to Login"
        >
          <Text
            style={{
              color: "#0E94D3",
              fontWeight: "bold",
              fontSize: 24,
              marginTop: 15,
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Preview;
