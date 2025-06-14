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
  SafeAreaView,
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
import RecipeEditor from "../../components/general/recipeEditor";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";

interface SavePostScreenProps {
  route: RouteProp<RootStackParamList, "savePost">;
}

export default function SavePostScreen({ route }: SavePostScreenProps) {
  const [description, setDescription] = useState("");
  const [requestRunning, setRequestRunning] = useState(false);
  const [loadingRecipe, setLoadingRecipe] = useState(true);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const dispatch: AppDispatch = useDispatch();

  // Fetch the recipe data when the component mounts
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

  if (requestRunning) {
    return (
      <View style={styles.uploadingContainer}>
        <ActivityIndicator color="#FF4D67" size="large" />
        <Text style={styles.uploadingText}>Saving your post...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create Post</Text>
          </View>
          
          <View style={styles.mediaDescriptionSection}>
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionLabel}>Description</Text>
              <TextInput
                style={styles.descriptionInput}
                maxLength={150}
                multiline
                numberOfLines={4}
                onChangeText={(text) => setDescription(text)}
                placeholder="Describe your recipe video..."
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
                <ActivityIndicator color="#FF4D67" size="large" />
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
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            <Feather name="x" size={24} color="#666" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSavePost}
            style={styles.postButton}
            disabled={requestRunning}
          >
            <Feather name="check" size={24} color="white" />
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
