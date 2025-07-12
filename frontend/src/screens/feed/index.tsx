import { FlatList, View, Dimensions, ViewToken, StatusBar, Platform, Text, TouchableOpacity } from "react-native";
import styles from "./styles";
import PostSingle, { PostSingleHandles } from "../../components/general/post";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getFollowingFeed, getMyFeed, getPostsByUserId, getTrendingFeed } from "../../services/posts";
import { Post } from "../../../types";
import { RouteProp, useIsFocused, useNavigation } from "@react-navigation/native";
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
import { Ionicons } from "@expo/vector-icons";

// Create the FeedContext
export const FeedContext = createContext<{
  isProfileFeed: boolean;
  creator: string | null;
}>({
  isProfileFeed: false,
  creator: null,
});

// Create a hook to use the context
export const useFeedContext = () => useContext(FeedContext);

type FeedScreenRouteProp =
  | RouteProp<RootStackParamList, "userPosts">
  | RouteProp<HomeStackParamList, "Feed">
  | RouteProp<FeedStackParamList, "feedList">;

interface PostViewToken extends ViewToken {
  item: Post;
}

/**
 * Component that renders a list of posts meant to be
 * used for the feed screen.
 *
 * On start make fetch for posts then use a flatList
 * to display/control the posts.
 */
export default function FeedScreen({ route }: { route: FeedScreenRouteProp }) {
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

  // Create the context value
  const feedContextValue = {
    isProfileFeed: Boolean(profile),
    creator: creator || null,
  };

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const mediaRefs = useRef<Record<string, PostSingleHandles | null>>({});
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const flatListRef = useRef<FlatList>(null);

  // Fetch posts based on feed type
  useEffect(() => {
    const currentUser = FIREBASE_AUTH.currentUser;
    setLoading(true);

    if (profile && creator) {
      // Profile feed - show user's posts
      getPostsByUserId(creator)
        .then((posts) => {
          setPosts(posts);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching profile posts:", error);
          setPosts([]);
          setLoading(false);
        });
    } else {
      // Main feed - fetch based on feed type
      switch (feedType) {
        case "Following":
          getFollowingFeed(currentUser)
            .then((posts) => {
              setPosts(posts);
              setLoading(false);
            })
            .catch(error => {
              console.error("Error fetching following feed:", error);
              setPosts([]);
              setLoading(false);
            });
          break;
        case "Trending":
          getTrendingFeed(currentUser)
            .then((posts) => {
              setPosts(posts);
              setLoading(false);
            })
            .catch(error => {
              console.error("Error fetching trending feed:", error);
              setPosts([]);
              setLoading(false);
            });
          break;
        case "My Feed":
        default:
          getMyFeed(currentUser)
            .then((posts) => {
              setPosts(posts);
              setLoading(false);
            })
            .catch(error => {
              console.error("Error fetching my feed:", error);
              setPosts([]);
              setLoading(false);
            });
          break;
      }
      
      // Scroll back to top when feed type changes
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: false });
      }
    }
  }, [feedType, profile, creator]);

  // Track previous feed type to detect changes
  const prevFeedTypeRef = useRef<FeedType | undefined>();
  
  // Pause all videos when screen loses focus or feed type changes
  useEffect(() => {
    // When the screen is not focused, pause all videos
    Object.keys(mediaRefs.current).forEach((key) => {
      const media = mediaRefs.current[key];
      if (media) {
        media.stop();
      }
    });
    
    // When the screen is focused, play the currently visible video
    if (isFocused && posts.length > 0) {
      const firstVideoRef = mediaRefs.current[posts[0].id];
      
      if (firstVideoRef) {
        // If feed type changed and it's the same video that was playing before,
        // restart it instead of just playing from where it was
        if (prevFeedTypeRef.current !== undefined && 
            prevFeedTypeRef.current !== feedType) {
          setTimeout(() => {
            firstVideoRef.restart();
          }, 100);
        } else {
          setTimeout(() => {
            firstVideoRef.play();
          }, 100);
        }
      }
    }
    
    // Update the previous feed type reference
    prevFeedTypeRef.current = feedType;
  }, [isFocused, activeFeedType, feedType, posts]);

  /**
   * Called any time a new post is shown when a user scrolls
   * the FlatList, when this happens we should start playing
   * the post that is viewable and stop all the others
   */
  const onViewableItemsChanged = useRef(
    ({ viewableItems, changed }: { viewableItems: PostViewToken[], changed: PostViewToken[] }) => {
      // Stop all videos first
      if (changed.length > 0) {
        changed.forEach((element) => {
          const cell = mediaRefs.current[element.key];
          if (cell && !element.isViewable) {
            cell.stop();
          }
        });
      }
      
      // Only play the first viewable video
      if (viewableItems.length > 0) {
        const firstViewableItem = viewableItems[0];
        const cell = mediaRefs.current[firstViewableItem.key];
        
        if (cell) {
          if (!profile && setCurrentUserProfileItemInView) {
            setCurrentUserProfileItemInView(firstViewableItem.item.creator);
          }
          cell.play();
        }
      }
    },
  );

  // Calculate the exact screen height for each item
  const screenHeight = Dimensions.get("window").height;
  const bottomTabHeight = profile ? 0 : 49; // Standard height for bottom tab bar
  const bottomInset = insets.bottom;
  
  // Calculate the exact height needed for the video to fit properly
  const feedItemHeight = screenHeight - bottomTabHeight - bottomInset;

  /**
   * renders the item shown in the FlatList
   *
   * @param {Object} item object of the post
   * @param {Integer} index position of the post in the FlatList
   * @returns
   */
  const renderItem = ({ item, index }: { item: Post; index: number }) => {
    return (
      <View
        style={{
          height: feedItemHeight,
          backgroundColor: "black",
        }}
      >
        <PostSingle
          item={item}
          ref={(PostSingeRef) => (mediaRefs.current[item.id] = PostSingeRef)}
        />
      </View>
    );
  };

  // Navigate to the discover screen to find people to follow
  const navigateToDiscover = () => {
    navigation.navigate('findChef');
  };

  // Render empty following feed message
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
        {/* Back button for profile feed */}
        {profile && (
          <TouchableOpacity 
            style={[styles.backButton, { top: insets.top + 10 }]}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
        )}
        
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <FlatList
          ref={flatListRef}
          data={posts}
          windowSize={3}
          initialNumToRender={1}
          maxToRenderPerBatch={2}
          removeClippedSubviews
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50, // Item is considered viewable when 50% or more is visible
            minimumViewTime: 300, // Item must be visible for at least 300ms to be considered viewable
          }}
          renderItem={renderItem}
          pagingEnabled={true}
          snapToInterval={feedItemHeight}
          snapToAlignment="start"
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={onViewableItemsChanged.current}
          ListEmptyComponent={feedType === "Following" ? renderEmptyFollowingFeed : null}
        />
      </View>
    </FeedContext.Provider>
  );
}
