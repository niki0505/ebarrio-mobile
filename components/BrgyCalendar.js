import { View, Text, SafeAreaView, ScrollView } from "react-native";
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

  const categories = [
    [
      { label: "General", color: "#4A90E2" },
      { label: "Health and Sanitation", color: "#7ED321" },
      { label: "Public Safety & Emergency", color: "#FF0000" },
    ],
    [
      { label: "Education and Youth", color: "#FFD942" },
      { label: "Social Services", color: "#B3B6B7" },
      { label: "Infrastructure", color: "#EC9300" },
    ],
  ];

  const CategoryItem = ({ color, label }) => (
    <View style={MyStyles.legendsRowWrapper}>
      <View style={[MyStyles.categoriesColors, { backgroundColor: color }]} />
      <Text style={MyStyles.categoriesText}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: "#DCE5EB",
      }}
    >
      <ScrollView contentContainerStyle={[MyStyles.scrollContainer]}>
        <MaterialIcons
          onPress={() => navigation.navigate("BottomTabs")}
          name="arrow-back-ios"
          size={24}
          color="#04384E"
        />
        <Text style={MyStyles.servicesHeader}>Calendar</Text>

        <View
          style={{
            marginTop: 20,
          }}
        >
          <Text style={MyStyles.dateText}>
            {currentDate.toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </Text>
          <Calendar
            hourRowHeight={80}
            events={events}
            height={500}
            mode="month"
            weekStartsOn={1}
            showTime
            eventCellStyle={(event) => ({
              backgroundColor: event.backgroundColor,
            })}
            eventStyle={(event) => ({
              overflow: "hidden",
              padding: 5,
            })}
            renderEvent={(event) => {
              return (
                <View
                  style={[
                    MyStyles.calendarEventWrapper,
                    { backgroundColor: event.backgroundColor || "#3174ad" },
                  ]}
                >
                  <Text style={MyStyles.calendarEventTitle}>{event.title}</Text>
                  <Text style={MyStyles.calendarEventTime}>
                    {new Date(event.start).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              );
            }}
          />
        </View>

        <View style={MyStyles.legendsRowWrapper}>
          {categories.map((column, columnIndex) => (
            <View key={columnIndex} style={MyStyles.legendsColWrapper}>
              {column.map((item, index) => (
                <CategoryItem
                  key={index}
                  color={item.color}
                  label={item.label}
                />
              ))}
            </View>
          ))}
        </View>

        <View>
          <Text style={[MyStyles.subHeader, { marginTop: 30 }]}>
            Important Events
          </Text>

          {events
            .filter((event) => {
              const eventDate = new Date(event.start);
              const now = new Date();
              return (
                eventDate.getMonth() === now.getMonth() &&
                eventDate.getFullYear() === now.getFullYear()
              );
            })
            .map((event, index) => (
              <View
                key={index}
                style={[
                  MyStyles.shadow,
                  MyStyles.importantEventsWrapper,
                  {
                    backgroundColor: event.backgroundColor || "#3174ad",
                  },
                ]}
              >
                <Text
                  style={{
                    importantEventsDate,
                  }}
                >
                  📅{" "}
                  {new Date(event.start).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>

                <Text
                  style={{
                    importantEventsDate,
                  }}
                >
                  🕒{" "}
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

                <Text style={MyStyles.importantEventsTitle}>{event.title}</Text>
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BrgyCalendar;
