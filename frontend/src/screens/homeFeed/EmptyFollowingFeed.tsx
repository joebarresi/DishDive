import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/main";
import styles from "./styles";

interface EmptyFollowingFeedProps {
  loading: boolean;
}

const EmptyFollowingFeed: React.FC<EmptyFollowingFeedProps> = ({ loading }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const navigateToDiscover = () => {
    navigation.navigate('findChef');
  };

  if (loading) return null;
  
  return (
    <View style={styles.emptyFeedContainer}>
      <Text style={styles.emptyFeedText}>
        No videos from people you follow yet
      </Text>
      <Text style={styles.emptyFeedSubText}>
        Videos from accounts you follow will appear here. Follow some accounts to get started.
      </Text>
      <TouchableOpacity 
        style={styles.followButton}
        onPress={navigateToDiscover}
      >
        <Text style={styles.followButtonText}>Find People to Follow</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyFollowingFeed;
