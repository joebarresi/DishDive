import { View, StatusBar } from "react-native";
import styles from "./styles";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getFollowingFeed, getMyFeed, } from "../../services/posts";
import { Post } from "../../../types";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/main";
import { HomeStackParamList } from "../../navigation/home";
import {
  ActiveFeedContext,
  FeedStackParamList,
  FeedType,
} from "../../navigation/feed";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import Feed from "../../components/Feed";
import EmptyFollowingFeed from "./EmptyFollowingFeed";

export const FeedContext = createContext<{
  isProfileFeed: boolean;
  creator: string | null;
}>({
  isProfileFeed: false,
  creator: null,
});

export const useFeedContext = () => useContext(FeedContext);

type FeedScreenRouteProp =
  | RouteProp<RootStackParamList, "profileOther">
  | RouteProp<HomeStackParamList, "Feed">
  | RouteProp<FeedStackParamList, "homeFeed">;

export default function HomeFeed({ route }: { route: FeedScreenRouteProp }) {
  const { activeFeedType } = useContext(ActiveFeedContext);

  const { creator, feedType = "My Feed" } = route.params as {
    creator: string;
    feedType?: FeedType;
  };

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const prevFeedTypeRef = useRef<FeedType | undefined>();

  const fetchPosts = async (showRefreshing = false) => {
    const currentUser = FIREBASE_AUTH.currentUser;
    
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      let fetchedPosts: Post[] = [];
      switch (activeFeedType) {
        case "Following":
          fetchedPosts = await getFollowingFeed(currentUser);
          break;
        case "My Feed":
        default:
          fetchedPosts = await getMyFeed(currentUser);
          break;
      }
      setPosts(fetchedPosts);
    } catch (error) {
      console.error(`Error fetching ${feedType} feed:`, error);
      setPosts([]);
    } finally {
      if (showRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts(true);
  };

  useEffect(() => {
    const feedTypeChanged = prevFeedTypeRef.current !== undefined && 
                           prevFeedTypeRef.current !== feedType;
    if (feedTypeChanged) {
      setPosts([]);
      setLoading(true);
    }
    
    fetchPosts();
    
    prevFeedTypeRef.current = feedType;
  }, [feedType, creator]);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Feed
        posts={posts}
        loading={loading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        isProfileFeed={false}
        feedType={feedType}
        emptyConfig={{
          message: feedType === "Following" 
            ? "Follow some chefs to see their delicious recipes!" 
            : "No more recipes to show. Pull to refresh for new content!",
          overrideComponent: feedType === "Following" ? <EmptyFollowingFeed loading={loading} /> : undefined,
        }}
      />
    </View>
  );
}
