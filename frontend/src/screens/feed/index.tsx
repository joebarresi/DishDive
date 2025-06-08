import { FlatList, View, Dimensions, ViewToken, StatusBar, Platform } from "react-native";
import styles from "./styles";
import PostSingle, { PostSingleHandles } from "../../components/general/post";
import { useContext, useEffect, useRef, useState } from "react";
import { getFeed, getPostsByUserId } from "../../services/posts";
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

  const { creator, profile, feedType = "My Feed" } = route.params as {
    creator: string;
    profile: boolean;
    feedType?: FeedType;
  };

  const [posts, setPosts] = useState<Post[]>([]);
  const mediaRefs = useRef<Record<string, PostSingleHandles | null>>({});
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const flatListRef = useRef<FlatList>(null);

  // Fetch posts based on feed type
  useEffect(() => {
    if (profile && creator) {
      // Profile feed - show user's posts
      getPostsByUserId(creator).then((posts) => setPosts(posts));
    } else {
      // Main feed - fetch based on feed type
      getFeed().then((posts) => {
        // In a real app, you would have different API calls for different feed types
        // For now, we'll simulate different feeds by sorting/filtering the same data
        let filteredPosts = [...posts];
        
        switch (feedType) {
          case "Following":
            // Simulate "Following" feed - could filter by followed creators
            filteredPosts = posts.filter((_, index) => index % 3 !== 0);
            break;
          case "Trending":
            // Simulate "Trending" feed - could sort by popularity
            filteredPosts = [...posts].sort((a, b) => 
              (b.likes?.length || 0) - (a.likes?.length || 0)
            );
            break;
          case "My Feed":
          default:
            // Default feed - no changes
            break;
        }
        
        setPosts(filteredPosts);
        
        // Scroll back to top when feed type changes
        if (flatListRef.current) {
          flatListRef.current.scrollToOffset({ offset: 0, animated: false });
        }
      });
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

  return (
    <View style={styles.container}>
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
      />
    </View>
  );
}
