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
  ActivityIndicator,
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
import { RFPercentage } from "react-native-responsive-fontsize";

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
  // const [chatMessages, setChatMessages] = useState([]);
  const { fetchChats, chatMessages, setChatMessages } = useContext(InfoContext);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchFAQs();
      await fetchChats();
      setLoading(false);
    };

    loadData();
  }, []);

  console.log(JSON.stringify(chatMessages, null, 2));

  //ASSIGNING CHAT (SUCCESS)
  useEffect(() => {
    if (!socket) return;

    const handleConnectAndRequest = () => {
      console.log("📡 Socket connected:", socket.id);
      socket.emit("request_bot_chat", { userID: user.userID });
    };

    const handleChatAssigned = (chatData) => {
      console.log("✅ Chat assigned:", chatData);
      const {
        _id,
        participants,
        responder,
        messages,
        status,
        isCleared,
        isBot,
        createdAt,
        updatedAt,
      } = chatData;

      setAssignedAdmin(participants.find((p) => p !== user.userID) || null);

      setRoomId(_id);
      if (isBot) {
        setIsChat(false);
      } else {
        setIsChat(true);
      }
      setIsEnded(false);

      setChatMessages((prev) => {
        const chatExists = prev.some((chat) => chat._id === _id);
        if (chatExists) return prev;

        return [
          ...prev,
          {
            _id,
            participants,
            responder,
            messages,
            status,
            isCleared,
            isBot,
            createdAt,
            updatedAt,
          },
        ];
      });
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
      socket.off("request_bot_chat");
    };
  }, [socket]);
  console.log(isEnded);
  console.log(isChat);
  console.log(roomId);

  //RECEIVING CHAT (SUCCESS)
  useEffect(() => {
    if (!socket) {
      console.log("🚫 Socket not ready");
      return;
    }

    const handleReceive = async ({ from, to, message, timestamp, roomId }) => {
      console.log("📥 Message received:", { from, to, message, roomId });
      if (user.userID === from) {
        return;
      }

      setChatMessages((prevChats) => {
        const chatIndex = prevChats.findIndex((chat) => chat._id === roomId);

        const newMessage = {
          from,
          to,
          message,
          timestamp,
        };

        if (chatIndex !== -1) {
          // Existing chat, append message
          const updatedChats = [...prevChats];
          updatedChats[chatIndex] = {
            ...updatedChats[chatIndex],
            messages: [...updatedChats[chatIndex].messages, newMessage],
          };
          return updatedChats;
        } else {
          // New chat, create full structure
          const newChat = {
            _id: roomId,
            participants: [from, to],
            responder: null,
            messages: [newMessage],
            status: "Active",
            isCleared: false,
            isBot: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return [...prevChats, newChat];
        }
      });
    };

    const handleChatEnded = ({ chatID, timestamp }) => {
      console.log("📴 Chat ended detected:", chatID);
      setIsEnded(true);
      setIsChat(false);
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
      from: user.userID,
      to: assignedAdmin,
      message: text,
      timestamp: new Date(),
      roomId,
    };

    socket.emit("send_message", newMessage);

    setChatMessages((prevChats) => {
      const existingChat = prevChats.find((chat) => chat._id === roomId);

      if (existingChat) {
        return prevChats.map((chat) => {
          if (chat._id === roomId) {
            return {
              ...chat,
              messages: [...chat.messages, newMessage],
            };
          }
          return chat;
        });
      } else {
        return [
          ...prevChats,
          {
            _id: roomId,
            participants: [user.userID, assignedAdmin],
            messages: [newMessage],
          },
        ];
      }
    });
    setMessage("");
  };

  const getBotReply = (question) => {
    const found = FAQs.find((faq) => faq.question === question);
    return found ? found.answer : "Let me get someone to assist you with that.";
  };

  const handleDefaultMessage = (question) => {
    setModalVisible(false);

    const userMessage = {
      from: user.userID,
      to: "000000000000000000000000",
      message: question,
      timestamp: new Date(),
      roomId,
    };

    socket.emit("send_message", userMessage);

    // Auto-response from bot
    const botReply = {
      from: "000000000000000000000000",
      to: user.userID,
      message: getBotReply(question),
      timestamp: new Date(),
      roomId,
    };

    setTimeout(() => {
      socket.emit("send_message", botReply);
    }, 1000);

    // Append user message to UI
    setChatMessages((prevChats) => {
      const existingChat = prevChats.find((chat) => chat._id === roomId);
      if (existingChat) {
        return prevChats.map((chat) => {
          if (chat._id === roomId) {
            return {
              ...chat,
              messages: [...chat.messages, userMessage],
            };
          }
          return chat;
        });
      } else {
        return [
          ...prevChats,
          {
            _id: roomId,
            participants: [user.userID, assignedAdmin],
            messages: [userMessage],
          },
        ];
      }
    });
  };

  const handleOptionClick = async (id) => {
    if (id === "faq") {
      setModalVisible(true);
    } else if (id === "chat") {
      setIsChat(true);
      socket.emit("request_chat");
    }
  };

  const allMessages = chatMessages
    .flatMap((chat) =>
      chat.messages.map((msg) => ({
        ...msg,
        chatId: chat._id,
      }))
    )
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const sendIconSize = RFPercentage(3);

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
            <MaterialIcons
              onPress={() => navigation.navigate("BottomTabs")}
              name="arrow-back-ios"
              size={30}
              style={[MyStyles.backArrow]}
            />
            <Image source={Aniban2Logo} style={MyStyles.announcementLogo} />
            <View>
              <Text style={[MyStyles.announcementUploader, { marginLeft: 5 }]}>
                Barangay Aniban II
              </Text>
            </View>
          </View>
        </View>

        {/* Chat Messages ScrollView */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, marginHorizontal: 20, marginTop: 10 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {loading ? (
            <View style={{ paddingVertical: 30, alignItems: "center" }}>
              <ActivityIndicator size="large" color="#04384E" />
            </View>
          ) : (
            allMessages.map((msg, i) => {
              const senderID = msg.from?._id || msg.from;
              const isEndedMsg = msg.message === "This chat has ended.";
              const isUser = senderID === user.userID;
              const isBot = senderID === "000000000000000000000000";

              let parsedMessage = null;
              try {
                parsedMessage = JSON.parse(msg.message);
              } catch (err) {}

              const isButtonMessage = parsedMessage?.type === "button";

              const currentDate = new Date(msg.timestamp).toDateString();
              const previousMsg = allMessages[i - 1];
              const previousDate = previousMsg
                ? new Date(previousMsg.timestamp).toDateString()
                : null;
              const showDateHeader = currentDate !== previousDate;

              return (
                <View key={`${msg.timestamp}-${i}`}>
                  {showDateHeader && (
                    <View style={{ alignSelf: "center", marginBottom: 10 }}>
                      <Text
                        style={{
                          fontSize: RFPercentage(1.6),
                          color: "#999",
                          fontWeight: "600",

                          paddingHorizontal: 12,
                          paddingVertical: 4,
                          borderRadius: 20,
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Text>
                    </View>
                  )}

                  <View
                    style={{
                      alignSelf: isEndedMsg
                        ? "center"
                        : isUser
                        ? "flex-end"
                        : "flex-start",
                      backgroundColor: isEndedMsg
                        ? "transparent"
                        : isUser
                        ? "#0E94D3"
                        : "#b3b3b3",
                      borderRadius: isEndedMsg ? 0 : 12,
                      padding: isEndedMsg ? 4 : 10,
                      marginBottom: 8,
                      maxWidth: "80%",
                    }}
                  >
                    {isButtonMessage ? (
                      <View style={{ gap: 10 }}>
                        {parsedMessage.options.map((option) => (
                          <TouchableOpacity
                            key={option.id}
                            onPress={() => handleOptionClick(option.id)}
                            style={{
                              backgroundColor: "#fff",
                              paddingVertical: 10,
                              paddingHorizontal: 15,
                              borderRadius: 8,
                              marginTop: 5,
                            }}
                          >
                            <Text style={{ color: "#333", fontWeight: "bold" }}>
                              {option.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : (
                      <>
                        <Text
                          style={{
                            fontSize: RFPercentage(1.6),
                            fontFamily: "QuicksandSemiBold",
                            fontStyle: isEndedMsg ? "italic" : "normal",
                            color: isEndedMsg ? "#666" : "#fff",
                          }}
                        >
                          {msg.message}
                        </Text>
                        {!isEndedMsg && (
                          <Text
                            style={{
                              fontSize: RFPercentage(1),
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
                      </>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Bottom Chat Bar */}
        {isChat && !isEnded && (
          <View
            style={{
              backgroundColor: "#fff",
              flexDirection: "row",
              alignItems: "center",
              borderTopWidth: 1,
              borderColor: "#ccc",
              padding: 15,
            }}
          >
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message..."
              style={{
                flex: 1,
                height: RFPercentage(4),
                backgroundColor: "#f2f2f2",
                borderRadius: 20,
                paddingHorizontal: 15,
                fontSize: RFPercentage(1.6),
              }}
            />

            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => handleSendMessage(message)}
            >
              <MaterialIcons name="send" size={sendIconSize} color="#04384E" />
            </TouchableOpacity>
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
                style={{
                  fontSize: RFPercentage(1.6),
                  fontWeight: "bold",
                  marginBottom: 10,
                }}
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
                  <Text style={{ fontSize: RFPercentage(1.6) }}>
                    {msg.question}
                  </Text>
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
