import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Aniban2Logo from "../assets/aniban2logo.png";

const Chat = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const scrollViewRef = useRef();

  const defaultMessages = [
    "What types of documents do you provide?",
    "What are the office hours?",
    "Where is the barangay hall located?",
  ];

  // Send a message and add to chat list
  const handleSendMessage = (text) => {
    if (text.trim() === "") return;
    setChatMessages((prev) => [...prev, { from: "user", text }]);
    setMessage("");
  };

  // When a default message is picked
  const handleDefaultMessage = (msg) => {
    setModalVisible(false);
    handleSendMessage(msg);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            marginLeft: 10,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("BottomTabs")}>
            <MaterialIcons name="arrow-back-ios" size={30} color="#04384E" />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <Image
              source={Aniban2Logo}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 10,
              }}
            />
            <View>
              <Text
                style={{
                  fontSize: 18,
                  color: "#04384E",
                  fontWeight: "bold",
                }}
              >
                Barangay Aniban II
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 2,
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "green",
                    marginRight: 5,
                  }}
                />
                <Text style={{ fontSize: 12, color: "gray" }}>Active</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Chat Messages ScrollView */}
        <ScrollView
          style={{ flex: 1, marginHorizontal: 10, marginTop: 10 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {chatMessages.map((msg, index) => (
            <View
              key={index}
              style={{
                alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
                backgroundColor: msg.from === "user" ? "#0E94D3" : "#E5E5EA",
                borderRadius: 15,
                padding: 10,
                marginBottom: 10,
                maxWidth: "80%",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#fff",
                  fontFamily: "QuicksandSemiBold",
                }}
              >
                {msg.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Bottom Chat Bar */}
        <View
          style={{
            padding: 10,
            backgroundColor: "#fff",
            flexDirection: "row",
            alignItems: "center",
            borderTopWidth: 1,
            borderColor: "#ccc",
            paddingBottom: 20,
          }}
        >
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            style={{
              flex: 1,
              height: 40,
              backgroundColor: "#f2f2f2",
              borderRadius: 20,
              paddingHorizontal: 15,
            }}
          />

          {/* Send Button */}
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => handleSendMessage(message)}
          >
            <MaterialIcons name="send" size={24} color="#04384E" />
          </TouchableOpacity>

          {/* Menu Icon */}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{ marginLeft: 10 }}
          >
            <MaterialIcons name="more-vert" size={24} color="#04384E" />
          </TouchableOpacity>
        </View>

        {/* Modal for Default Messages */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "flex-end",
            }}
            onPress={() => setModalVisible(false)}
          >
            <View
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
              >
                Choose a quick question:
              </Text>
              {defaultMessages.map((msg, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleDefaultMessage(msg)}
                  style={{
                    paddingVertical: 10,
                    borderBottomWidth:
                      index !== defaultMessages.length - 1 ? 1 : 0,
                    borderBottomColor: "#ddd",
                  }}
                >
                  <Text style={{ fontSize: 15 }}>{msg}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
