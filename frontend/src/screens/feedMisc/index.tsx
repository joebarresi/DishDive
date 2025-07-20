import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RouteProp } from "@react-navigation/native";
import BackButton from "../../components/common/misc/BackButton";
import { RootStackParamList } from "../../navigation/main";
import Feed from "../../components/Feed";
import { Post } from "../../../types";
import { getPostsByUserId } from "../../services/posts";

type FeedMiscRouteProp = RouteProp<RootStackParamList, "feedMisc">

interface FeedMiscPropss {
  route: FeedMiscRouteProp;
}

/*
 * My idea with this page is that based off route params, 
 * we should be able to deduce the type of posts we want to show,
 * as well as the starting post. Always show back button to "go back".
 */
const FeedMisc = ({ route }: FeedMiscPropss) => {
  const insets = useSafeAreaInsets();
  const { profile, postIndex } = route.params;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [startingIndex, setStartingIndex] = useState<number>(0);
  
  const getPosts = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      if (profile) {
        const {creator} = profile;
        const fetchedPosts = await getPostsByUserId(creator);
        setPosts(fetchedPosts);
      } else {
        return (
          <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <BackButton />
            <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
              <Text style={styles.title}>Feed Misc</Text>
              <Text style={styles.subtitle}>Additional feed features coming soon!</Text>
            </View>
          </View>
        );
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    getPosts(true);
  };
  
  useEffect(() => {
    getPosts();
    setStartingIndex(postIndex);
  }, [])

  return (
    <>
      <BackButton/>
      <Feed 
        posts={posts} 
        loading={loading} 
        refreshing={refreshing} 
        onRefresh={onRefresh}
        isProfileFeed={Boolean(profile)} 
        emptyConfig={{
          // TODO: conditional logic for this
          message: "We need to implement the conditional logic"
        }}
        startingIndex={startingIndex}
      />
    </>
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
