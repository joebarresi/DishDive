import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  settingsContainer: {
    marginTop: 20,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemIcon: {
    marginRight: 15,
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
  signOutButton: {
    marginTop: 30,
  },
  signOutText: {
    fontSize: 16,
    flex: 1,
    color: "#FF3B30",
  },
});

export default styles;
