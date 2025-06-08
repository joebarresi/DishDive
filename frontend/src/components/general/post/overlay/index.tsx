import { useEffect, useMemo, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import { Post, User } from "../../../../../types";
import { useDispatch, useSelector } from "react-redux";
import { throttle } from "throttle-debounce";
import { getLikeById, updateLike, updateSavePost } from "../../../../services/posts";
import { AppDispatch, RootState } from "../../../../redux/store";
import { openCommentModal } from "../../../../redux/slices/modalSlice";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/main";
import { Avatar } from "react-native-paper";
import RecipeView from "../../recipe";

// Define a constant for icon size
const ICON_SIZE = 36; // Increased by 50% from 24

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
  const dispatch: AppDispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [currentLikeState, setCurrentLikeState] = useState({
    state: false,
    counter: post.likesCount,
  });
  const [currentCommentsCount, setCurrentCommentsCount] = useState(
    post.commentsCount,
  );
  const hasRecipe: boolean = Boolean(post.recipe);
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      getLikeById(post.id, currentUser.uid).then((res) => {
        setCurrentLikeState({
          ...currentLikeState,
          state: res,
        });
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

  const handleUpdateCommentCount = () => {
    setCurrentCommentsCount((prevCount) => prevCount + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.displayName}>{user.displayName || user.email}</Text>
        <Text style={styles.description}>{post.description}</Text>
      </View>
      
      <View style={styles.actionsContainer}>
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
        
        <View style={styles.interactionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleUpdateLike(currentLikeState)}
          >
            <Ionicons
              color="white"
              size={ICON_SIZE}
              name={currentLikeState.state ? "heart" : "heart-outline"}
            />
            <Text style={styles.actionButtonText}>
              {currentLikeState.counter}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              dispatch(
                openCommentModal({
                  open: true,
                  data: post,
                  modalType: 0,
                  onCommentSend: handleUpdateCommentCount,
                }),
              )
            }
          >
            <Ionicons color="white" size={ICON_SIZE} name={"chatbubble"} />
            <Text style={styles.actionButtonText}>{currentCommentsCount}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSavePost(isSaved)}
          >
            <Ionicons color="white" size={ICON_SIZE} name={isSaved ? "bookmark" : "bookmark-outline"} />
            <Text style={styles.actionButtonText}>Save</Text>
          </TouchableOpacity>
          
          {hasRecipe && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setRecipeModalVisible(true)}
            >
              <Ionicons color="white" size={ICON_SIZE} name={"restaurant"} />
              <Text style={styles.actionButtonText}>Recipe</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Recipe Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={recipeModalVisible}
        onRequestClose={() => setRecipeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setRecipeModalVisible(false)}
            >
              <Ionicons name="close" size={ICON_SIZE} color="#FF4D67" />
            </TouchableOpacity>
            <RecipeView post={post} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
