import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow tags to wrap to next line
    justifyContent: "flex-start", // Align tags to the start
  },
  tagContainer: {
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 4,
    // Shadow for better visibility against video backgrounds
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    // Remove fixed width to allow text-length adjusted width
    // width: "30%", // Removed: was approximately 3 per row with margins
    // maxWidth: 100, // Removed: was maximum width to prevent oversized tags
    alignSelf: 'flex-start', // Allow tag to size to its content
  },
  tagText: {
    color: "white",
    fontSize: 11, // Slightly smaller font
    fontWeight: "600",
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
    textAlign: "center", // Center text in tag
    // Ensure single line text
    flexShrink: 1,
  },
});

export default styles;
