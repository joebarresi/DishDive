import { FlatList, View, Dimensions, ViewToken, RefreshControl } from "react-native";
import { useContext, useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";
import PostSingle, { PostSingleHandles } from "../post";
import { Post } from "../../../types";
import { APP_COLOR } from "../../styles";
import { CurrentUserProfileItemInViewContext } from "../../navigation/feed";
import styles from "./styles";
import { defaultFlatListProps } from "./constant";

interface PostViewToken extends ViewToken {
  item: Post;
}

interface FeedProps {
  startingIndex?: number
  posts: Post[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  isProfileFeed: boolean;
  feedType?: string;
  emptyComponent?: React.ReactNode;

}

//TODO: look at loading
const Feed = ({
  startingIndex = 0,
  posts,
  loading,
  refreshing,
  onRefresh,
  isProfileFeed,
  feedType = "My Feed",
  emptyComponent,
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
    Object.keys(mediaRefs.current).forEach((key) => {
      const media = mediaRefs.current[key];
      if (media) {
        media.stop();
      }
    });
    
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
    ({ viewableItems, changed }: { viewableItems: PostViewToken[], changed: PostViewToken[] }) => {
      if (changed.length > 0) {
        changed.forEach((element) => {
          const cell = mediaRefs.current[element.key];
          if (cell && !element.isViewable) {
            cell.stop();
          }
        });
      }
      
      if (viewableItems.length > 0) {
        const firstViewableItem = viewableItems[0];
        const cell = mediaRefs.current[firstViewableItem.key];
        
        if (cell) {
          if (!isProfileFeed && setCurrentUserProfileItemInView) {
            setCurrentUserProfileItemInView(firstViewableItem.item.creator);
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

  const renderItem = ({ item }: { item: Post; index: number }) => {
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
    <FlatList
      ref={flatListRef}
      data={posts}
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
