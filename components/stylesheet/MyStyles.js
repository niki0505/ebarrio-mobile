import { StyleSheet, Text, View } from "react-native";
export const MyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F7",
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    color: "#04384E",
    fontFamily: "REMBold",
  },
  textMedium: {
    fontSize: 16,
    color: "#808080",
    fontFamily: "QuicksandMedium",
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
  tabBarContainer: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "white",
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: "#BC0F0F",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  // tabBarLabel: {
  //   paddingBottom: 5,
  //   fontSize: 16,
  //   fontFamily: "QuicksandSemiBold",
  //   textAlign: "center",
  //   marginBottom: 5,
  // },

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
    fontFamily: "QuicksandMedium",
  },
  inputLabel: {
    color: "#04384E",
    fontSize: 16,
    fontFamily: "QuicksandBold",
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
  },
  buttonText: {
    color: "#fff",
    fontFamily: "REMBold",
    fontSize: 24,
  },

  //Form message
  formMessage: {
    fontSize: 16,
    color: "#808080",
    fontFamily: "QuicksandSemiBold",
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
    shadowRadius: 4,

    // Android shadow
    elevation: 3,
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
    fontFamily: "REMBold",
    marginVertical: 10,
  },
  weatherBodyText: {
    color: "#fff",
    fontWeight: "400",
    fontSize: 16,
    fontFamily: "QuicksandSemiBold",
  },
  weatherSubheaderText: {
    fontSize: 18,
    fontFamily: "QuicksandBold",
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
    padding: 10,
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
    fontFamily: "QuicksandBold",
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
    fontSize: 20,
    fontFamily: "REMSemiBold",
    textAlign: "center",
  },
  emergencyMessage: {
    color: "#FAFAFA",
    fontSize: 12,
    textAlign: "center",
    opacity: 0.7,
    fontFamily: "QuicksandBold",
  },

  //Emergency Hotlines
  searchIcon: {
    position: "absolute",
    left: 15,
    top: "55%",
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
  shadow: {
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    // Android shadow
    elevation: 10,
  },

  //READINESS
  readinessCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 150,
    flexDirection: "row",
  },
  readinessImg: {
    width: 70,
    height: 70,
    resizeMode: "cover",
    marginRight: 15,
  },
  readinessTextContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  readinessTitle: {
    color: "#BC0F0F",
    fontSize: 20,
    fontFamily: "REMBold",
    marginBottom: 5,
    flexShrink: 1,
  },
  readinessSubTitle: {
    color: "#808080",
    fontSize: 15,
    fontFamily: "QuicksandBold",
    flexShrink: 1,
  },
  safetyTipsCard: {
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    flex: 1,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 200,
    maxWidth: "48%",
  },

  //QuickTips
  quickTipsCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: "rgba(188, 15, 15, 0.3)",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 15,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "REMBold",
    color: "#BC0F0F",
    textAlign: "center",
    marginTop: 15,
  },
  stepsContainer: {
    width: "100%",
    marginVertical: 20,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  stepNumber: {
    width: 30,
    height: 30,
    backgroundColor: "#BC0F0F",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepNumberText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  stepText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    fontFamily: "QuicksandSemiBold",
  },

  //Hazard Map and Evacuation Map
  mapOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  mapOverlayText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "REMSemiBold",
  },
  //Notification
  filterDropdown: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 1000,
  },
  filterDropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  filterDropdownText: {
    fontSize: 16,
    color: "#04384E",
    fontFamily: "QuicksandSemiBold",
  },
  tabBarContainer: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#fff",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 15,
    left: "50%",
    marginLeft: -30,
    width: 60,
    height: 60,
    backgroundColor: "#BC0F0F",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    width: 18,
    height: 18,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
