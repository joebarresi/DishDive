export const defaultFlatListProps = {
    windowSize: 5,
    initialNumToRender: 1,
    maxToRenderPerBatch: 2,
    pagingEnabled: true,
    snapToAlignment: "start" as "center" | "start" | "end" | undefined,
    decelerationRate: "fast" as number | "fast" | "normal" | undefined,
    keyExtractor: (item: Post) => item.id,
    showsVerticalScrollIndicator: false,
  }