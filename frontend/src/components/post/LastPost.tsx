import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";
import { EmptyPostConfig } from ".";

interface LastPostProps {
  config: EmptyPostConfig;
}

const LastPost = ({ config }: LastPostProps) => {
  if (config.overrideComponent) {
    return <>{config.overrideComponent}</>;
  }
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Uh-oh! We ran out of posts for your feed</Text>
      <Text style={styles.emptyMessage}>
        {config.message}
      </Text>
    </View>
  );
};

export default LastPost;
