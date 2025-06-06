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
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
      }}
    >
      <View
        style={{
          backgroundColor: color,
          width: 20,
          height: 20,
          borderRadius: 5,
        }}
      />
      <Text style={{ fontSize: 13, fontFamily: "REMRegular" }}>{label}</Text>
    </View>
  );

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
        <Text style={[MyStyles.header, { marginTop: 20 }]}>Calendar</Text>

        <View
          style={{
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              textAlign: "center",
              marginBottom: 20,
              color: "#04384E",
              fontFamily: "QuicksandBold",
            }}
          >
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
                  style={{
                    backgroundColor: event.backgroundColor || "#3174ad",
                    borderRadius: 10,
                    padding: 5,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 10,
                      fontFamily: "QuicksandBold",
                    }}
                  >
                    {event.title}
                  </Text>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 10,
                      fontFamily: "QuicksandMedium",
                    }}
                  >
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

        <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
          {categories.map((column, columnIndex) => (
            <View
              key={columnIndex}
              style={{
                flexDirection: "column",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
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
          <Text
            style={{
              color: "#04384E",
              fontSize: 20,
              fontFamily: "REMMedium",
              marginTop: 30,
            }}
          >
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
                  {
                    backgroundColor: event.backgroundColor || "#3174ad",
                    padding: 10,
                    borderRadius: 10,
                    marginTop: 10,
                    gap: 5,
                  },
                ]}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    fontFamily: "QuicksandBold",
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
                    color: "#fff",
                    fontSize: 16,
                    fontFamily: "QuicksandBold",
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

                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    marginTop: 10,
                    fontFamily: "QuicksandMedium",
                  }}
                >
                  {event.title}
                </Text>
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BrgyCalendar;
