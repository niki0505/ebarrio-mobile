import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../api";
import { InfoContext } from "../context/InfoContext";
import { MyStyles } from "./stylesheet/MyStyles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";

const CourtReservations = () => {
  const insets = useSafeAreaInsets();
  const { fetchReservations, courtreservations } = useContext(InfoContext);
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const [reservationForm, setReservationForm] = useState({
    resID: user.resID || "",
    purpose: "",
    date: [],
    times: {},
    amount: "",
  });

  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [selectedDateForTime, setSelectedDateForTime] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const purpose = ["Basketball", "Birthday Party"];
  const hourlyRate = 100;

  const markedDates = reservationForm.date.reduce((acc, d) => {
    acc[d] = { selected: true, selectedColor: "#00adf5" };
    return acc;
  }, {});

  const onDayPress = (day) => {
    const dateStr = day.dateString;

    setReservationForm((prev) => {
      let newDates;
      let newTimes = { ...prev.times };

      if (prev.date.includes(dateStr)) {
        newDates = prev.date.filter((d) => d !== dateStr);
        const { [dateStr]: removed, ...restTimes } = newTimes;
        newTimes = restTimes;

        if (selectedDateForTime === dateStr) {
          if (newDates.length > 0) {
            setSelectedDateForTime(newDates[0]);
          } else {
            setSelectedDateForTime(null);
          }
        }
      } else {
        newDates = [...prev.date, dateStr];
        if (!newTimes[dateStr]) {
          newTimes[dateStr] = {
            starttime: new Date(1970, 0, 1, 9, 0),
            endtime: new Date(1970, 0, 1, 10, 0),
          };
        }
        setSelectedDateForTime(dateStr);
      }

      return {
        ...prev,
        date: newDates,
        times: newTimes,
      };
    });
  };

  useEffect(() => {
    let totalHours = 0;

    for (const date of reservationForm.date) {
      const times = reservationForm.times[date];
      if (times) {
        let startTime = new Date(times.starttime);
        let endTime = new Date(times.endtime);
        startTime.setFullYear(1970, 0, 1);
        endTime.setFullYear(1970, 0, 1);
        if (endTime > startTime) {
          totalHours += (endTime - startTime) / (1000 * 3600);
        }
      }
    }

    const totalAmount =
      totalHours > 0 ? "₱" + Math.round(totalHours * hourlyRate) : "";

    setReservationForm((prev) => ({
      ...prev,
      amount: totalAmount,
    }));
  }, [reservationForm.times, reservationForm.date]);

  const onPurposeChange = (value) => {
    setReservationForm((prev) => ({
      ...prev,
      purpose: value,
    }));
  };

  const onStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime && selectedDateForTime) {
      setReservationForm((prev) => ({
        ...prev,
        times: {
          ...prev.times,
          [selectedDateForTime]: {
            ...prev.times[selectedDateForTime],
            starttime: selectedTime,
          },
        },
        amount: "",
      }));
      setErrorMsg("");
    }
  };

  const onEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (selectedTime && selectedDateForTime) {
      const dateStart = new Date(selectedDateForTime);

      const startDateTime = new Date(dateStart);
      startDateTime.setHours(
        reservationForm.times[selectedDateForTime].starttime.getHours()
      );
      startDateTime.setMinutes(
        reservationForm.times[selectedDateForTime].starttime.getMinutes()
      );

      const endDateTime = new Date(dateStart);
      endDateTime.setHours(selectedTime.getHours());
      endDateTime.setMinutes(selectedTime.getMinutes());

      if (endDateTime <= startDateTime) {
        Alert.alert("Error", "End time must be after start time.");
        setErrorMsg("End time must be after start time.");
        return;
      }

      setReservationForm((prev) => ({
        ...prev,
        times: {
          ...prev.times,
          [selectedDateForTime]: {
            ...prev.times[selectedDateForTime],
            endtime: selectedTime,
          },
        },
        amount: "",
      }));
      setErrorMsg("");
    }
  };

  const handleSubmit = async () => {
    console.log(reservationForm);
    if (reservationForm.date.length === 0) {
      Alert.alert("Error", "Please select at least one date.");
      return;
    }
    if (!reservationForm.purpose) {
      Alert.alert("Error", "Please select a purpose.");
      return;
    }
    if (errorMsg) {
      Alert.alert("Error", errorMsg);
      return;
    }

    const combineDateAndTime = (dateStr, timeObj) => {
      const date = new Date(dateStr);
      date.setHours(timeObj.getHours());
      date.setMinutes(timeObj.getMinutes());
      date.setSeconds(timeObj.getSeconds());
      date.setMilliseconds(timeObj.getMilliseconds());
      return date.toISOString();
    };

    // Collect all conflicts for all dates
    const conflicts = [];
    const preparedTimes = {};

    for (const date of reservationForm.date) {
      const times = reservationForm.times[date];
      if (!times) {
        Alert.alert("Error", `Times not set for ${date}.`);
        return;
      }
      const dateStart = new Date(date);
      const startDateTime = new Date(dateStart);
      startDateTime.setHours(times.starttime.getHours());
      startDateTime.setMinutes(times.starttime.getMinutes());

      const endDateTime = new Date(dateStart);
      endDateTime.setHours(times.endtime.getHours());
      endDateTime.setMinutes(times.endtime.getMinutes());

      if (endDateTime <= startDateTime) {
        Alert.alert("Error", `End time must be after start time on ${date}.`);
        return;
      }

      preparedTimes[date] = {
        starttime: combineDateAndTime(date, times.starttime),
        endtime: combineDateAndTime(date, times.endtime),
      };

      const conflict = courtreservations
        .filter(
          (r) =>
            r.status === "Approved" &&
            r.times?.[date]?.starttime &&
            r.times?.[date]?.endtime
        )
        .find((r) => {
          const reservedStart = new Date(r.times[date].starttime);
          const reservedEnd = new Date(r.times[date].endtime);

          return startDateTime < reservedEnd && endDateTime > reservedStart;
        });

      if (conflict) {
        conflicts.push({
          date,
          start: new Date(conflict.times[date].starttime),
          end: new Date(conflict.times[date].endtime),
        });
      }
    }

    if (conflicts.length > 0) {
      // Build a detailed alert message for all conflicts
      const conflictMessages = conflicts
        .map(
          (c) =>
            `${c.date} (${c.start.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })} - ${c.end.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })})`
        )
        .join("\n");

      Alert.alert(
        "Error",
        `Time slots overlap with existing reservations on:\n${conflictMessages}`
      );
      return;
    }
    try {
      await api.post("/sendreservationrequest", {
        reservationForm: {
          ...reservationForm,
          times: preparedTimes,
        },
      });
      navigation.navigate("SuccessfulPage", {
        service: "Reservation",
      });
    } catch (error) {
      console.log("Reservation submission error:", error);
      Alert.alert("Error", "Failed to submit reservation. Please try again.");
    }
  };

  const renderDateSelector = () => {
    if (reservationForm.date.length === 0) return null;
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
          marginTop: 10,
        }}
      >
        {reservationForm.date.map((date) => (
          <TouchableOpacity
            key={date}
            onPress={() => setSelectedDateForTime(date)}
            style={{
              padding: 8,
              borderRadius: 5,
              backgroundColor:
                selectedDateForTime === date ? "#00adf5" : "#ddd",
            }}
          >
            <Text
              style={{ color: selectedDateForTime === date ? "#fff" : "#000" }}
            >
              {date}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  const currentTimes = selectedDateForTime
    ? reservationForm.times[selectedDateForTime]
    : null;

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            MyStyles.scrollContainer,
            { paddingBottom: 20, gap: 10 },
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

          <View style={{}}>
            <Text style={MyStyles.inputLabel}>
              Purpose <Text style={{ color: "red" }}>*</Text>
            </Text>
            <Dropdown
              labelField="label"
              valueField="value"
              value={reservationForm.purpose}
              data={purpose.map((p) => ({ label: p, value: p }))}
              onChange={(item) => onPurposeChange(item.value)}
              placeholder="Select purpose"
              style={MyStyles.input}
            />

            <Text style={[MyStyles.inputLabel, { marginTop: 15 }]}>
              Select Date(s) <Text style={{ color: "red" }}>*</Text>
            </Text>
            <Calendar
              markingType={"multi-dot"}
              markedDates={markedDates}
              onDayPress={onDayPress}
              minDate={new Date()}
            />

            {renderDateSelector()}

            {selectedDateForTime && (
              <>
                <Text style={MyStyles.inputLabel}>
                  Start Time for {selectedDateForTime}
                  <Text style={{ color: "red" }}>*</Text>
                </Text>

                <View style={[MyStyles.input, MyStyles.datetimeRow]}>
                  <Text>
                    {currentTimes?.starttime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
                    value={currentTimes?.starttime || new Date()}
                    mode="time"
                    is24Hour={false}
                    display="spinner"
                    onChange={onStartTimeChange}
                  />
                )}

                <Text style={MyStyles.inputLabel}>
                  End Time for {selectedDateForTime}
                  <Text style={{ color: "red" }}>*</Text>
                </Text>

                <View style={[MyStyles.input, MyStyles.datetimeRow]}>
                  <Text>
                    {currentTimes?.endtime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
                    value={currentTimes?.endtime || new Date()}
                    mode="time"
                    is24Hour={false}
                    display="spinner"
                    onChange={onEndTimeChange}
                  />
                )}
              </>
            )}

            <Text style={[MyStyles.inputLabel, { marginTop: 15 }]}>Amount</Text>
            <TextInput
              editable={false}
              value={reservationForm.amount}
              style={MyStyles.input}
              placeholder="Amount"
            />

            <TouchableOpacity
              style={[MyStyles.button, { marginTop: 30 }]}
              onPress={handleSubmit}
            >
              <Text style={MyStyles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CourtReservations;
