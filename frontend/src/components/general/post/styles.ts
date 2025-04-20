import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%", // Ensure video takes full height of its container
    width: Dimensions.get("window").width,
  },
});
export default styles;
