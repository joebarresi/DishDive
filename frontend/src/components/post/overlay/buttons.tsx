import { TouchableOpacity, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Share from 'react-native-share';
import * as Linking from 'expo-linking';
import styles from "./styles";
import { Post, User } from "../../../../types";

const ICON_SIZE = 36;

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  onPress: () => void;
}

interface SaveButtonProps {
  isSaved: boolean;
  onPress: () => void;
}

interface ShareButtonProps {
  post: Post;
  user: User;
  onPress: () => void;
}

interface OtherButtonProps {
  onPress: () => void;
}

export function LikeButton({ isLiked, likeCount, onPress }: LikeButtonProps) {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Ionicons
        color="white"
        size={ICON_SIZE}
        name={isLiked ? "heart" : "heart-outline"}
      />
      <Text style={styles.actionButtonText}>{likeCount}</Text>
    </TouchableOpacity>
  );
}

export function SaveButton({ isSaved, onPress }: SaveButtonProps) {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Ionicons
        color="white"
        size={ICON_SIZE}
        name={isSaved ? "bookmark" : "bookmark-outline"}
      />
      <Text style={styles.actionButtonText}>Save</Text>
    </TouchableOpacity>
  );
}

export function ShareButton({ post, user, onPress }: ShareButtonProps) {
  const handlePress = async () => {
    try {
      // Create a deep link to the specific post
      const postUrl = Linking.createURL('post', {
        queryParams: { postId: post.id }
      });
      
      // Create a more detailed share message with URL included
      const recipeTitle = post.recipe?.title ? ` - "${post.recipe.title}"` : '';
      const shareMessage = `Check out this ${recipeTitle ? 'recipe' : 'post'}${recipeTitle} by ${user.displayName || 'a chef'} on DishDive!\n${postUrl}`;
      
      const shareOptions = {
        title: 'Share from DishDive',
        message: shareMessage,
        subject: `DishDive${recipeTitle}`, // For email sharing
      };
      
      await Share.open(shareOptions);
      
    } catch (error) {
      if (error.message !== 'User did not share') {
        console.error('Error sharing:', error);
        Alert.alert("Error", "Failed to share the post. Please try again.");
      }
    }
    
    onPress();
  };

  return (
    <TouchableOpacity style={styles.actionButton} onPress={handlePress}>
      <Ionicons color="white" size={ICON_SIZE} name="share-outline" />
      <Text style={styles.actionButtonText}>Share</Text>
    </TouchableOpacity>
  );
}

export function OtherButton({ onPress }: OtherButtonProps) {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Ionicons color="white" size={ICON_SIZE} name="ellipsis-horizontal" />
    </TouchableOpacity>
  );
}
