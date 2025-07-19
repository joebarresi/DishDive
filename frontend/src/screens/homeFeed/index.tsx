import { View, StatusBar, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getFollowingFeed, getMyFeed, getPostsByUserId, getTrendingFeed } from "../../services/posts";
import { Post } from "../../../types";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/main";
import { HomeStackParamList } from "../../navigation/home";
import {
  ActiveFeedContext,
  CurrentUserProfileItemInViewContext,
  FeedStackParamList,
  FeedType,
} from "../../navigation/feed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "../../../firebaseConfig";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { APP_COLOR } from "../../styles";
import BackButton from "../../components/common/misc/BackButton";
import Feed from "../../components/Feed";

export const FeedContext = createContext<{
  isProfileFeed: boolean;
  creator: string | null;
}>({
  isProfileFeed: false,
  creator: null,
});

export const useFeedContext = () => useContext(FeedContext);

type FeedScreenRouteProp =
  | RouteProp<RootStackParamList, "userPosts">
  | RouteProp<HomeStackParamList, "Feed">
  | RouteProp<FeedStackParamList, "feedList">;

export default function HomeFeed({ route }: { route: FeedScreenRouteProp }) {
  const { setCurrentUserProfileItemInView } = useContext(
    CurrentUserProfileItemInViewContext,
  );
  const { activeFeedType } = useContext(ActiveFeedContext);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { creator, profile, feedType = "My Feed" } = route.params as {
    creator: string;
    profile: boolean;
    feedType?: FeedType;
  };

  const feedContextValue = {
    isProfileFeed: Boolean(profile),
    creator: creator || null,
  };

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const fetchPosts = async (showRefreshing = false) => {
    const currentUser = FIREBASE_AUTH.currentUser;
    
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      let fetchedPosts: Post[] = [];
      
      if (profile && creator) {
        fetchedPosts = await getPostsByUserId(creator);
      } else {
        switch (feedType) {
          case "Following":
            fetchedPosts = await getFollowingFeed(currentUser);
            break;
          case "Trending":
            fetchedPosts = await getTrendingFeed(currentUser);
            break;
          case "My Feed":
          default:
            fetchedPosts = await getMyFeed(currentUser);
            break;
        }
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
    fetchPosts(true);
  };

  useEffect(() => {
    fetchPosts();
  }, [feedType, profile, creator]);

  const navigateToDiscover = () => {
    navigation.navigate('findChef');
  };

  const renderEmptyFollowingFeed = () => {
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

  if (feedType === "Following" && posts.length === 0 && !loading) {
    return (
      <FeedContext.Provider value={feedContextValue}>
        {renderEmptyFollowingFeed()}
      </FeedContext.Provider>
    );
  }

  return (
    <FeedContext.Provider value={feedContextValue}>
      <View style={styles.container}>
        {profile && <BackButton />}
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <Feed
          posts={posts}
          loading={loading}
          refreshing={refreshing}
          onRefresh={onRefresh}
          isProfileFeed={Boolean(profile)}
          feedType={feedType}
          emptyComponent={feedType === "Following" ? renderEmptyFollowingFeed() : null}
        />
      </View>
    </FeedContext.Provider>
  );
}
