import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import styles from "./styles";
import { Post } from "../../../types";
import { useUser } from "../../hooks/useUser";
import PostSingleOverlay from "./overlay";
import { TouchableWithoutFeedback, View, Animated } from "react-native";
import LastPost from "./LastPost";
import { FeedItemWrapper } from "../Feed";

export interface PostSingleHandles {
  play: () => Promise<void>;
  stop: () => Promise<void>;
  unload: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  restart: () => Promise<void>;
}

export interface EmptyPostConfig {
  message: string;
}

export interface PostSingleProps {
  item: FeedItemWrapper;
}

export const PostSingle = forwardRef<PostSingleHandles, PostSingleProps>(
  ({ item }, parentRef) => {
    // If this is an empty post, render the LastPost component
    if (item.emptyConfig) {
      return <LastPost config={item.emptyConfig} />;
    }

    // Regular post handling
    const post: Post = item.post as Post;

    const ref = useRef<Video>(null);
    const user = useUser(post.creator).data;
    const [isPlaying, setIsPlaying] = useState(false);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useImperativeHandle(parentRef, () => ({
      play,
      stop,
      unload,
      togglePlayPause,
      restart,
    }));

    useEffect(() => {
      return () => {
        unload()
          .then(() => {})
          .catch((e) => {
            console.log("Failed to unload:", e);
          });
      };
    }, []);

    useEffect(() => {
      if (isPlaying) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 10,
          useNativeDriver: true,
        }).start();
      } else {
        fadeAnim.setValue(1);
      }
    }, [isPlaying, fadeAnim]);

    const play = async () => {
      if (ref.current == null) {
        return;
      }
      try {
        const status = await ref.current.getStatusAsync();
        if (status && "isPlaying" in status && status.isPlaying) {
          return;
        }
        await ref.current.playAsync();
        setIsPlaying(true);
      } catch (e) {
        console.log("An error occurred:", e);
      }
    };

    const stop = async () => {
      if (ref.current == null) {
        return;
      }
      try {
        const status = await ref.current.getStatusAsync();
        if (status && "isPlaying" in status && !status.isPlaying) {
          return;
        }
        await ref.current.pauseAsync();
        setIsPlaying(false);
      } catch (e) {
        console.log("An error occurred:", e);
      }
    };

    const unload = async () => {
      if (ref.current == null) {
        return;
      }
      try {
        await ref.current.unloadAsync();
        setIsPlaying(false);
      } catch (e) {
        console.log(e);
      }
    };

    const togglePlayPause = async () => {
      if (ref.current == null) {
        return;
      }
      try {
        const status = await ref.current.getStatusAsync();
        if (status && "isPlaying" in status) {
          if (status.isPlaying) {
            await ref.current.pauseAsync();
            setIsPlaying(false);
          } else {
            await ref.current.playAsync();
            setIsPlaying(true);
          }
        }
      } catch (e) {
        console.log("An error occurred while toggling play/pause:", e);
      }
    };

    const restart = async () => {
      if (ref.current == null) {
        return;
      }
      try {
        await ref.current.stopAsync();
        await ref.current.setPositionAsync(0);
        await ref.current.playAsync();
        setIsPlaying(true);
      } catch (e) {
        console.log("An error occurred while restarting video:", e);
      }
    };

    const handlePress = () => {
      togglePlayPause();
    };

    return (
      <>
        {user && <PostSingleOverlay user={user} post={post} />}
        
        <TouchableWithoutFeedback onPress={handlePress}>
          <View style={{ flex: 1 }}>
            <Video
              ref={ref}
              style={styles.container}
              resizeMode={ResizeMode.COVER}
              shouldPlay={false}
              isLooping
              usePoster
              posterSource={{ uri: post.media[1] }}
              posterStyle={{ resizeMode: "cover", height: "100%" }}
              source={{
                uri: post.media[0],
              }}
            />
            <Animated.View 
              style={[
                styles.playPauseContainer,
                { opacity: fadeAnim }
              ]}
              pointerEvents="none"
            >
              {!isPlaying && (
                <View style={styles.pauseBars}>
                  <View style={styles.pauseBar} />
                  <View style={styles.pauseBar} />
                </View>
              )}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </>
    );
  },
);

export default PostSingle;
