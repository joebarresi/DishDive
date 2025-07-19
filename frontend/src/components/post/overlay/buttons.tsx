import { TouchableOpacity, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";

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

export function ShareButton({ onPress }: ShareButtonProps) {
  const handlePress = () => {
    Alert.alert("Sharing", "Sharing coming soon!");
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
