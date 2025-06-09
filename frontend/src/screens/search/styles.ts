import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    marginTop: 8,
  },
  textInput: {
    margin: 10,
    backgroundColor: "lightgray",
    padding: 5,
    borderRadius: 4,
  },
  gridContainer: {
    flex: 1,
    marginBottom: 16, // Buffer space above the nav bar
  },
  row: {
    flexDirection: "row",
    flex: 1, // Make rows take equal space
    marginBottom: 16,
  },
  gridItem: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    margin: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  gridItemText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    textAlign: "center",
  },
  askAI: {
    backgroundColor: "#FF6B6B", // Red
  },
  findChef: {
    backgroundColor: "#4ECDC4", // Teal
  },
  searchDiet: {
    backgroundColor: "#FFD166", // Yellow
  },
  whatIHave: {
    backgroundColor: "#6B5B95", // Purple
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    color: "#555",
  },
  placeholder: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
  },
  // New styles for Find a Chef screen
  searchContainer: {
    marginVertical: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  popularButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#4ECDC4",
  },
  popularButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
  },
  activeButtonText: {
    color: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chefList: {
    paddingVertical: 8,
  },
  chefItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  chefAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E0E0E0",
  },
  chefInfo: {
    flex: 1,
    marginLeft: 16,
  },
  chefName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  chefBio: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  chefFollowers: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
  },
});

export default styles;
