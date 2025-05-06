import { StyleSheet, Text, View } from "react-native";
export const MyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 20,
  },
  scrollContainer: { padding: 20, flexGrow: 1, backgroundColor: "#FAFAFA" },
  textfield: {
    width: 300,
    height: 40,
    borderWidth: 1,
    borderColor: "black",
  },
  btn: {
    width: 300,
    height: 50,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  //BOTTOMNAV
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

  //SIDEBAR
  profileContainer: {
    padding: 20,
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 15,
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    marginVertical: 10,
  },
});
