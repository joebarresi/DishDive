import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Modal, 
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TextInput,
  Animated,
  Keyboard
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../firebaseConfig";
import NavBarGeneral from "../../components/common/navbar";
import styles from "./styles";
import { Post, PostSingleHandles } from "../../../types";
import PostSingle from "../../components/common/post";
import { APP_COLOR } from "../../styles";
import RecipeModal from "../../components/common/RecipeModal";

const RecipesScreen = () => {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);
  const postRef = useRef<PostSingleHandles | null>(null);
  const searchBarHeight = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  // When modal is closed, stop the video
  useEffect(() => {
    if (!modalVisible && postRef.current) {
      postRef.current.stop();
    }
  }, [modalVisible]);

  // Filter posts when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(savedPosts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = savedPosts.filter(post => {
        // Search in recipe title
        const title = post.recipe?.title?.toLowerCase() || "";
        // Search in recipe ingredients
        const ingredients = post.recipe?.ingredients?.join(" ").toLowerCase() || "";
        // Search in post description
        const description = post.description?.toLowerCase() || "";
        
        return title.includes(query) || ingredients.includes(query) || description.includes(query);
      });
      setFilteredPosts(filtered);
    }
  }, [searchQuery, savedPosts]);

  const fetchSavedPosts = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const currentUser = FIREBASE_AUTH.currentUser;
      if (!currentUser) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const savedPostsRef = collection(FIREBASE_DB, "saves", currentUser.uid, "posts");
      const savedPostsSnapshot = await getDocs(savedPostsRef);
      
      if (savedPostsSnapshot.empty) {
        setSavedPosts([]);
        setFilteredPosts([]);
        setLoading(false);
        setRefreshing(false);
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
      setFilteredPosts(posts);
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      setSavedPosts([]);
      setFilteredPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setSearchQuery("");
    fetchSavedPosts(true);
  };

  const handlePostPress = (post: Post) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPost(null);
  };

  const toggleSearch = () => {
    if (searchVisible) {
      // Hide search bar
      Keyboard.dismiss();
      setSearchQuery("");
      Animated.timing(searchBarHeight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        setSearchVisible(false);
      });
    } else {
      // Show search bar
      setSearchVisible(true);
      Animated.timing(searchBarHeight, {
        toValue: 60,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        searchInputRef.current?.focus();
      });
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  const openRecipeModal = () => {
    setRecipeModalVisible(true);
  };

  const closeRecipeModal = () => {
    setRecipeModalVisible(false);
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
            {item.recipe?.title || "Untitled Recipe"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render content based on loading state and posts availability
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={APP_COLOR} />
        </View>
      );
    } else if (filteredPosts.length > 0) {
      return (
        <FlatList
          data={filteredPosts}
          renderItem={renderGridItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={APP_COLOR}
              colors={[APP_COLOR]}
              progressBackgroundColor="#ffffff"
            />
          }
        />
      );
    } else if (searchQuery && savedPosts.length > 0) {
      // No results for search query
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>
            No recipes found matching "{searchQuery}"
          </Text>
          <TouchableOpacity 
            style={styles.clearSearchButton}
            onPress={clearSearch}
          >
            <Text style={styles.clearSearchText}>Clear Search</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      // No saved recipes
      return (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={APP_COLOR}
              colors={[APP_COLOR]}
              progressBackgroundColor="#ffffff"
            />
          }
        >
          <Ionicons name="bookmark-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>
            You haven't saved any recipes yet. Save recipes by tapping the bookmark icon on posts you like!
          </Text>
        </ScrollView>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavBarGeneral 
        leftButton={{ display: false }} 
        title="Saved Recipes" 
        rightButton={{
          display: true,
          name: searchVisible ? "x" : "search",
          action: toggleSearch,
          color: "black"
        }}
      />
      
      {/* Animated Search Bar */}
      <Animated.View style={[styles.searchBarContainer, { height: searchBarHeight }]}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search recipes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Feather name="x" size={18} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
      
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
      
      {/* Add External Recipe Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={openRecipeModal}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Add External Recipe</Text>
        </TouchableOpacity>
      </View>

      {/* Recipe Modal */}
      <RecipeModal 
        visible={recipeModalVisible}
        onClose={closeRecipeModal}
      />

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
