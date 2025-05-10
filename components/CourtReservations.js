import {
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Button,
} from "react-native";
import { useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../api";
import { InfoContext } from "../context/InfoContext";
import { MyStyles } from "./stylesheet/MyStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const CourtReservations = () => {
  const insets = useSafeAreaInsets();
  const { fetchReservations, courtreservations } = useContext(InfoContext);
  const { logout, user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [reservationForm, setReservationForm] = useState({
    resID: user.resID,
    purpose: "",
    date: new Date(),
    starttime: new Date(new Date().setHours(0, 0, 0, 0)),
    endtime: new Date(new Date().setHours(0, 0, 0, 0)),
    amount: "",
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const purpose = ["Basketball", "Birthday Party"];
  const hourlyRate = 100;

  const handleSubmit = async () => {
    try {
      await api.post("/sendreservationrequest", {
        reservationForm,
      });
      Alert.alert("Court reservation requested successfully!");
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    const calculateAmount = () => {
      const currentDate = new Date();
      const timeDifference = reservationForm.datetime - currentDate;
      const hoursDifference = Math.max(timeDifference / (1000 * 3600), 0);
      const calculatedAmount = hoursDifference * hourlyRate;
      const amount = Math.round(calculateAmount);
      setReservationForm((prev) => ({
        ...prev,
        amount: amount,
      }));
    };

    calculateAmount();
  }, [reservationForm.datetime]);

  const handleDropdownChange = ({ target }) => {
    const { name, value } = target;
    setReservationForm((prev) => ({
      ...prev,
      [name]: value.value,
    }));
  };

  const handleInputChange = (name, value) => {
    setReservationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const calculateAmount = () => {
      const startTime = new Date(reservationForm.starttime);
      const endTime = new Date(reservationForm.endtime);

      startTime.setFullYear(1970, 0, 1);
      endTime.setFullYear(1970, 0, 1);

      const timeDifference = endTime - startTime;
      const hoursDifference = Math.max(timeDifference / (1000 * 3600), 0);
      const calculatedAmount = hoursDifference * hourlyRate;
      const totalamount = "₱" + Math.round(calculatedAmount).toString();
      setReservationForm((prev) => ({
        ...prev,
        amount: totalamount,
      }));
    };

    if (reservationForm.starttime && reservationForm.endtime) {
      calculateAmount();
    }
  }, [reservationForm.starttime, reservationForm.endtime]);

  const handleStartTimeChange = (event, selectedTime) => {
    const currentDate = selectedTime || reservationForm.date;

    const updatedStarttime = new Date(currentDate);
    updatedStarttime.setHours(0, 0, 0, 0);

    const updatedEndtime = new Date(currentDate);
    updatedEndtime.setHours(0, 0, 0, 0);

    setReservationForm((prev) => ({
      ...prev,
      date: currentDate,
      starttime: updatedStarttime,
      endtime: updatedEndtime,
    }));
    setShowStartTimePicker(false);
  };

  const handleEndTimeChange = (event, selectedTime) => {
    const currentDate = selectedTime || reservationForm.date;

    const updatedStarttime = new Date(currentDate);
    updatedStarttime.setHours(0, 0, 0, 0);

    const updatedEndtime = new Date(currentDate);
    updatedEndtime.setHours(0, 0, 0, 0);

    setReservationForm((prev) => ({
      ...prev,
      date: currentDate,
      starttime: updatedStarttime,
      endtime: updatedEndtime,
    }));
    setShowEndTimePicker(false);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || reservationForm.date;

    const updatedStarttime = new Date(currentDate);
    updatedStarttime.setHours(0, 0, 0, 0);

    const updatedEndtime = new Date(currentDate);
    updatedEndtime.setHours(0, 0, 0, 0);

    setReservationForm((prev) => ({
      ...prev,
      date: currentDate,
      starttime: updatedStarttime,
      endtime: updatedEndtime,
    }));
    setShowDatePicker(false);
  };

  const checkIfTimeSlotIsAvailable = (startTime, endTime) => {
    const selectedStartTime = new Date(startTime);
    const selectedEndTime = new Date(endTime);

    return courtreservations
      .filter((reservation) => reservation.status === "Approved")
      .every((reservation) => {
        const reservedStart = new Date(reservation.starttime);
        const reservedEnd = new Date(reservation.endtime);

        if (
          (selectedStartTime >= reservedStart &&
            selectedStartTime < reservedEnd) ||
          (selectedEndTime > reservedStart && selectedEndTime <= reservedEnd)
        ) {
          return false;
        }
        return (
          selectedEndTime <= reservedStart || selectedStartTime >= reservedEnd
        );
      });
  };

  console.log(reservationForm);

  console.log("Date", reservationForm.date);
  console.log("Start time", reservationForm.starttime);
  console.log("End time", reservationForm.endtime);

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#fff" }} // para hindi nago-overlap sa status bar when scrolled
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            MyStyles.scrollContainer,
            {
              paddingTop: insets.top,
              paddingBottom: 20, // pinalitan ko ng 20 para may margin when scrolled
              gap: 10,
            },
          ]}
        >
          <MaterialIcons
            onPress={() => navigation.navigate("BottomTabs")}
            name="arrow-back-ios"
            size={24}
            color="#04384E"
          />
          <Text style={[MyStyles.header, { marginTop: 20 }]}>
            Court Reservation
          </Text>
          <Text style={MyStyles.formMessage}>
            Please fill out the required information for reserving a court
          </Text>

          <View style={{ gap: 15 }}>
            <View>
              <Text style={MyStyles.inputTitle}>
                Purpose<Text style={{ color: "red" }}>*</Text>
              </Text>
              <Dropdown
                labelField="label"
                valueField="value"
                value={reservationForm.purpose}
                data={purpose.map((purp) => ({
                  label: purp,
                  value: purp,
                }))}
                placeholder="Select purpose"
                onChange={(itemValue) =>
                  handleDropdownChange({
                    target: { name: "purpose", value: itemValue },
                  })
                }
                style={MyStyles.input}
              ></Dropdown>
            </View>

            {Platform.OS === "android" && (
              <>
                <View>
                  <Text style={MyStyles.inputTitle}>
                    Date<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <View style={MyStyles.inputWDateTime}>
                    <Text>
                      {reservationForm.date?.toISOString().split("T")[0]}
                    </Text>
                    <MaterialIcons
                      onPress={() => setShowDatePicker(true)}
                      name="calendar-month"
                      size={24}
                      color="#C1C0C0"
                    />
                  </View>
                  {showDatePicker && (
                    <DateTimePicker
                      value={reservationForm.date}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                      minimumDate={new Date()}
                    />
                  )}
                </View>

                <View>
                  <Text style={MyStyles.inputTitle}>
                    Start Time<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <View style={MyStyles.inputWDateTime}>
                    <Text>
                      {reservationForm.starttime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>

                    <MaterialIcons
                      onPress={() => setShowStartTimePicker(true)}
                      name="access-time"
                      size={24}
                      color="#C1C0C0"
                    />
                  </View>

                  {showStartTimePicker && (
                    <DateTimePicker
                      value={reservationForm.starttime}
                      mode="time"
                      display="default"
                      onChange={handleStartTimeChange}
                    />
                  )}
                </View>

                <View>
                  <Text style={MyStyles.inputTitle}>
                    End Time<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <View style={MyStyles.inputWDateTime}>
                    <Text>
                      {reservationForm.endtime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>

                    <MaterialIcons
                      onPress={() => setShowEndTimePicker(true)}
                      name="access-time"
                      size={24}
                      color="#C1C0C0"
                    />
                  </View>

                  {showStartTimePicker && (
                    <DateTimePicker
                      value={reservationForm.endtime}
                      mode="time"
                      display="default"
                      onChange={handleEndTimeChange}
                    />
                  )}
                </View>
              </>
            )}

            {Platform.OS === "ios" && (
              <>
                <Text style={MyStyles.inputTitle}>
                  Date<Text style={{ color: "red" }}>*</Text>
                </Text>
                <DateTimePicker
                  value={reservationForm.date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
                <Text style={MyStyles.inputTitle}>
                  Start Time<Text style={{ color: "red" }}>*</Text>
                </Text>
                <DateTimePicker
                  value={reservationForm.starttime}
                  mode="time"
                  display="default"
                  onChange={handleStartTimeChange}
                />
                <Text style={MyStyles.inputTitle}>
                  End Time<Text style={{ color: "red" }}>*</Text>
                </Text>
                <DateTimePicker
                  value={reservationForm.endtime}
                  mode="time"
                  display="default"
                  onChange={handleEndTimeChange}
                />
              </>
            )}
            <View>
              <Text style={MyStyles.inputTitle}>
                Amount<Text style={{ color: "red" }}>*</Text>
              </Text>
              <TextInput
                value={reservationForm.amount}
                style={[MyStyles.input, { backgroundColor: "#f0f0f0" }]}
              />
            </View>
          </View>

          <TouchableOpacity style={MyStyles.button} onPress={handleSubmit}>
            <Text style={MyStyles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CourtReservations;
