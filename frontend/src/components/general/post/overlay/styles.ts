import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    position: "absolute",
    zIndex: 999,
    bottom: 0,
    paddingLeft: 20,
    paddingBottom: 50, // Increased from 20 to ensure content is visible
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  displayName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    marginTop: 10,
    color: "white",
    maxWidth: Dimensions.get("window").width * 0.7, // Limit width to prevent overflow
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "white",
    marginBottom: 30,
  },
  defaultAvatar: {
    marginBottom: 30,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "white",
  },
  leftContainer: {
    alignItems: "center",
  },
  actionButton: {
    paddingBottom: 16,
  },
  actionButtonText: {
    color: "white",
    textAlign: "center",
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    width: "90%",
    height: "80%",
    backgroundColor: "#000",
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: "#FF4D67",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1000,
  },
});

export default styles;
