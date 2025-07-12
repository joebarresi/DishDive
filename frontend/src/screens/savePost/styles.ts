import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContentContainer: {
    paddingBottom: 100, // Extra padding at bottom for buttons
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  mediaDescriptionSection: {
    flexDirection: "row",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "flex-start",
  },
  descriptionContainer: {
    flex: 1,
    marginRight: 15,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
    minHeight: 100,
  },
  characterCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 5,
  },
  mediaPreview: {
    width: width * 0.35,
    height: width * 0.5,
    borderRadius: 12,
    backgroundColor: "#000",
  },
  recipeSection: {
    padding: 20,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 20,
    backgroundColor: "#f9f9f9",
  },
  cancelButtonText: {
    marginLeft: 10,
    fontWeight: "bold",
    color: "#666",
    fontSize: 16,
  },
  postButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#8B54FB",
    borderRadius: 8,
    paddingHorizontal: 30,
  },
  postButtonText: {
    marginLeft: 10,
    fontWeight: "bold",
    color: "white",
    fontSize: 16,
  },
  uploadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  uploadingText: {
    marginTop: 15,
    color: "#666",
    fontSize: 16,
  },
});

export default styles;
