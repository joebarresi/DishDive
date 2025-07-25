import { StyleSheet } from "react-native";
import { APP_COLOR } from "../../styles";

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
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: APP_COLOR,
  },
  gridItemText: {
    color: APP_COLOR,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    textAlign: "center",
  },
  searchRecipe: {
    backgroundColor: APP_COLOR,
    borderColor: APP_COLOR,
  },
  searchRecipeText: {
    color: "white",
  },
  findChef: {
    // Uses default gridItem styles (white background, purple border)
  },
  whatIHave: {
    // Uses default gridItem styles (white background, purple border)
  },
  searchButton: {
    backgroundColor: APP_COLOR,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 12,
  },
  disabledButton: {
    backgroundColor: "#D4C4FF", // Lighter purple
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  recipeList: {
    paddingVertical: 8,
  },
  recipeItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  recipeThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
  },
  noImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  recipeInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: "#666",
  },
  tagContainer: {
    flexDirection: "row",
    marginTop: 4,
    flexWrap: "wrap",
  },
  tagText: {
    fontSize: 12,
    color: "#4ECDC4",
    backgroundColor: "#E8F8F7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 6,
    marginTop: 4,
    overflow: "hidden",
  },
  dietTagText: {
    fontSize: 12,
    color: APP_COLOR,
    backgroundColor: "#F0EEFF", // Light purple background
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 6,
    marginTop: 4,
    overflow: "hidden",
  },
  filterContainer: {
    flexDirection: "row",
    marginTop: 12,
    alignItems: "center",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    flex: 1,
    justifyContent: "space-between",
  },
  activeFilterButton: {
    backgroundColor: APP_COLOR,
  },
  filterButtonText: {
    fontSize: 14,
    color: "#666",
    marginRight: 4,
  },
  activeFilterText: {
    color: "white",
    fontWeight: "500",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: APP_COLOR,
    marginLeft: 4,
  },
  clearFiltersButton: {
    backgroundColor: APP_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 16,
  },
  clearFiltersText: {
    color: "white",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalScrollView: {
    maxHeight: "100%",
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  modalItemText: {
    fontSize: 16,
  },
  // What I Have at Home styles
  whatIHaveSubtitle: {
    fontSize: 16,
    color: "#666",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  ingredientList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ingredientNameInput: {
    flex: 2,
    height: 48,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: "#FFFFFF",
  },
  ingredientAmountInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: "#FFFFFF",
  },
  removeIngredientButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "#F0EEFF", // Light purple background
  },
  addIngredientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  addIngredientText: {
    color: "#6B5B95",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  generateRecipeButton: {
    backgroundColor: "#6B5B95",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  generateRecipeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  recipeContainer: {
    flex: 1,
    padding: 16,
  },
  recipeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  closeRecipeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  recipeDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    lineHeight: 22,
  },
  recipeMetaContainer: {
    flexDirection: "row",
    marginBottom: 24,
    flexWrap: "wrap",
  },
  recipeMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  recipeMetaText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  recipeSubtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 12,
    color: "#333",
  },
  recipeIngredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 4,
  },
  recipeIngredientText: {
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  recipeStepItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  recipeStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#6B5B95",
    color: "white",
    textAlign: "center",
    lineHeight: 24,
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 12,
    marginTop: 2,
  },
  recipeStepText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  newRecipeButton: {
    backgroundColor: "#6B5B95",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  newRecipeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
