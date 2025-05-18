import { StyleSheet, View, Text, SafeAreaView, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MyStyles } from "./stylesheet/MyStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { InfoContext } from "../context/InfoContext";
import { useContext, useEffect, useState } from "react";
import { Calendar } from "react-native-big-calendar";

const BrgyCalendar = () => {
  const { events } = useContext(InfoContext);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#F0F4F7" }}
    >
      <ScrollView
        contentContainerStyle={[
          MyStyles.scrollContainer,
          {
            paddingBottom: insets.bottom + 70,
          },
        ]}
      >
        <MaterialIcons
          onPress={() => navigation.navigate("BottomTabs")}
          name="arrow-back-ios"
          size={24}
          color="#04384E"
        />
        <Text style={[MyStyles.header, { marginBottom: 0 }]}>Calendar</Text>
        <Text>
          {currentDate.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </Text>
        <Calendar
          events={events}
          height={600}
          mode="month"
          weekStartsOn={1}
          showTime
          eventCellStyle={(event) => ({
            backgroundColor: event.color,
          })}
        />
        <View>
          <Text>Important Events</Text>
          <View>
            {events?.map((event, index) => {
              return (
                <View key={index}>
                  <View style={{ flexDirection: "row" }}>
                    <Text>
                      {new Date(event.start).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                    <Text>
                      {" "}
                      {new Date(event.start).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(event.end).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>

                  <Text>{event.title}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BrgyCalendar;
