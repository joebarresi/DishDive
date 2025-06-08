import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: 'black'
  },
  emptyFeedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20
  },
  emptyFeedText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500'
  },
  emptyFeedSubText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30
  },
  followButton: {
    backgroundColor: '#FF4D67',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25
  },
  followButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default styles;
