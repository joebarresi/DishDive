import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    position: "absolute",
    zIndex: 999,
    bottom: 0,
    paddingLeft: 20,
    paddingBottom: 20,
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  contentContainer: {
    flex: 1,
    paddingRight: 10,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
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
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  actionsContainer: {
    alignItems: "center",
    marginLeft: 10,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatar: {
    height: 54,
    width: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: "white",
  },
  defaultAvatar: {
    borderRadius: 27,
    borderWidth: 1,
    borderColor: "white",
  },
  actionButton: {
    alignItems: "center",
    marginBottom: 16,
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    marginTop: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
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
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
  },
});

export default styles;
