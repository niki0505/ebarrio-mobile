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
import * as SecureStore from "expo-secure-store";

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
        paddingHorizontal: 50,
      }}
    >
      <Image
        source={item.image}
        style={{
          width: 240,
          height: 240,
          resizeMode: "contain",
          marginVertical: 70,
        }}
      />
      <Text style={[MyStyles.header, { textAlign: "center" }]}>
        {item.title}
      </Text>
      <Text
        style={[MyStyles.textMedium, { marginTop: 10, textAlign: "center" }]}
      >
        {item.description}
      </Text>
    </View>
  );

  const handleLogin = async () => {
    await SecureStore.setItemAsync("hasLaunched", "true");
    navigation.navigate("Login");
  };

  const handleSignUp = async () => {
    await SecureStore.setItemAsync("hasLaunched", "true");
    navigation.navigate("Signup");
  };

  const goToNextSlide = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < slides.length) {
      flatListRef.current.scrollToIndex({ index: nextIndex });
      setCurrentIndex(nextIndex);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#04384E" }}
    >
      {/* <TouchableOpacity
        onPress={handleSignUp}
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
          Join Us
        </Text>
      </TouchableOpacity> */}
      {/* Slides Section */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FlatList
          ref={flatListRef}
          data={slides}
          horizontal
          pagingEnabled
          scrollEnabled={true}
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
            marginTop: 70,
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
          justifyContent: "center",
          alignItems: "center",
          padding: 30,
        }}
      >
        {isLastSlide ? (
          <>
            {/* Join Us Button */}
            <TouchableOpacity
              onPress={handleSignUp}
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
                Join Us
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
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
          </>
        ) : (
          /* Next Button */
          <TouchableOpacity
            onPress={goToNextSlide}
            style={MyStyles.button}
            accessibilityLabel="Go to Next Slide"
            activeOpacity={0.8}
          >
            <Text style={MyStyles.buttonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Preview;
