import { StyleSheet, Text, View } from "react-native";
export const MyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F7",
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "start",
    color: "#04384E",
    fontFamily: "REMBold",
  },
  scrollContainer: { padding: 20, flexGrow: 1, backgroundColor: "#F0F4F7" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  //Alignment - row and column
  rowAlignment: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  columnAlignment: {
    flexDirection: "column",
    alignItems: "center",
  },

  //Bottom Nav
  tabBar: {
    paddingTop: 5,
    height: 70,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    justifyContent: "center",
  },
  tabBarLabel: {
    paddingBottom: 5,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
  },

  //Picker, Input
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10,
  },
  input: {
    width: "100%",
    height: 55,
    borderWidth: 1,
    borderColor: "#ACACAC",
    borderRadius: 15,
    fontSize: 16,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  inputLabel: {
    color: "#04384E",
    fontSize: 16,
  },
  datetimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  //Button
  button: {
    backgroundColor: "#0E94D3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
  },

  //Form message
  formMessage: {
    fontSize: 18,
    color: "gray",
  },

  //Suggestion
  suggestionContainer: {
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    maxHeight: 150,
    marginTop: 4,
  },
  suggestionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },

  //Card
  card: {
    flex: 1,
    height: 120,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    overflow: "hidden",

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    // Android shadow
    elevation: 10,
  },

  //Gradient Background
  gradientBackground: {
    flex: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  //Weather
  weatherHeaderText: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
    marginVertical: 10,
  },
  weatherBodyText: {
    color: "#fff",
    fontWeight: "400",
    fontSize: 14,
    fontWeight: "normal",
  },
  weatherSubheaderText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
  },
  hourlyforecastContainer: {
    alignItems: "center",
    width: 100,
    height: 100,
    justifyContent: "center",
  },
  forecastcontentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },

  //Home
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#04384E",
  },
  servicesImgContainer: {
    backgroundColor: "#DBDEE8",
    padding: 15,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  servicesImg: {
    width: 50,
    height: 50,
    borderRadius: 60,
    resizeMode: "cover",
  },
  servicesTitle: {
    fontSize: 16,
    color: "#04384E",
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
  },
  sosContainer: {
    backgroundColor: "#BC0F0F",
    padding: 20,
    borderRadius: 10,
    height: "auto",
    padding: 20,

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    // Android shadow
    elevation: 10,
  },
  emergencyTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  emergencyMessage: {
    color: "#FAFAFA",
    fontSize: 12,
    textAlign: "center",
    opacity: 0.7,
  },

  //Emergency Hotlines
  searchIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  phoneIcon: {
    backgroundColor: "#BC0F0F",
    borderRadius: 20,
    width: 35,
    height: 35,
    textAlign: "center",
    textAlignVertical: "center",
  },

  loginInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ACACAC",
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 10,
    width: "100%",
    backgroundColor: "#fff",
    height: 45,
  },
  loginInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#000",
  },
});
