import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Modal, 
  ActivityIndicator 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../firebaseConfig";
import NavBarGeneral from "../../components/general/navbar";
import styles from "./styles";
import { Post, PostSingleHandles } from "../../../types";
import PostSingle from "../../components/general/post";

const RecipesScreen = () => {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const postRef = useRef<PostSingleHandles | null>(null);

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  // When modal is closed, stop the video
  useEffect(() => {
    if (!modalVisible && postRef.current) {
      postRef.current.stop();
    }
  }, [modalVisible]);

  const fetchSavedPosts = async () => {
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (!currentUser) {
        setLoading(false);
        return;
      }

      // Get all saved post IDs for the current user
      const savedPostsRef = collection(FIREBASE_DB, "saves", currentUser.uid, "posts");
      const savedPostsSnapshot = await getDocs(savedPostsRef);
      
      if (savedPostsSnapshot.empty) {
        setLoading(false);
        return;
      }

      // Get the full post data for each saved post ID
      const postPromises = savedPostsSnapshot.docs.map(async (document) => {
        const postId = document.id;
        const postDoc = await getDoc(doc(FIREBASE_DB, "post", postId));
        
        if (postDoc.exists()) {
          return { id: postDoc.id, ...postDoc.data() } as Post;
        }
        return null;
      });

      const posts = (await Promise.all(postPromises)).filter(post => post !== null) as Post[];
      setSavedPosts(posts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      setLoading(false);
    }
  };

  const handlePostPress = (post: Post) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPost(null);
  };

  const renderGridItem = ({ item }: { item: Post }) => {
    return (
      <TouchableOpacity 
        style={styles.gridItem} 
        onPress={() => handlePostPress(item)}
      >
        <Image 
          source={{ uri: item.media[1] }} // Use the thumbnail image
          style={styles.gridItemImage}
          resizeMode="cover"
        />
        <View style={styles.gridItemTitle}>
          <Text style={styles.gridItemTitleText} numberOfLines={1}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavBarGeneral leftButton={{ display: false }} title="Saved Recipes" />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF4D67" />
        </View>
      ) : savedPosts.length > 0 ? (
        <FlatList
          data={savedPosts}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>
            You haven't saved any recipes yet. Save recipes by tapping the bookmark icon on posts you like!
          </Text>
        </View>
      )}

      {/* Full Post Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          
          {selectedPost && (
            <View style={{ flex: 1 }}>
              <PostSingle 
                item={selectedPost} 
                ref={(ref) => {
                  postRef.current = ref;
                  // Auto-play when modal opens
                  if (ref) {
                    ref.play();
                  }
                }}
              />
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default RecipesScreen;
