import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
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
import { ExternalPost, Post } from "../../../types";
import { APP_COLOR } from "../../styles";
import RecipeGridItem from "../../components/recipe/RecipeGridItem";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

//Function that takes in a post or externalPost and returns if it is an externalPost
const isExternalPost = (post: Post | ExternalPost): post is ExternalPost => {
  return (post as ExternalPost).link !== undefined;
};

const SavedScreen = () => {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchBarHeight = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef<TextInput>(null);
  const reduxLoading = useSelector((state: RootState) => state.post.loading);
  const reduxLoadingRef = useRef(reduxLoading);

  useEffect(() => {
    fetchSavedPosts();
  }, []);
  
  // Handles auto-refresh
  useEffect(() => {
    if (reduxLoadingRef.current === true && reduxLoading === false) {
      // Redux loading just finished, refresh posts
      fetchSavedPosts();
    }
    reduxLoadingRef.current = reduxLoading;
  }, [reduxLoading]);

  // Filter posts when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(savedPosts);
    } else {
      const query = searchQuery.toLowerCase();
      // TODO: this will need to get optimized
      const filtered = savedPosts.filter(post => {
        const title = post.recipe?.title?.toLowerCase() || "";
        const ingredients = post.recipe?.ingredients?.join(" ").toLowerCase() || "";
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
      
      const savedExternalPostsRef = collection(FIREBASE_DB, "saves", currentUser.uid, "externalPost");
      const savedExternalPostsSnapshot = await getDocs(savedExternalPostsRef);
      
      if (savedPostsSnapshot.empty && savedExternalPostsSnapshot.empty) {
        setSavedPosts([]);
        setFilteredPosts([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const postPromises = savedPostsSnapshot.docs.map(async (document) => {
        const postId = document.id;
        const postDoc = await getDoc(doc(FIREBASE_DB, "post", postId));
        
        if (postDoc.exists()) {
          return { id: postDoc.id, ...postDoc.data() } as Post;
        }
        return null;
      });
      
      const externalPostPromises = savedExternalPostsSnapshot.docs.map(async (document) => {
        const postId = document.data().post;
        const postDoc = await getDoc(doc(FIREBASE_DB, "externalPost", postId));
        
        if (postDoc.exists()) {
          // Create a Post object from the external post data
          const data = postDoc.data();
          return { 
            id: postDoc.id,
            ...data
          } as ExternalPost;
        }
        return null;
      });

      // Combine both types of posts
      const allPromises = [...postPromises, ...externalPostPromises];
      const posts = (await Promise.all(allPromises)).filter(post => post !== null) as Post[];
      
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

  const renderGridItem = ({ item, index }: { item: Post | ExternalPost, index: number }) => (
    <RecipeGridItem
      item={item} 
      index={index}
      filteredPosts={filteredPosts}
    />
  );

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
      
      {/* Commenting out until we decide what to do 
      Add External Recipe Button
      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={openRecipeModal}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Add External Recipe</Text>
        </TouchableOpacity>
      </View> */}

    </SafeAreaView>
  );
};

export default SavedScreen;
