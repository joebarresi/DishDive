import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/main";
import styles from "./styles";
import { httpsCallable } from "firebase/functions";
import { FIREBASE_FUNCTIONS } from "../../../firebaseConfig";
import { Recipe } from "../../../types";

type WhatIHaveNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Ingredient {
  id: string;
  name: string;
  amount: string;
}

export default function WhatIHaveScreen() {
  const navigation = useNavigation<WhatIHaveNavigationProp>();
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: '', amount: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const addIngredient = () => {
    setIngredients([
      ...ingredients, 
      { id: Date.now().toString(), name: '', amount: '' }
    ]);
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length === 1) {
      // Don't remove the last ingredient, just clear it
      setIngredients([{ id: '1', name: '', amount: '' }]);
      return;
    }
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
  };

  const updateIngredient = (id: string, field: 'name' | 'amount', value: string) => {
    setIngredients(
      ingredients.map(ingredient => 
        ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
      )
    );
  };

  const validateIngredients = () => {
    // Check if at least one ingredient has a name
    return ingredients.some(ingredient => ingredient.name.trim() !== '');
  };

  // Mock sousChef API call
  const sousChef = async () => {
    if (!validateIngredients()) {
      Alert.alert("Missing Ingredients", "Please enter at least one ingredient");
      return;
    }

    setLoading(true);

    const getRecipe = await httpsCallable(
      FIREBASE_FUNCTIONS, 
      "generateRecipeFromIngredients"
    );

    let genRecipe;
    
    await getRecipe({
      ingredients: ingredients,
    }).then((result) => {
      genRecipe = result.data;
    });

    setRecipe(genRecipe!);
    setLoading(false);
  };

  const resetForm = () => {
    setRecipe(null);
    setIngredients([{ id: '1', name: '', amount: '' }]);
  };
  
  const tryAnotherRecipe = async () => {
    if (!validateIngredients()) {
      Alert.alert("Missing Ingredients", "Please enter at least one ingredient");
      return;
    }

    setLoading(true);

    const getRecipe = await httpsCallable(
      FIREBASE_FUNCTIONS, 
      "generateRecipeFromIngredients"
    );

    let genRecipe;
    
    await getRecipe({
      ingredients: ingredients,
      prevRecipeTitle: recipe?.title
    }).then((result) => {
      genRecipe = result.data;
    });

    setRecipe(genRecipe!);
    setLoading(false);
    
  };

  const renderIngredientItem = ({ item }: { item: Ingredient }) => (
    <View style={styles.ingredientRow}>
      <TextInput
        style={styles.ingredientNameInput}
        placeholder="Ingredient name"
        value={item.name}
        onChangeText={(value) => updateIngredient(item.id, 'name', value)}
      />
      <TextInput
        style={styles.ingredientAmountInput}
        placeholder="Amount"
        value={item.amount}
        onChangeText={(value) => updateIngredient(item.id, 'amount', value)}
      />
      <TouchableOpacity 
        style={styles.removeIngredientButton}
        onPress={() => removeIngredient(item.id)}
      >
        <Feather name="x" size={20} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  const renderRecipe = () => (
    <ScrollView style={styles.recipeContainer}>
      <View style={styles.recipeHeader}>
        <Text style={styles.recipeTitle}>{recipe?.title}</Text>
        <TouchableOpacity 
          style={styles.closeRecipeButton}
          onPress={resetForm}
        >
          <Feather name="x" size={24} color="#666" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.recipeSubtitle}>Ingredients</Text>
      {recipe?.ingredients.map((ingredient, index) => (
        <View key={index} style={styles.recipeIngredientItem}>
          <Feather name="check" size={16} color="#6B5B95" />
          <Text style={styles.recipeIngredientText}>{ingredient}</Text>
        </View>
      ))}
      
      <Text style={styles.recipeSubtitle}>Instructions</Text>
      {recipe?.steps.map((step, index) => (
        <View key={index} style={styles.recipeStepItem}>
          <Text style={styles.recipeStepNumber}>{index + 1}</Text>
          <Text style={styles.recipeStepText}>{step}</Text>
        </View>
      ))}
      
      <TouchableOpacity 
        style={styles.newRecipeButton}
        onPress={tryAnotherRecipe}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.newRecipeButtonText}>Try Another?</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>What I Have at Home</Text>
      </View>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {recipe ? (
          renderRecipe()
        ) : (
          <>
            <Text style={styles.whatIHaveSubtitle}>
              Enter ingredients you have and get recipe suggestions
            </Text>
            
            <FlatList
              data={ingredients}
              renderItem={renderIngredientItem}
              keyExtractor={(item) => item.id}
              style={styles.ingredientList}
              ListFooterComponent={
                <TouchableOpacity 
                  style={styles.addIngredientButton}
                  onPress={addIngredient}
                >
                  <Feather name="plus" size={20} color="#6B5B95" />
                  <Text style={styles.addIngredientText}>Add Another Ingredient</Text>
                </TouchableOpacity>
              }
            />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.generateRecipeButton}
                onPress={sousChef}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Text style={styles.generateRecipeText}>Generate Recipe</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
