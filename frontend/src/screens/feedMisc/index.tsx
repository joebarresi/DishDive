import React from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RouteProp } from "@react-navigation/native";
import { FeedStackParamList } from "../../navigation/feed";
import BackButton from "../../components/common/misc/BackButton";
import { RootStackParamList } from "../../navigation/main";

type FeedMiscRouteProp = RouteProp<RootStackParamList, "feedMisc"> | RouteProp<FeedStackParamList, "feedMisc">

interface FeedMiscProps {
  route: FeedMiscRouteProp;
}

const FeedMisc = ({ route }: FeedMiscProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <BackButton/>
      <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
        <Text style={styles.title}>Feed Misc</Text>
        <Text style={styles.subtitle}>Additional feed features coming soon!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    color: "#BBBBBB",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});

export default FeedMisc;
