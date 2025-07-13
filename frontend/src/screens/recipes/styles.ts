import { StyleSheet, Dimensions } from "react-native";
import { APP_COLOR } from "../../styles";

const { width } = Dimensions.get("window");
const numColumns = 2;
const itemWidth = (width - 40) / numColumns; // 40 is for padding (15 on each side + 10 between items)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
  },
  gridContainer: {
    padding: 15,
    paddingBottom: 80, // Add extra padding at the bottom for the button
  },
  gridItem: {
    width: itemWidth,
    height: itemWidth,
    margin: 5,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  gridItemImage: {
    width: "100%",
    height: "100%",
  },
  gridItemTitle: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 8,
  },
  gridItemTitleText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 500, // Ensure there's enough space to pull down
    paddingBottom: 80, // Add extra padding for the button
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Search functionality styles
  searchBarContainer: {
    width: "100%",
    backgroundColor: "#fff",
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginHorizontal: 15,
    marginVertical: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 6,
  },
  clearSearchButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: APP_COLOR,
    borderRadius: 8,
  },
  clearSearchText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },
  // Add External Recipe button styles
  addButtonContainer: {
    position: 'absolute',
    bottom: 15, // Position above the tab bar
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    zIndex: 999, // Ensure it's above other elements
  },
  addButton: {
    backgroundColor: APP_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default styles;
