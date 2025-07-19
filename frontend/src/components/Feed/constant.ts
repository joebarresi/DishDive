import { FeedItemWrapper } from ".";

export const defaultFlatListProps = {
    windowSize: 5,
    initialNumToRender: 1,
    maxToRenderPerBatch: 2,
    pagingEnabled: true,
    snapToAlignment: "start" as "center" | "start" | "end" | undefined,
    decelerationRate: "fast" as number | "fast" | "normal" | undefined,
    keyExtractor: (item: FeedItemWrapper) => {
      // Use post ID for regular posts, or a fixed string for the empty post
      return item.post?.id || 'empty-post-end-of-feed';
    },
    showsVerticalScrollIndicator: false,
  }
