import { Dimensions, StyleSheet } from "react-native";

const windowWidth = Dimensions.get('window').width;
const itemWidth = windowWidth / 3;

const styles = StyleSheet.create({
  container: {
    width: itemWidth,
    height: itemWidth,
    backgroundColor: "gray",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default styles;
