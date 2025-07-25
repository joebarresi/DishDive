import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styles from "./styles";
import { Feather } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { finishSavePost } from "../../redux/slices/postSlice";

import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/main";
import { AppDispatch } from "../../redux/store";
import { HomeStackParamList } from "../../navigation/home";
import { Recipe } from "../../../types";
import RecipeEditor from "../../components/recipe/recipeEditor";
import { getDoc } from "firebase/firestore";
import ScreenContainer from "../../components/common/ScreenContainer";

interface SavePostScreenProps {
  route: RouteProp<RootStackParamList, "savePost">;
}

export default function SavePostScreen({ route }: SavePostScreenProps) {
  const { isEdit } = route.params;

  const [description, setDescription] = useState("");
  const [requestRunning, setRequestRunning] = useState(false);
  const [loadingRecipe, setLoadingRecipe] = useState(true);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        setLoadingRecipe(true);
        const docRef = route.params.docRef;
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const postData = docSnap.data();
          if (postData.recipe) {
            setRecipe(postData.recipe);
          } else {
            // If no recipe exists yet, create an empty one
            setRecipe({
              title: "Recipe Title",
              ingredients: [""],
              steps: [""]
            });
          }
          
          if (isEdit) {
            setDescription(postData.description);
          }
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        Alert.alert("Error", "Failed to load recipe data");
      } finally {
        setLoadingRecipe(false);
      }
    };

    fetchRecipeData();
  }, [route.params.docRef]);

  const handleRecipeChange = (updatedRecipe: Recipe) => {
    setRecipe(updatedRecipe);
  };

  const handleSavePost = () => {
    if (!description.trim()) {
      Alert.alert("Missing Description", "Please add a description for your post.");
      return;
    }
    
    setRequestRunning(true);
    dispatch(
      finishSavePost({
        docReference: route.params.docRef,
        description,
        recipe: recipe || undefined,
      }),
    )
      .then(() => navigation.navigate("Feed"))
      .catch((error) => {
        console.error("Error saving post:", error);
        Alert.alert("Error", "Failed to save your post. Please try again.");
        setRequestRunning(false);
      });
  };

  // Loading component for the ScreenContainer
  const loadingComponent = (
    <View style={styles.uploadingContainer}>
      <ActivityIndicator color="#8B54FB" size="large" />
      <Text style={styles.uploadingText}>Saving your post...</Text>
    </View>
  );

  return (
    <ScreenContainer 
      title={isEdit ? "Edit Post" : "Create Post"}
      showBackButton={true}
      loading={requestRunning}
      loadingComponent={loadingComponent}
      style={{ paddingHorizontal: 0 }} // Override default padding
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mediaDescriptionSection}>
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionLabel}>Description</Text>
              <TextInput
                style={styles.descriptionInput}
                maxLength={150}
                multiline
                numberOfLines={4}
                onChangeText={(text) => setDescription(text)}
                placeholder={isEdit ? description : "Describe your recipe video..."}
                placeholderTextColor="#999"
                textAlignVertical="top"
              />
              <Text style={styles.characterCount}>{description.length}/150</Text>
            </View>
            
            <Image
              style={styles.mediaPreview}
              source={{ uri: route.params.source }}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.recipeSection}>
            {loadingRecipe ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#8B54FB" size="large" />
                <Text style={styles.loadingText}>Loading recipe...</Text>
              </View>
            ) : (
              <RecipeEditor 
                initialRecipe={recipe} 
                onRecipeChange={handleRecipeChange} 
              />
            )}
          </View>
        </ScrollView>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={handleSavePost}
            style={styles.fullWidthPostButton}
            disabled={requestRunning}
          >
            <Feather name="check" size={24} color="white" />
            <Text style={styles.postButtonText}>{isEdit ? "Edit Post" : "Post"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
