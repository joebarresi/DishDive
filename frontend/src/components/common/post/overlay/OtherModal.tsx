import { Modal, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Post, User } from "../../../../../types";
import styles from "./styles";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { deletePost } from "../../../../services/posts";
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../../../../navigation/home";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface OtherModalProps {
  visible: boolean;
  onClose: () => void;
  user: User;
  post: Post;
}

export default function OtherModal({ visible, onClose, user, post }: OtherModalProps) {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const myPost = currentUser && user.uid === currentUser.uid;
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>()
  function deletePostAndNavigate(): void {
    deletePost(post);
    const params = { 
      initialUserId: user.uid,
    }
    navigation.navigate("Me", params)
  }

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
          
          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity style={modalStyles.button}>
              <Text style={modalStyles.buttonText}>[PlaceHolder] Share</Text>
            </TouchableOpacity>
            
            {myPost && (
              <TouchableOpacity style={modalStyles.deleteButton} onPress={() => deletePostAndNavigate()}>
                <Text style={modalStyles.deleteButtonText}>Delete Post</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  buttonContainer: {
    marginTop: 40,
  },
  button: {
    width: "100%",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
  },
  deleteButton: {
    width: "100%",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  deleteButtonText: {
    fontSize: 16,
    color: "#8B54FB",
    fontWeight: "bold",
  },
});