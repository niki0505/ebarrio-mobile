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
import { useState, useRef, useContext, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import Aniban2Logo from "../assets/aniban2logo.png";
import { InfoContext } from "../context/InfoContext";
import * as SecureStore from "expo-secure-store";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";

const Chat = () => {
  const { fetchFAQs, FAQs, fetchActive } = useContext(InfoContext);
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const insets = useSafeAreaInsets();
  const [roomId, setRoomId] = useState(null);
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [assignedAdmin, setAssignedAdmin] = useState(null);
  const [isChat, setIsChat] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [botMessages, setBotMessages] = useState([
    {
      from: "admin",
      text: "Hi! How can I help you today? 😊",
    },
    {
      id: 2,
      from: "admin",
      type: "button",
      options: [
        { id: "faq", label: "Ask a Question" },
        { id: "chat", label: "Chat with the Barangay" },
      ],
    },
  ]);
  // const [chatMessages, setChatMessages] = useState([]);
  const { fetchChats, chatMessages, setChatMessages } = useContext(InfoContext);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const scrollViewRef = useRef();

  useEffect(() => {
    fetchFAQs();
    fetchChats();
  }, []);

  useEffect(() => {
    if (chatMessages.length !== 0) {
      setIsChat(true);
    }
  }, [chatMessages]);

  console.log(JSON.stringify(chatMessages, null, 2));

  useEffect(() => {
    if (!socket || !isChat) return;

    const handleConnectAndRequest = () => {
      console.log("📡 Socket connected:", socket.id);
      socket.emit("request_chat");
    };

    const handleChatAssigned = ({ userID, roomId }) => {
      console.log("✅ Assigned admin ID received:", userID);
      console.log("📦 Room ID received:", roomId);
      setAssignedAdmin(userID);
      setRoomId(roomId);
    };

    if (socket.connected) {
      handleConnectAndRequest();
    } else {
      socket.once("connect", handleConnectAndRequest);
    }

    socket.on("chat_assigned", handleChatAssigned);

    return () => {
      socket.off("connect", handleConnectAndRequest);
      socket.off("chat_assigned", handleChatAssigned);
    };
  }, [socket, isChat]);

  useEffect(() => {
    if (!socket) {
      console.log("🚫 Socket not ready");
      return;
    }

    const handleReceive = async ({ from, to, message, timestamp, roomId }) => {
      console.log("📥 Message received:", { from, to, message, roomId });

      setChatMessages((prevChats) => {
        const chatIndex = prevChats.findIndex((chat) => chat._id === roomId);

        if (chatIndex !== -1) {
          const updatedChats = [...prevChats];
          updatedChats[chatIndex] = {
            ...updatedChats[chatIndex],
            messages: [
              ...updatedChats[chatIndex].messages,
              { from, to, message, timestamp, _id: Date.now().toString() },
            ],
          };
          return updatedChats;
        } else {
          // New chat, placeholder with only this message
          return [
            ...prevChats,
            {
              _id: roomId,
              participants: [from, to],
              messages: [
                { from, to, message, timestamp, _id: Date.now().toString() },
              ],
            },
          ];
        }
      });
    };

    const handleChatEnded = ({ chatID, timestamp }) => {
      console.log("📴 Chat ended detected:", chatID);
      setIsEnded(true);
    };

    socket.on("receive_message", handleReceive);
    socket.on("chat_ended", handleChatEnded);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("chat_ended", handleChatEnded);
    };
  }, [socket]);

  // Send a message and add to chat list
  const handleSendMessage = (text) => {
    if (!assignedAdmin || text.trim() === "") return;
    console.log("Sending to:", assignedAdmin);

    const newMessage = {
      from: { _id: user.userID },
      to: assignedAdmin,
      message: text,
      timestamp: new Date(),
      roomId,
    };

    socket.emit("send_message", newMessage);

    setChatMessages((prevChats) =>
      prevChats.map((chat) => {
        if (chat._id === roomId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
          };
        }
        return chat;
      })
    );
    setMessage("");
  };

  // When a default message is picked
  const handleDefaultMessage = (question) => {
    setModalVisible(false);
    const selectedFAQ = FAQs.find((faq) => faq.question === question);

    if (!selectedFAQ) return;
    setBotMessages((prev) => [
      ...prev,
      { from: "user", text: question },
      { from: "admin", text: selectedFAQ.answer },
    ]);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: "#DCE5EB",
      }}
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
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, marginHorizontal: 10, marginTop: 10 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {!isChat ? (
            <>
              {botMessages.map((msg, index) => {
                if (msg.type === "button") {
                  return (
                    <View
                      key={index}
                      style={{
                        alignSelf: "flex-start",
                        marginBottom: 10,
                        flexDirection: "column",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      {msg.options.map((opt) => (
                        <TouchableOpacity
                          key={opt.id}
                          onPress={async () => {
                            if (opt.id === "faq") {
                              setModalVisible(true);
                            }
                            if (opt.id === "chat") {
                              setIsChat(true);
                              const active = await fetchActive();

                              // if (active?.Secretary || active?.Clerk) {
                              //   setChatMessages([
                              //     {
                              //       id: Date.now(),
                              //       from: "admin",
                              //       text: "You're now chatting with a Barangay Personnel. How can we help you?",
                              //     },
                              //   ]);
                              // } else {
                              //   setChatMessages([
                              //     {
                              //       id: Date.now(),
                              //       from: "admin",
                              //       text: "No Barangay Personnel is currently online. Please leave a message and we’ll get back to you.",
                              //     },
                              //   ]);
                              // }
                            }
                          }}
                          style={{
                            backgroundColor: "#04384E",
                            borderRadius: 10,
                            paddingVertical: 8,
                            paddingHorizontal: 15,
                            marginRight: 8,
                            marginBottom: 5,
                          }}
                        >
                          <Text style={{ color: "#fff", fontSize: 14 }}>
                            {opt.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  );
                }

                // Default text message rendering
                return (
                  <View
                    key={index}
                    style={{
                      alignSelf:
                        msg.from === "user" ? "flex-end" : "flex-start",
                      backgroundColor:
                        msg.from === "user" ? "#0E94D3" : "#b3b3b3",
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
                );
              })}
            </>
          ) : (
            <>
              {chatMessages.map((chat) => {
                return (
                  <View
                    key={chat._id}
                    style={{
                      borderRadius: 15,
                      padding: 15,
                      marginBottom: 20,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 5,
                      elevation: 3,
                    }}
                  >
                    {chat.messages.map((msg) => (
                      <View
                        key={msg._id}
                        style={{
                          alignSelf:
                            msg.message === "This chat has ended."
                              ? "center"
                              : msg.from._id === user.userID
                              ? "flex-end"
                              : "flex-start",
                          backgroundColor:
                            msg.message === "This chat has ended."
                              ? "transparent"
                              : msg.from._id === user.userID
                              ? "#0E94D3"
                              : "#b3b3b3",
                          borderRadius:
                            msg.message === "This chat has ended." ? 0 : 12,
                          padding:
                            msg.message === "This chat has ended." ? 4 : 10,
                          marginBottom: 8,
                          maxWidth: "80%",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 15,
                            color: "#fff",
                            fontFamily: "QuicksandSemiBold",
                            fontStyle:
                              msg.from._id === "system" ? "italic" : "normal",
                            color: msg.from._id === "system" ? "#666" : "#fff",
                          }}
                        >
                          {msg.message}
                        </Text>
                        {msg.message !== "This chat has ended." && (
                          <Text
                            style={{
                              fontSize: 10,
                              color: "#eee",
                              marginTop: 5,
                            }}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString(
                              undefined,
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                );
              })}
            </>
          )}
        </ScrollView>

        {/* Bottom Chat Bar */}
        {isChat && !isEnded && (
          <View
            style={{
              padding: 10,
              backgroundColor: "#fff",
              flexDirection: "row",
              alignItems: "center",
              borderTopWidth: 1,
              borderColor: "#ccc",
              paddingBottom: 30,
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

            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => handleSendMessage(message)}
            >
              <MaterialIcons name="send" size={24} color="#04384E" />
            </TouchableOpacity>

            {/* <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{ marginLeft: 10 }}
            >
              <MaterialIcons name="more-vert" size={24} color="#04384E" />
            </TouchableOpacity> */}
          </View>
        )}

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
              {FAQs.map((msg, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleDefaultMessage(msg.question)}
                  style={{
                    paddingVertical: 10,
                    borderBottomWidth: index !== msg.length - 1 ? 1 : 0,
                    borderBottomColor: "#ddd",
                  }}
                >
                  <Text style={{ fontSize: 15 }}>{msg.question}</Text>
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
