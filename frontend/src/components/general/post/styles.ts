import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%", // Ensure video takes full height of its container
    width: Dimensions.get("window").width,
  },
  playPauseContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  pauseBars: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseBar: {
    width: 10,
    height: 40,
    backgroundColor: 'white',
    marginHorizontal: 5,
    borderRadius: 2,
  }
});

export default styles;
