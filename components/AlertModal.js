import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const AlertModal = ({
  isVisible,
  message,
  title = "Error!",
  isSuccess,
  onClose,
  onConfirm,
  isResidentConfirmationModal = false,
  isConfirmationModal = false,
}) => {
  if (!isVisible) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            width: 300,
            alignItems: "center",
          }}
        >
          {isSuccess ? (
            // Success Modal
            <>
              <LottieView
                source={require("../assets/lottieanimation/check.json")}
                autoPlay
                loop
                style={{
                  width: 100,
                  height: 100,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "REMBold",
                  marginVertical: 20,
                  color: "#808080",
                }}
              >
                Success!
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "#808080",
                  marginBottom: 30,
                  fontFamily: "QuicksandMedium",
                  textAlign: "center",
                }}
              >
                {message}
              </Text>
            </>
          ) : isResidentConfirmationModal ? (
            // Resident Confirmation Modal
            <>
              <LottieView
                source={require("../assets/lottieanimation/X.json")}
                autoPlay
                loop
                style={{
                  width: 100,
                  height: 100,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "REMBold",
                  marginVertical: 20,
                  color: "#808080",
                }}
              >
                {title}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#808080",
                  marginBottom: 20,
                  fontFamily: "QuicksandMedium",
                  textAlign: "center",
                }}
              >
                {message}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  gap: 10,
                }}
              >
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    borderWidth: 3,
                    borderColor: "#BC0F0F",
                    padding: 10,
                    borderRadius: 10,
                    marginHorizontal: 10,
                    width: 100,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#BC0F0F",
                      fontSize: 16,
                      fontFamily: "QuicksandBold",
                      textAlign: "center",
                    }}
                  >
                    CANCEL
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onConfirm}
                  style={{
                    borderWidth: 3,
                    borderColor: "#BC0F0F",
                    backgroundColor: "#BC0F0F",
                    padding: 10,
                    borderRadius: 10,
                    marginHorizontal: 10,
                    width: 100,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontFamily: "QuicksandBold",
                      textAlign: "center",
                    }}
                  >
                    CONFIRM
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : isConfirmationModal ? (
            // Confirmation Modal (Help Icon)
            <>
              <Ionicons name="help-circle-outline" size={70} color="#BC0F0F" />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "REMBold",
                  marginVertical: 10,
                  color: "#808080",
                }}
              >
                {title}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#808080",
                  marginBottom: 20,
                  fontFamily: "QuicksandMedium",
                  textAlign: "center",
                }}
              >
                {message}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  gap: 10,
                }}
              >
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    borderWidth: 3,
                    borderColor: "#BC0F0F",
                    padding: 10,
                    borderRadius: 10,
                    marginHorizontal: 10,
                    width: 100,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#BC0F0F",
                      fontSize: 16,
                      fontFamily: "QuicksandBold",
                      textAlign: "center",
                    }}
                  >
                    CANCEL
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onConfirm}
                  style={{
                    borderWidth: 3,
                    borderColor: "#BC0F0F",
                    backgroundColor: "#BC0F0F",
                    padding: 10,
                    borderRadius: 10,
                    marginHorizontal: 10,
                    width: 100,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontFamily: "QuicksandBold",
                      textAlign: "center",
                    }}
                  >
                    CONFIRM
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            // Error Modal
            <>
              <LottieView
                source={require("../assets/lottieanimation/X.json")}
                autoPlay
                loop
                style={{
                  width: 100,
                  height: 100,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "REMBold",
                  marginVertical: 20,
                  color: "#808080",
                }}
              >
                {title}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "#808080",
                  marginBottom: 30,
                  fontFamily: "QuicksandMedium",
                  textAlign: "center",
                }}
              >
                {message}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  gap: 10,
                }}
              >
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    backgroundColor: "#FF0000",
                    padding: 10,
                    borderRadius: 10,
                    marginHorizontal: 10,
                    width: 150,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontFamily: "QuicksandBold",
                      textAlign: "center",
                    }}
                  >
                    TRY AGAIN
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;
