import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    backgroundColor: "white",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  errorText: {
    color: "red",
    marginTop: 10,
    marginBottom: 10,
  },
  textInput: {
    borderColor: "lightgray",
    borderBottomWidth: 1,
    borderStyle: "solid",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    fontSize: 16,
  },
  button: {
    marginTop: 40,
    borderColor: "lightgray",
    borderWidth: 1,
    borderStyle: "solid",
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "red",
    borderRadius: 5,
  },
  buttonDisabled: {
    backgroundColor: "#ffcccc",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  skipContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  skipText: {
    color: "#666",
    fontSize: 14,
  },
  textDisabled: {
    color: "#ccc",
  }
});

export default styles;
