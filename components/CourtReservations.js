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

//ICONS
import { MaterialIcons } from "@expo/vector-icons";

const CourtReservations = () => {
  const insets = useSafeAreaInsets();
  const { fetchReservations, courtreservations } = useContext(InfoContext);
  const { logout, user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [reservationForm, setReservationForm] = useState({
    resID: user.resID,
    purpose: "",
    date: new Date(),
    starttime: new Date(),
    endtime: new Date(),
    amount: "",
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const purpose = ["Basketball", "Birthday Party"];
  const hourlyRate = 100;

  const handleSubmit = async () => {
    if (errorMsg) {
      Alert.alert("Error", errorMsg);
      return;
    }
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
    const newStartTime = new Date(reservationForm.date || new Date());
    newStartTime.setHours(selectedTime.getHours());
    newStartTime.setMinutes(selectedTime.getMinutes());
    newStartTime.setSeconds(0);
    newStartTime.setMilliseconds(0);

    setReservationForm((prev) => ({
      ...prev,
      starttime: newStartTime,
      amount: "",
    }));
    setShowStartTimePicker(false);
  };

  const handleEndTimeChange = (event, selectedTime) => {
    const newEndTime = new Date(reservationForm.date || new Date());
    newEndTime.setHours(selectedTime.getHours());
    newEndTime.setMinutes(selectedTime.getMinutes());
    newEndTime.setSeconds(0);
    newEndTime.setMilliseconds(0);

    const { isAvailable, conflict } = checkIfTimeSlotIsAvailable(
      reservationForm.starttime,
      newEndTime
    );

    if (!isAvailable) {
      const conflictInfo = conflict
        ? `This time slot overlaps with an existing reservation of ${conflict.start.toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )} - ${conflict.end.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}.`
        : "This time slot overlaps with another reservation.";
      Alert.alert("Error", conflictInfo);
      setReservationForm((prev) => ({ ...prev, endtime: newEndTime }));
      setShowEndTimePicker(false);
      setErrorMsg(conflictInfo);
      return;
    }

    setReservationForm((prev) => ({
      ...prev,
      endtime: newEndTime,
    }));
    setShowEndTimePicker(false);
    setErrorMsg("");
  };

  const handleDateChange = (event, selectedDate) => {
    const newDate = selectedDate;

    const prevStartTime = new Date(reservationForm.starttime);
    const prevEndTime = new Date(reservationForm.endtime);

    const updatedStarttime = new Date(newDate);
    updatedStarttime.setHours(prevStartTime.getHours() || 0);
    updatedStarttime.setMinutes(prevStartTime.getMinutes() || 0);

    const updatedEndtime = new Date(newDate);
    updatedEndtime.setHours(prevEndTime.getHours() || 0);
    updatedEndtime.setMinutes(prevEndTime.getMinutes() || 0);

    setReservationForm((prev) => ({
      ...prev,
      date: newDate,
      starttime: updatedStarttime,
      endtime: updatedEndtime,
      amount: "",
    }));
    setShowDatePicker(false);
  };

  const checkIfTimeSlotIsAvailable = (startTime, endTime) => {
    const selectedStartTime = new Date(startTime);
    const selectedEndTime = new Date(endTime);

    if (
      isNaN(selectedStartTime.getTime()) ||
      isNaN(selectedEndTime.getTime())
    ) {
      console.warn("Invalid selected time range");
      return { isAvailable: false, conflict: null };
    }

    const conflict = courtreservations
      .filter((court) => court.status === "Approved")
      .find((court) => {
        const reservedStart = new Date(court.starttime);
        const reservedEnd = new Date(court.endtime);

        if (isNaN(reservedStart.getTime()) || isNaN(reservedEnd.getTime())) {
          return false;
        }

        return (
          selectedStartTime < reservedEnd && selectedEndTime > reservedStart
        );
      });

    if (conflict) {
      return {
        isAvailable: false,
        conflict: {
          start: new Date(conflict.starttime),
          end: new Date(conflict.endtime),
        },
      };
    }

    return { isAvailable: true, conflict: null };
  };

  console.log("Date", reservationForm.date);
  console.log("Start time", reservationForm.starttime);
  console.log("End time", reservationForm.endtime);

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }} // para hindi nago-overlap sa status bar when scrolled
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            MyStyles.scrollContainer,
            {
              paddingBottom: 20, // pinalitan ko ng 20 para may margin when scrolled
              gap: 10,
            },
          ]}
        >
          <MaterialIcons
            onPress={() => navigation.navigate("BottomTabs")}
            name="arrow-back-ios"
            size={30}
            color="#04384E"
          />
          <Text style={[MyStyles.header, { marginTop: 20, marginBottom: 0 }]}>
            Court Reservation
          </Text>
          <Text style={MyStyles.formMessage}>
            Please fill out the required information for reserving a court
          </Text>

          <View style={{ gap: 15, marginVertical: 30 }}>
            <View>
              <Text style={MyStyles.inputLabel}>
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
                placeholder="Select"
                placeholderStyle={{
                  color: "#808080",
                  fontFamily: "QuicksandMedium",
                  fontSize: 16,
                }}
                selectedTextStyle={{
                  color: "#000",
                  fontFamily: "QuicksandMedium",
                  fontSize: 16,
                }}
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
                  <Text style={MyStyles.inputLabel}>
                    Date<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <View style={[MyStyles.input, MyStyles.datetimeRow]}>
                    <Text style={{ fontSize: 16 }}>
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
                  <Text style={MyStyles.inputLabel}>
                    Start Time<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <View style={[MyStyles.input, MyStyles.datetimeRow]}>
                    <Text style={{ fontSize: 16 }}>
                      {reservationForm.starttime
                        ? reservationForm.starttime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Select start time"}
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
                  <Text style={MyStyles.inputLabel}>
                    End Time<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <View style={[MyStyles.input, MyStyles.datetimeRow]}>
                    <Text style={{ fontSize: 16 }}>
                      {reservationForm.endtime
                        ? reservationForm.endtime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Select end time"}
                    </Text>

                    <MaterialIcons
                      onPress={() => setShowEndTimePicker(true)}
                      name="access-time"
                      size={24}
                      color="#C1C0C0"
                    />
                  </View>

                  {showEndTimePicker && (
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
                <View>
                  <Text style={MyStyles.inputLabel}>
                    Date<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <View style={[MyStyles.input, MyStyles.datetimeRow]}>
                    <Text>
                      {reservationForm.date?.toISOString().split("T")[0]}
                    </Text>
                    <MaterialIcons
                      onPress={() => setShowDatePicker((prev) => !prev)}
                      name="calendar-month"
                      size={24}
                      color="#C1C0C0"
                    />
                  </View>
                  {showDatePicker && (
                    <DateTimePicker
                      mode="date"
                      value={reservationForm.date}
                      display="spinner"
                      onChange={handleDateChange}
                      minimumDate={new Date()}
                      maximumDate={new Date(new Date().getFullYear(), 11, 31)}
                    />
                  )}
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>
                    Start Time<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <View style={[MyStyles.input, MyStyles.datetimeRow]}>
                    <Text>
                      {reservationForm.starttime
                        ? reservationForm.starttime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Select start time"}
                    </Text>

                    <MaterialIcons
                      onPress={() => setShowStartTimePicker((prev) => !prev)}
                      name="access-time"
                      size={24}
                      color="#C1C0C0"
                    />
                  </View>

                  {showStartTimePicker && (
                    <DateTimePicker
                      value={reservationForm.starttime || new Date()}
                      mode="time"
                      display="spinner"
                      onChange={handleStartTimeChange}
                    />
                  )}
                </View>

                <View>
                  <Text style={MyStyles.inputLabel}>
                    End Time<Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <View style={[MyStyles.input, MyStyles.datetimeRow]}>
                    <Text>
                      {reservationForm.endtime
                        ? reservationForm.endtime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Select end time"}
                    </Text>

                    <MaterialIcons
                      onPress={() => setShowEndTimePicker((prev) => !prev)}
                      name="access-time"
                      size={24}
                      color="#C1C0C0"
                    />
                  </View>

                  {showEndTimePicker && (
                    <DateTimePicker
                      value={reservationForm.endtime || new Date()}
                      mode="time"
                      display="spinner"
                      onChange={handleEndTimeChange}
                    />
                  )}
                </View>
              </>
            )}

            {/* {Platform.OS === "ios" && (
              <>
                <Text style={MyStyles.inputLabel}>
                  Date<Text style={{ color: "red" }}>*</Text>
                </Text>
                <DateTimePicker
                  value={reservationForm.date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
                <Text style={MyStyles.inputLabel}>
                  Start Time<Text style={{ color: "red" }}>*</Text>
                </Text>
                <DateTimePicker
                  value={reservationForm.starttime}
                  mode="time"
                  display="default"
                  onChange={handleStartTimeChange}
                />
                <Text style={MyStyles.inputLabel}>
                  End Time<Text style={{ color: "red" }}>*</Text>
                </Text>
                <DateTimePicker
                  value={reservationForm.endtime}
                  mode="time"
                  display="default"
                  onChange={handleEndTimeChange}
                />
              </>
            )} */}
            <View>
              <Text style={MyStyles.inputLabel}>
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
