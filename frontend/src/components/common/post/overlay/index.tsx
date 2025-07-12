import { useEffect, useMemo, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "./styles";
import { Post, User } from "../../../../../types";
import { useSelector } from "react-redux";
import { throttle } from "throttle-debounce";
import { getLikeById, getSaveById, updateLike, updateSavePost } from "../../../../services/posts";
import { RootState } from "../../../../redux/store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/main";
import { Avatar } from "react-native-paper";
import RecipeModal from "./RecipeModal";
import OtherModal from "./OtherModal";
import { LikeButton, SaveButton, RecipeButton, OtherButton } from "./buttons";

/**
 * Function that renders a component meant to be overlapped on
 * top of the post with the post info like user's display name and avatar
 * and the post's description
 *
 * @param {User} user that created the post
 * @param {Post} post object
 */
export default function PostSingleOverlay({
  user,
  post,
}: {
  user: User;
  post: Post;
}) {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [currentLikeState, setCurrentLikeState] = useState({
    state: false,
    counter: post.likesCount,
  });
  const hasRecipe: boolean = Boolean(post.recipe);
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);
  const [otherModalVisible, setOtherModalVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      getLikeById(post.id, currentUser.uid).then((res) => {
        setCurrentLikeState({
          ...currentLikeState,
          state: res,
        });
      });
      //TODO: Implement the getSaveByID
      getSaveById(post.id, currentUser.uid).then((res) => {
        setIsSaved(res);
      });
    }
  }, []);

  /**
   * Handles the like button action.
   *
   * In order to make the action more snappy the like action
   * is optimistic, meaning we don't wait for a response from the
   * server and always assume the write/delete action is successful
   */
  const handleUpdateLike = useMemo(
    () =>
      throttle(500, (currentLikeStateInst: typeof currentLikeState) => {
        setCurrentLikeState({
          state: !currentLikeStateInst.state,
          counter:
            currentLikeStateInst.counter +
            (currentLikeStateInst.state ? -1 : 1),
        });
        if (currentUser) {
          updateLike(post.id, currentUser.uid, currentLikeStateInst.state);
        }
      }),
    [],
  );

  const handleSavePost = useMemo(
    () =>
      throttle(500, (currentSaveState: boolean) => {
        setIsSaved(!currentSaveState);
        if (currentUser) {
          updateSavePost(post.id, currentUser.uid, currentSaveState);
        }
      }),
    [],
  );

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.userInfoContainer}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() =>
              navigation.navigate("profileOther", {
                initialUserId: user?.uid ?? "",
              })
            }
          >
            {user.photoURL ? (
              <Image style={styles.avatar} source={{ uri: user.photoURL }} />
            ) : (
              <Avatar.Icon
                style={styles.defaultAvatar}
                size={54}
                icon={"account"}
              />
            )}
          </TouchableOpacity>
          
          <View style={styles.infoContainer}>
            <Text style={styles.displayName}>{user.displayName || user.email}</Text>
            <Text style={styles.description}>{post.description}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <LikeButton
          isLiked={currentLikeState.state}
          likeCount={currentLikeState.counter}
          onPress={() => handleUpdateLike(currentLikeState)}
        />
        <SaveButton
          isSaved={isSaved}
          onPress={() => handleSavePost(isSaved)}
        />
        {hasRecipe && (
          <RecipeButton onPress={() => setRecipeModalVisible(true)} />
        )}
        <OtherButton onPress={() => setOtherModalVisible(true)} />
      </View>
      <RecipeModal
        visible={recipeModalVisible}
        onClose={() => setRecipeModalVisible(false)}
        post={post}
      />
      <OtherModal
        visible={otherModalVisible}
        onClose={() => setOtherModalVisible(false)}
        user={user}
        post={post}
      />
    </View>
  );
}
