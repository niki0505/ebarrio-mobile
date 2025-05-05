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

const CourtReservations = () => {
  const { logout, user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [reservationForm, setReservationForm] = useState({
    resID: user.resID,
    purpose: "",
    date: new Date(),
    starttime: new Date(),
    endtime: new Date(),
    amount: "",
  });

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

  const handleStartTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || reservationForm.starttime;
    setReservationForm((prev) => ({
      ...prev,
      starttime: currentDate,
    }));
  };

  const handleEndTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || reservationForm.endtime;
    setReservationForm((prev) => ({
      ...prev,
      endtime: currentDate,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || reservationForm.date;

    const updatedStarttime = new Date(currentDate);
    updatedStarttime.setHours(reservationForm.starttime.getHours());
    updatedStarttime.setMinutes(reservationForm.starttime.getMinutes());

    const updatedEndtime = new Date(currentDate);
    updatedEndtime.setHours(reservationForm.endtime.getHours());
    updatedEndtime.setMinutes(reservationForm.endtime.getMinutes());

    setReservationForm((prev) => ({
      ...prev,
      date: currentDate,
      starttime: updatedStarttime,
      endtime: updatedEndtime,
    }));
  };

  console.log(reservationForm);

  console.log("Date", reservationForm.date);
  console.log("Start time", reservationForm.starttime);
  console.log("End time", reservationForm.endtime);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity onPress={() => navigation.navigate("BottomTabs")}>
            <Text>Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Court Reservation</Text>
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
    </SafeAreaView>
  );
};

export default CourtReservations;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: "#fff",
  },
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
