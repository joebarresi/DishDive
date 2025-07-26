import { Dimensions, StyleSheet } from "react-native";

const windowWidth = Dimensions.get('window').width;
const itemWidth = windowWidth / 3;

const styles = StyleSheet.create({
  container: {
    width: itemWidth,
    height: itemWidth,
    backgroundColor: "gray",
    position: "relative",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
  },
  viewCountText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 3,
  },
});

export default styles;
