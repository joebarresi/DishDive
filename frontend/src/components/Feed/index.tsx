import { FlatList, View, Dimensions, ViewToken, RefreshControl, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useContext, useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
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
  fullScreen?: boolean;
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
  fullScreen,
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
  const [currentlyVisibleVideoId, setCurrentlyVisibleVideoId] = useState<string | null>(null);
  
  const prevFeedTypeRef = useRef<string | undefined>();
  
  useEffect(() => {
    Object.keys(mediaRefs.current).forEach((key) => {
      const media = mediaRefs.current[key];
      if (media) {
        media.stop();
      }
    });
    
    prevFeedTypeRef.current = feedType;
  }, [isFocused, feedType, posts]);

  useEffect(() => {
    if (isFocused && posts.length > 0 && currentlyVisibleVideoId) {
      const timer = setTimeout(() => {
        const videoRef = mediaRefs.current[currentlyVisibleVideoId];
        if (videoRef) {
          videoRef.play();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isFocused, currentlyVisibleVideoId]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems, changed }: { viewableItems: FeedItemViewToken[], changed: FeedItemViewToken[] }) => {
      if (changed.length > 0) {
        changed.forEach((element) => {
          const key = element.item.post?.id || 'empty-post';
          const cell = mediaRefs.current[key];
          if (cell && !element.isViewable) {
            cell.stop();
          }
        });
      }
      
      if (viewableItems.length > 0) {
        const firstViewableItem = viewableItems[0];
        if (!firstViewableItem.item.post) {
          return;
        }
        
        const key = firstViewableItem.item.post.id;
        const cell = mediaRefs.current[key];
        
        setCurrentlyVisibleVideoId(key);
        
        if (cell) {
          if (!isProfileFeed && setCurrentUserProfileItemInView) {
            setCurrentUserProfileItemInView(firstViewableItem.item.post.creator);
          }
          
          if (isFocused) {
            cell.play();
          }
        }
      }
    },
  );

  const screenHeight = Dimensions.get("window").height;
  const bottomTabHeight = fullScreen ? 0 : 90;
  // const bottomInset = insets.bottom; // Want to see on the phone
  const bottomInset = 0;
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
            const key = item.post?.id || 'empty-post';
            mediaRefs.current[key] = PostSingeRef;
          }}
        />
      </View>
    );
  };

  const feedItemPosts: FeedItemWrapper[] = posts.map((item) => {
    return {post: item};
  });
  
  const feedItems = [...feedItemPosts, { emptyConfig }];

  function onLayout() {
    flatListRef.current?.scrollToIndex({index: startingIndex, animated: false})
  }
  useEffect(() => {
    onLayout();
  }, [startingIndex])

  const getItemLayout = (_: ArrayLike<FeedItemWrapper> | null | undefined, index: number) => ({
            length: feedItemHeight,
            offset: feedItemHeight * index,
            index,
          })

  return (
    <View onLayout={() => onLayout()}>
      <FlatList<FeedItemWrapper>
        ref={flatListRef}
        data={feedItems}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
          minimumViewTime: 300,
        }}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        snapToInterval={feedItemHeight}
        onViewableItemsChanged={onViewableItemsChanged.current}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        contentInset={{ top: 0 }}
        contentOffset={{ x: 0, y: 0 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="white"
            colors={["white"]}
            progressBackgroundColor="transparent"
            style={{ backgroundColor: 'transparent' }}
            progressViewOffset={60}
          />
        }
        {...defaultFlatListProps}
      />
    </View>
    
  );
};

export default Feed;
