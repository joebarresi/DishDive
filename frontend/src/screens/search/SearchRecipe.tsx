import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  Image, 
  ActivityIndicator,
  Modal,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/main";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Post, CuisineTags, DietTags } from "../../../types";
import styles from "./styles";

type SearchRecipeNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SearchRecipeScreen() {
  const navigation = useNavigation<SearchRecipeNavigationProp>();
  const [searchText, setSearchText] = useState("");
  const [recipes, setRecipes] = useState<Post[]>([]);
  const [allRecipes, setAllRecipes] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  
  // Filter states
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineTags | null>(null);
  const [selectedDiet, setSelectedDiet] = useState<DietTags | null>(null);
  const [showCuisineModal, setShowCuisineModal] = useState(false);
  const [showDietModal, setShowDietModal] = useState(false);

  // Load all recipes on component mount
  useEffect(() => {
    loadAllRecipes();
  }, []);

  const loadAllRecipes = async () => {
    setLoading(true);
    
    try {
      const q = query(
        collection(FIREBASE_DB, "post"),
        where("recipe", "!=", null)
      );
      
      const querySnapshot = await getDocs(q);
      const recipePosts = querySnapshot.docs.map((doc) => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data } as Post;
      });
      
      setAllRecipes(recipePosts);
    } catch (error) {
      console.error("Error loading recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever search text, cuisine, or diet changes
  useEffect(() => {
    applyFilters();
  }, [searchText, selectedCuisine, selectedDiet, allRecipes]);

  const applyFilters = () => {
    if (allRecipes.length === 0) return;
    
    let filteredRecipes = [...allRecipes];
    
    // Apply text search if provided
    if (searchText.trim()) {
      filteredRecipes = filteredRecipes.filter(post => 
        post.recipe?.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearched(true);
    }
    
    // Apply cuisine filter if selected
    if (selectedCuisine) {
      filteredRecipes = filteredRecipes.filter(post => 
        post.cuisineTags?.includes(selectedCuisine)
      );
    }
    
    // Apply diet filter if selected
    if (selectedDiet) {
      filteredRecipes = filteredRecipes.filter(post => 
        post.dietTags?.includes(selectedDiet)
      );
    }
    
    setRecipes(filteredRecipes);
  };

  const searchRecipes = () => {
    setSearched(true);
    applyFilters();
  };

  const clearFilters = () => {
    setSelectedCuisine(null);
    setSelectedDiet(null);
  };

  const renderRecipeItem = ({ item }: { item: Post }) => (
    <TouchableOpacity 
      style={styles.recipeItem}
      onPress={() => navigation.navigate("post", { item })}
    >
      {item.media && item.media.length > 0 ? (
        <Image 
          source={{ uri: item.media[1] || item.media[0] }} 
          style={styles.recipeThumbnail} 
        />
      ) : (
        <View style={[styles.recipeThumbnail, styles.noImagePlaceholder]}>
          <Feather name="image" size={24} color="#888" />
        </View>
      )}
      
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle} numberOfLines={2}>
          {item.recipe?.title || "Untitled Recipe"}
        </Text>
        <Text style={styles.recipeDescription} numberOfLines={1}>
          {item.description}
        </Text>
        
        {/* Tags display */}
        <View style={styles.tagContainer}>
          {item.cuisineTags && item.cuisineTags.length > 0 && (
            <Text style={styles.tagText} numberOfLines={1}>
              {item.cuisineTags[0]}
              {item.cuisineTags.length > 1 ? ` +${item.cuisineTags.length - 1}` : ''}
            </Text>
          )}
          
          {item.dietTags && item.dietTags.length > 0 && (
            <Text style={styles.dietTagText} numberOfLines={1}>
              {item.dietTags[0]}
              {item.dietTags.length > 1 ? ` +${item.dietTags.length - 1}` : ''}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyResult = () => {
    if (!searched && !selectedCuisine && !selectedDiet) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Feather name="search" size={48} color="#ccc" />
        <Text style={styles.emptyTitle}>No recipes found</Text>
        <Text style={styles.emptyDescription}>
          Try searching with different keywords or filters
        </Text>
        {(selectedCuisine || selectedDiet) && (
          <TouchableOpacity 
            style={styles.clearFiltersButton}
            onPress={clearFilters}
          >
            <Text style={styles.clearFiltersText}>Clear Filters</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Render cuisine selection modal
  const renderCuisineModal = () => (
    <Modal
      visible={showCuisineModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCuisineModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Cuisine</Text>
            <TouchableOpacity onPress={() => setShowCuisineModal(false)}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollView}>
            <TouchableOpacity 
              style={styles.modalItem}
              onPress={() => {
                setSelectedCuisine(null);
                setShowCuisineModal(false);
              }}
            >
              <Text style={styles.modalItemText}>All Cuisines</Text>
              {selectedCuisine === null && (
                <Feather name="check" size={20} color="#FF6B6B" />
              )}
            </TouchableOpacity>
            
            {Object.values(CuisineTags).map((cuisine) => (
              <TouchableOpacity 
                key={cuisine}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedCuisine(cuisine as CuisineTags);
                  setShowCuisineModal(false);
                }}
              >
                <Text style={styles.modalItemText}>{cuisine}</Text>
                {selectedCuisine === cuisine && (
                  <Feather name="check" size={20} color="#FF6B6B" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Render diet selection modal
  const renderDietModal = () => (
    <Modal
      visible={showDietModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowDietModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Diet</Text>
            <TouchableOpacity onPress={() => setShowDietModal(false)}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollView}>
            <TouchableOpacity 
              style={styles.modalItem}
              onPress={() => {
                setSelectedDiet(null);
                setShowDietModal(false);
              }}
            >
              <Text style={styles.modalItemText}>All Diets</Text>
              {selectedDiet === null && (
                <Feather name="check" size={20} color="#FF6B6B" />
              )}
            </TouchableOpacity>
            
            {Object.values(DietTags).map((diet) => (
              <TouchableOpacity 
                key={diet}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedDiet(diet as DietTags);
                  setShowDietModal(false);
                }}
              >
                <Text style={styles.modalItemText}>{diet}</Text>
                {selectedDiet === diet && (
                  <Feather name="check" size={20} color="#FF6B6B" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Recipes</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes..."
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={searchRecipes}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Feather name="x" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.searchButton, !searchText.trim() && styles.disabledButton]} 
          onPress={searchRecipes}
          disabled={!searchText.trim()}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
        
        {/* Filter dropdowns */}
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, selectedCuisine && styles.activeFilterButton]} 
            onPress={() => setShowCuisineModal(true)}
          >
            <Text style={[styles.filterButtonText, selectedCuisine && styles.activeFilterText]}>
              {selectedCuisine || "Cuisine"}
            </Text>
            <Feather 
              name="chevron-down" 
              size={16} 
              color={selectedCuisine ? "#fff" : "#666"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, selectedDiet && styles.activeFilterButton]} 
            onPress={() => setShowDietModal(true)}
          >
            <Text style={[styles.filterButtonText, selectedDiet && styles.activeFilterText]}>
              {selectedDiet || "Diet"}
            </Text>
            <Feather 
              name="chevron-down" 
              size={16} 
              color={selectedDiet ? "#fff" : "#666"} 
            />
          </TouchableOpacity>
          
          {(selectedCuisine || selectedDiet) && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={clearFilters}
            >
              <Feather name="x" size={16} color="#FF6B6B" />
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.recipeList}
          ListEmptyComponent={renderEmptyResult}
        />
      )}
      
      {renderCuisineModal()}
      {renderDietModal()}
    </SafeAreaView>
  );
}
