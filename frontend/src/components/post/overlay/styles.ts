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
  },
  bottomContainer: {
    flexDirection: "row", // Row layout for content and actions side by side
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    paddingRight: 10,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "flex-start", // Changed to flex-start to align at the top
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  tagsContainer: {
    marginTop: 5,
    marginBottom: 5,
    width: "100%",
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
    marginTop: 5, 
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
    width: "80%", 
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15, 
    borderWidth: 1,
    borderColor: "#8B54FB",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1000,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 3, 
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1000,
    padding: 8,
  },
});

export default styles;
