import { FlatList, View, Dimensions, ViewToken, RefreshControl } from "react-native";
import { useContext, useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import PostSingle, { EmptyPostConfig, PostSingleHandles } from "../post";
import { Post } from "../../../types";
import { APP_COLOR } from "../../styles";
import { CurrentUserProfileItemInViewContext } from "../../navigation/feed";
import { defaultFlatListProps } from "./constant";

interface FeedItemViewToken extends ViewToken {
  item: FeedItemWrapper;
}

export interface FeedItemWrapper {
  post?: Post
  emptyConfig?: EmptyPostConfig
}

interface FeedProps {
  startingIndex?: number
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  isProfileFeed: boolean;
  feedType?: string;
  emptyConfig: EmptyPostConfig;
}

const Feed = ({
  startingIndex = 0,
  posts,
  loading,
  refreshing,
  onRefresh,
  isProfileFeed,
  feedType = "My Feed",
  emptyConfig,
}: FeedProps) => {
  const { setCurrentUserProfileItemInView } = useContext(
    CurrentUserProfileItemInViewContext,
  );
  const mediaRefs = useRef<Record<string, PostSingleHandles | null>>({});
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const flatListRef = useRef<FlatList>(null);
  
  const prevFeedTypeRef = useRef<string | undefined>();
  
  useEffect(() => {
    // Stop all videos when component loses focus or feed type changes
    Object.keys(mediaRefs.current).forEach((key) => {
      const media = mediaRefs.current[key];
      if (media) {
        media.stop();
      }
    });
    
    // Play the first video when component is focused and there are posts
    if (isFocused && posts.length > 0) {
      const firstVideoRef = mediaRefs.current[posts[0].id];
      
      if (firstVideoRef) {
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
    
    prevFeedTypeRef.current = feedType;
  }, [isFocused, feedType, posts]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems, changed }: { viewableItems: FeedItemViewToken[], changed: FeedItemViewToken[] }) => {
      // Stop videos that are no longer viewable
      if (changed.length > 0) {
        changed.forEach((element) => {
          // Get the correct key for the media ref
          const key = element.item.post?.id || 'empty-post';
          const cell = mediaRefs.current[key];
          if (cell && !element.isViewable) {
            cell.stop();
          }
        });
      }
      
      // Play the first viewable video
      if (viewableItems.length > 0) {
        const firstViewableItem = viewableItems[0];
        // Skip playing if it's an empty post
        if (!firstViewableItem.item.post) {
          return;
        }
        
        // Get the correct key for the media ref
        const key = firstViewableItem.item.post.id;
        const cell = mediaRefs.current[key];
        
        if (cell) {
          if (!isProfileFeed && setCurrentUserProfileItemInView) {
            setCurrentUserProfileItemInView(firstViewableItem.item.post.creator);
          }
          cell.play();
        }
      }
    },
  );

  const screenHeight = Dimensions.get("window").height;
  const bottomTabHeight = isProfileFeed ? 0 : 49;
  const bottomInset = insets.bottom;
  const feedItemHeight = screenHeight - bottomTabHeight - bottomInset;

  const renderItem = ({ item }: { item: FeedItemWrapper; index: number }) => {
    return (
      <View
        style={{
          height: feedItemHeight,
          backgroundColor: "black",
        }}
      >
        <PostSingle
          item={item}
          ref={(PostSingeRef) => {
            // Use a unique key for each item based on post ID or a special key for empty posts
            const key = item.post?.id || 'empty-post';
            mediaRefs.current[key] = PostSingeRef;
          }}
        />
      </View>
    );
  };

  // Create feed items with regular posts and always add an empty post at the end
  const feedItemPosts: FeedItemWrapper[] = posts.map((item) => {
    return {post: item};
  });
  
  // Always add the empty post at the end
  const feedItems = [...feedItemPosts, { emptyConfig }];

  return (
    <FlatList<FeedItemWrapper>
      ref={flatListRef}
      data={feedItems}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 50,
        minimumViewTime: 300,
      }}
      {...(startingIndex > 0 && { initialScrollIndex: startingIndex })}
      renderItem={renderItem}
      getItemLayout={
        (_, index) => ({
          length: feedItemHeight,
          offset: feedItemHeight * index,
          index,
        })
      }
      snapToInterval={feedItemHeight}
      onViewableItemsChanged={onViewableItemsChanged.current}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={APP_COLOR}
          colors={[APP_COLOR]}
          progressBackgroundColor="#ffffff"
        />
      }
      {...defaultFlatListProps}
    />
  );
};

export default Feed;
