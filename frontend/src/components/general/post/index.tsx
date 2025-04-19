import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import styles from "./styles";
import { Post } from "../../../../types";
import { useUser } from "../../../hooks/useUser";
import PostSingleOverlay from "./overlay";
import { TouchableWithoutFeedback } from "react-native";

export interface PostSingleHandles {
  play: () => Promise<void>;
  stop: () => Promise<void>;
  unload: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
}

/**
 * This component is responsible for displaying a post and play the
 * media associated with it.
 *
 * The ref is forwarded to this component so that the parent component
 * can manage the play status of the video.
 */
export const PostSingle = forwardRef<PostSingleHandles, { item: Post }>(
  ({ item }, parentRef) => {
    const ref = useRef<Video>(null);
    const user = useUser(item.creator).data;
    const [isPlaying, setIsPlaying] = useState(false);

    useImperativeHandle(parentRef, () => ({
      play,
      stop,
      unload,
      togglePlayPause,
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

    /**
     * Plays the video in the component if the ref
     * of the video is not null.
     *
     * @returns {void}
     */
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

    /**
     * Stops the video in the component if the ref
     * of the video is not null.
     *
     * @returns {void}
     */
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

    /**
     * Unloads the video in the component if the ref
     * of the video is not null.
     *
     * This will make sure unnecessary video instances are
     * not in memory at all times
     *
     * @returns {void}
     */
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

    /**
     * Toggles between play and pause states
     * 
     * @returns {void}
     */
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

    const handlePress = () => {
      togglePlayPause();
    };

    return (
      <>
        {user && <PostSingleOverlay user={user} post={item} />}
        <TouchableWithoutFeedback onPress={handlePress}>
          <Video
            ref={ref}
            style={styles.container}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false}
            isLooping
            usePoster
            posterSource={{ uri: item.media[1] }}
            posterStyle={{ resizeMode: "cover", height: "100%" }}
            source={{
              uri: item.media[0],
            }}
          />
        </TouchableWithoutFeedback>
      </>
    );
  },
);

export default PostSingle;
