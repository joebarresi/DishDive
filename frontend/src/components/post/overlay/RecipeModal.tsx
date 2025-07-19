import { Modal, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Post } from "../../../../types";
import RecipeView from "../../recipe/recipe";
import styles from "./styles";

interface RecipeModalProps {
  visible: boolean;
  onClose: () => void;
  post: Post;
}

export default function RecipeModal({ visible, onClose, post }: RecipeModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons name="close" size={36} color="#8B54FB" />
          </TouchableOpacity>
          <RecipeView post={post} />
        </View>
      </View>
    </Modal>
  );
}