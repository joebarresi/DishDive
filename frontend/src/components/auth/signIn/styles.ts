import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
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
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "lightgray",
    borderBottomWidth: 1,
    borderStyle: "solid",
    marginTop: 20,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    marginTop: 40,
    borderColor: "lightgray",
    borderWidth: 1,
    borderStyle: "solid",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#8B54FB",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default styles;
