import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
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
  },
  emptyContainer: {
    flex: 1,
    height: "100%",
    width: Dimensions.get("window").width,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyMessage: {
    color: '#BBBBBB',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  }
});

export default styles;
