import { useEffect, useMemo, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal, ToastAndroid, Platform, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import { Post, User } from "../../../../../types";
import { useDispatch, useSelector } from "react-redux";
import { throttle } from "throttle-debounce";
import { getLikeById, updateLike } from "../../../../services/posts";
import { AppDispatch, RootState } from "../../../../redux/store";
import { openCommentModal } from "../../../../redux/slices/modalSlice";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/main";
import { Avatar } from "react-native-paper";
import RecipeView from "../../recipe";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../../../firebaseConfig";

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

  const handleUpdateCommentCount = () => {
    setCurrentCommentsCount((prevCount) => prevCount + 1);
  };

  const handleSavePost = () => {
    setIsSaved(!isSaved);
    // Show feedback to the user
    if (Platform.OS === 'android') {
      ToastAndroid.show(`Recipe ${!isSaved ? 'saved' : 'unsaved'}!`, ToastAndroid.SHORT);
    } else {
      Alert.alert(`Recipe ${!isSaved ? 'saved' : 'unsaved'}!`);
    }
    // This is a no-op for now, but would connect to a save service in the future
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.displayName}>{user.displayName || user.email}</Text>
        <Text style={styles.description}>{post.description}</Text>
      </View>
      <View style={styles.leftContainer}>
        <TouchableOpacity
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
              size={50}
              icon={"account"}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleUpdateLike(currentLikeState)}
        >
          <Ionicons
            color="white"
            size={40}
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
          <Ionicons color="white" size={40} name={"chatbubble"} />
          <Text style={styles.actionButtonText}>{currentCommentsCount}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSavePost}
        >
          <Ionicons color="white" size={40} name={isSaved ? "bookmark" : "bookmark-outline"} />
          <Text style={styles.actionButtonText}>Save</Text>
        </TouchableOpacity>
        
        {hasRecipe && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setRecipeModalVisible(true)}
          >
            <Ionicons color="white" size={40} name={"restaurant"} />
            <Text style={styles.actionButtonText}>Recipe</Text>
          </TouchableOpacity>
        )}
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
              <Ionicons name="close" size={30} color="#FF4D67" />
            </TouchableOpacity>
            <RecipeView post={post} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
