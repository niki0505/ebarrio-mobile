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

const CourtReservations = () => {
  const insets = useSafeAreaInsets();
  const { fetchReservations, courtreservations } = useContext(InfoContext);
  const { logout, user } = useContext(AuthContext);
  const navigation = useNavigation();
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
    if (!selectedTime) return;

    const selectedDate = new Date(reservationForm.date);

    selectedDate.setHours(selectedTime.getHours());
    selectedDate.setMinutes(selectedTime.getMinutes());
    selectedDate.setSeconds(0);
    selectedDate.setMilliseconds(0);

    const approvedReservations = courtreservations.filter(
      (res) => res.status === "Approved"
    );

    const isConflict = approvedReservations.some((res) => {
      const reservedStart = new Date(res.starttime);
      const reservedEnd = new Date(res.endtime);
      return (
        (selectedDate >= reservedStart && selectedDate < reservedEnd) ||
        (selectedDate < reservedStart &&
          reservationForm.endtime &&
          new Date(reservationForm.endtime) > reservedStart)
      );
    });

    if (isConflict) {
      const conflictingReservation = approvedReservations.find((res) => {
        const reservedStart = new Date(res.starttime);
        const reservedEnd = new Date(res.endtime);
        return (
          (selectedDate >= reservedStart && selectedDate < reservedEnd) ||
          (selectedDate < reservedStart &&
            reservationForm.endtime &&
            new Date(reservationForm.endtime) > reservedStart)
        );
      });

      if (conflictingReservation) {
        const newStartTimeAfterConflict = new Date(
          conflictingReservation.endtime
        );
        Alert.alert(
          "Time Slot Conflict",
          `The selected time overlaps with another reservation. Start time updated to ${newStartTimeAfterConflict.toLocaleTimeString()}.`
        );

        setReservationForm((prev) => ({
          ...prev,
          starttime: newStartTimeAfterConflict,
          endtime: null,
          amount: "",
        }));
      }

      return;
    }

    const endTime = new Date(selectedDate);
    endTime.setHours(0, 0, 0, 0);

    setReservationForm((prev) => ({
      ...prev,
      starttime: selectedDate,
      endtime: endTime,
      amount: "",
    }));
  };

  const handleEndTimeChange = (event, selectedTime) => {
    if (!selectedTime) return;

    const newEndTime = new Date(reservationForm.date || new Date());
    newEndTime.setHours(selectedTime.getHours());
    newEndTime.setMinutes(selectedTime.getMinutes());

    const startTime = new Date(reservationForm.starttime);
    if (newEndTime <= startTime) {
      alert("End time must be after the start time.");
      return;
    }

    const approvedReservations = courtreservations.filter(
      (res) => res.status === "Approved"
    );

    const isConflicting = approvedReservations.some((reservation) => {
      const reservedStart = new Date(reservation.starttime);
      const reservedEnd = new Date(reservation.endtime);
      return (
        (newEndTime > reservedStart && newEndTime < reservedEnd) ||
        (newEndTime > reservedStart && newEndTime < reservedEnd)
      );
    });

    if (isConflicting) {
      Alert.alert(
        `The selected end time overlaps with another reservation. Please select a different time.`
      );
      return;
    }
    setReservationForm((prev) => ({
      ...prev,
      endtime: newEndTime,
    }));
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[
          MyStyles.scrollContainer,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.navigate("BottomTabs")}>
          <Text>Back</Text>
        </TouchableOpacity>
        <Text
          style={{
            padding: 10,
            fontSize: 24,
            color: "#04384E",
            fontWeight: "bold",
          }}
        >
          Court Reservations
        </Text>
        <Text>Purpose:</Text>
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
        ></Dropdown>
        <Text>Date:</Text>
        <DateTimePicker
          value={reservationForm.date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
        <Text>Start Time:</Text>
        <DateTimePicker
          value={reservationForm.starttime}
          mode="time"
          display="default"
          onChange={handleStartTimeChange}
        />
        <Text>End Time:</Text>
        <DateTimePicker
          value={reservationForm.endtime}
          mode="time"
          display="default"
          onChange={handleEndTimeChange}
        />

        <Text>Amount:</Text>
        <TextInput
          value={reservationForm.amount}
          style={[styles.input, { backgroundColor: "#f0f0f0" }]}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout}>
          <Text style={{ marginTop: 20, color: "red" }}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CourtReservations;

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
