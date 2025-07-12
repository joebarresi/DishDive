import { StyleSheet } from "react-native";
const buttonStyles = StyleSheet.create({
  grayOutlinedButton: {
    borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  grayOutlinedIconButton: {
    borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 10,
  },
  filledButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 50,
    backgroundColor: "#ff4040",
  },
  filledButtonText: {
    color: "white",
    fontWeight: "700",
  },
  grayOutlinedButtonText: {
    color: "black",
    fontWeight: "700",
  },
  uploadButton: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#8B54FB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 8,
  },
});

export default buttonStyles;
